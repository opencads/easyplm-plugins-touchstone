import { args, setLoggerPath } from '../.tsc/context';
import { Json } from '../.tsc/TidyHPC/LiteJson/Json';
import { apis } from '../.tsc/Cangjie/TypeSharp/System/apis';
import { axios } from '../.tsc/Cangjie/TypeSharp/System/axios';
import { Path } from '../.tsc/System/IO/Path';
import { File } from '../.tsc/System/IO/File';
import { UTF8Encoding } from '../.tsc/System/Text/UTF8Encoding';
import { ITouchstoneWebMessage, WebMessage } from '../interfaces';
import { DocumentInterface, ICheckInInput, ICheckInOutput, IImportInput, IImportOutput, InstanceInfo, ReferenceInfo, batchBindFilesInputItem, batchByNamesInputItem, batchByNamesOutputItem, batchCreateNodeItem, batchCreateRelItem } from './interfaces';
import { IUploadFileInput, IUploadFileOutput } from '../upload-file/interfaces';
import { datetimeUtils } from "../.tsc/Cangjie/TypeSharp/System/datetimeUtils";

let utf8 = new UTF8Encoding(false);
let parameters = {} as { [key: string]: string };
for (let i = 0; i < args.length; i++) {
    let arg = args[i];
    if (arg.startsWith("--")) {
        let key = arg.substring(2);
        let value = args[i + 1];
        parameters[key] = value;
        i++;
    }
    else if (arg.startsWith("-")) {
        let key = arg.substring(1);
        let value = args[i + 1];
        parameters[key] = value;
        i++;
    }
}
console.log(parameters);

let callPlugin = async (pluginName: string, input: any) => {
    let response = await apis.runAsync("run", {
        PluginName: pluginName,
        Input: input
    });
    if (response.StatusCode == 200) {
        let msg = response.Body as WebMessage;
        if (msg.success) {
            return msg.data.Output;
        }
        else {
            throw msg.message;
        }
    }
    else {
        throw `Failed, status code: ${response.StatusCode}`;
    }
};

let importDocumentsToWorkspace = async (input: IImportInput) => {
    return await callPlugin('workspace-import-files', input) as IImportOutput[];
};

let getContentArchivePath = async (contentMD5: string) => {
    let response = await apis.runAsync("getContentArchivePath", {
        contentMD5
    });
    if (response.StatusCode == 200) {
        let msg = response.Body as WebMessage;
        if (msg.success) {
            return msg.data as string;
        }
        else {
            throw msg.message;
        }
    }
    else {
        throw `Failed, status code: ${response.StatusCode}`;
    }
};

let upload = async (input: IUploadFileInput) => {
    return await callPlugin('upload-file', input) as IUploadFileOutput;
};

let batchByNames = async (data: batchByNamesInputItem[]) => {
    let response = await apis.runAsync("batchByNames", {
        data: data
    });
    if (response.StatusCode == 200) {
        let msg = response.Body as ITouchstoneWebMessage;
        if (msg.code == 0) {
            return msg.result as batchByNamesOutputItem[];
        }
        else {
            throw msg.msg;
        }
    }
    else {
        throw `Failed, status code: ${response.StatusCode}`;
    }
};

let batchBindFiles = async (data: batchBindFilesInputItem[]) => {
    let response = await apis.runAsync("batchBindFiles", {
        data: data
    });
    if (response.StatusCode == 200) {
        let msg = response.Body as ITouchstoneWebMessage;
        if (msg.code == 0) {
            return msg.result;
        }
        else {
            throw msg.msg;
        }
    }
    else {
        throw `Failed, status code: ${response.StatusCode}`;
    }
};

let batchCreateNodeAndRel = async (nodes: batchCreateNodeItem[], rels: batchCreateRelItem[]) => {
    let response = await apis.runAsync("batchCreateNodeAndRel", {
        nodes,
        rels
    });
    if (response.StatusCode == 200) {
        let msg = response.Body as ITouchstoneWebMessage;
        if (msg.code == 0) {
            return msg.result;
        }
        else {
            throw msg.msg;
        }
    }
    else {
        throw `Failed, status code: ${response.StatusCode}`;
    }
};

let preview = async (data: string[]) => {
    let response = await apis.runAsync("preview", {
        data: data
    });
    if (response.StatusCode == 200) {
        let msg = response.Body as ITouchstoneWebMessage;
        if (msg.code == 0) {
            return msg.result;
        }
        else {
            throw msg.msg;
        }
    }
    else {
        throw `Failed, status code: ${response.StatusCode}`;
    }
};

let confirm = async (force: boolean, oidsAndPaths: {
    oid: string,
    paths: string[]
}[]) => {
    let response = await apis.runAsync("confirm", {
        force,
        oidsAndPaths
    });
    if (response.StatusCode == 200) {
        let msg = response.Body as ITouchstoneWebMessage;
        if (msg.code == 0) {
            return msg.result;
        }
        else {
            throw msg.msg;
        }
    }
    else {
        throw `Failed, status code: ${response.StatusCode}`;
    }
};


let getModelDefinition = (path: string) => {
    let extension = Path.GetExtension(path).toLowerCase();
    if (extension == ".catpart") {
        return "CADPart";
    }
    else if (extension == ".catproduct") {
        return "CADAssembly";
    }
    else {
        throw `Unsupported extension: ${extension}`;
    }
};

let getType = (path: string) => {
    let extension = Path.GetExtension(path).toLowerCase();
    if (extension == ".catpart") {
        return "Part";
    }
    else if (extension == ".catproduct") {
        return "Assembly";
    }
    else {
        throw `Unsupported extension: ${extension}`;
    }
};

let main = async () => {
    let inputPath = parameters.i ?? parameters.input;
    let outputPath = parameters.o ?? parameters.output;
    let loggerPath = parameters.l ?? parameters.logger;
    let progresserPath = parameters.p ?? parameters.progress ?? parameters.progresser;
    if (inputPath == undefined || inputPath == null) {
        throw "inputPath is required";
    }
    if (outputPath == undefined || outputPath == null) {
        throw "outputPath is required";
    }
    if (loggerPath == undefined || loggerPath == null) {
        throw "loggerPath is required";
    }

    let input = Json.Load(inputPath) as ICheckInInput;
    let output = {} as any;
    setLoggerPath(loggerPath);
    // 先进行本地归档
    let importInput = {
        Items: []
    } as IImportInput;
    let fileDirectory = "";
    for (let item of input.Items) {
        if (fileDirectory == "") {
            fileDirectory = Path.GetDirectoryName(item.FilePath);
        }
        importInput.Items.push({
            FilePath: item.FilePath
        });
    }
    let importResult = await importDocumentsToWorkspace(importInput);
    // 对文件进行上载
    let uploadInput = {
        Items: []
    } as IUploadFileInput;
    for (let item of importResult) {
        let archivePath = await getContentArchivePath(item.contentMD5);
        uploadInput.Items.push(
            {
                FilePath: archivePath,
                FileName: `${datetimeUtils.getJSTimestamp()}_${Path.GetFileName(item.originFileName)}`
            }
        );
    }
    let uploadResult = await upload(uploadInput);
    // 遍历子件，如果子件在本地没有，就从系统查询
    let toQueryNodeNames = [] as string[];
    for (let item of importResult) {
        let children = item.rawJson.Children;
        if (children) {
            for (let child of children) {
                let queryRecord = importResult.find(x => x.formatFileName == child.FileName);
                if (!queryRecord) {
                    toQueryNodeNames.push(Path.GetFileNameWithoutExtension(child.FileName));
                }
            }
        }
    }
    // 查询子件，补充信息，用于创建节点
    let queryNodes = await batchByNames(toQueryNodeNames.map(x => {
        return {
            modelDefinition: getModelDefinition(x),
            nodeName: Path.GetFileNameWithoutExtension(x),
            nodeVersion: ""
        };
    }));
    // 创建节点
    let batchCreateNodes = [] as batchCreateNodeItem[];
    let batchCreateRels = [] as batchCreateRelItem[];
    let batchBindFilesInputItems = [] as batchBindFilesInputItem[];
    for (let item of importResult) {
        let metadata = uploadResult.Items.find(x => x.fileOriginalName == item.originFileName);
        if (metadata == undefined) {
            throw `Failed to find metadata for ${item.originFileName}`;
        }
        let params = {
            ActivateBOM: "1",
            J_BOUNDINGBOX: ""
        } as { [key: string]: string };
        if (item.rawJson.Attributes) {
            let keys = Object.keys(item.rawJson.Attributes);
            for (let key of keys) {
                params[key] = item.rawJson.Attributes[key];
            }
        }

        let batchCreateNode = {
            boundingBox: "",
            dsVersionModified: true,
            fileLastModified: datetimeUtils.toFormatString(item.fileLastWriteTime, "yyyy-MM-dd HH:mm:ss"),
            nodeName: Path.GetFileNameWithoutExtension(item.formatFileName),
            opacity: "",
            pNumber: Path.GetFileNameWithoutExtension(item.formatFileName),
            params: params,
            projName: [],
            rgb: "",
            state: "New",
            subType: getType(item.formatFileName),
            toCreateVersion: "A.1",
            type: getModelDefinition(item.lowerFormatFileName),
        } as batchCreateNodeItem;
        batchCreateNodes.push(batchCreateNode);

        let batchBindFilesInputItem = {
            fileName: item.originFileName,
            fileOid: metadata.oid,
            filePath: fileDirectory,
            fileType: "CATIA R18",
            lastModified: datetimeUtils.toFormatString(item.fileLastWriteTime, "yyyy-MM-dd HH:mm:ss"),
            nodeName: Path.GetFileNameWithoutExtension(item.formatFileName),
            primary: true,
            nodeType: getModelDefinition(item.formatFileName),
            dsVersionModified: true,

        } as batchBindFilesInputItem;
        batchBindFilesInputItems.push(batchBindFilesInputItem);


    }
    for (let item of importResult) {
        let batchCreateNode = batchCreateNodes.find(x => x.nodeName == Path.GetFileNameWithoutExtension(item.formatFileName));
        if (!batchCreateNode) {
            throw `Failed to find batchCreateNode for ${item.originFileName}`;
        }
        let batchCreateRefItem = {
            children: [] as {
                instanceInfo: InstanceInfo,
                referenceInfo: ReferenceInfo
            }[]
        } as batchCreateRelItem;
        batchCreateRels.push(batchCreateRefItem);
        batchCreateRefItem.referenceInfo = batchCreateNode;
        batchCreateRefItem.fileInfo = {
            fileLastModified: datetimeUtils.toFormatString(item.fileLastWriteTime, "yyyy-MM-dd HH:mm:ss"),
            fileName: item.originFileName,
            filePath: fileDirectory,
            fileType: "CATIA R18",
            nodeName: Path.GetFileNameWithoutExtension(item.formatFileName),
            dsVersionModified: true,
            primary: true,
            lastModified: datetimeUtils.toFormatString(item.fileLastWriteTime, "yyyy-MM-dd HH:mm:ss"),
            isLight: false,
            nodeType: getModelDefinition(item.formatFileName),
            command: "CheckIn"
        };
        let childIndex = -1;
        if (item.rawJson.Children) {
            childIndex++;
            for (let child of item.rawJson.Children) {
                let childNode = {

                } as {
                    instanceInfo: InstanceInfo,
                    referenceInfo: ReferenceInfo
                };
                let queryBatchCreateNode = batchCreateNodes.find(x => x.nodeName == Path.GetFileNameWithoutExtension(child.FileName));
                if(queryBatchCreateNode){
                    childNode.referenceInfo = queryBatchCreateNode;
                    childNode.instanceInfo = {
                        index: childIndex.toString(),
                        name: Path.GetFileNameWithoutExtension(child.FileName),
                        opacity: "",
                        position: child.ComponentProperties.Matrix.join(" "),
                        rgb: ""
                    };
                    batchCreateRefItem.children.push(childNode);
                    continue;
                }
                let queryNode = queryNodes.find(x => x.pdmMcad.name.toLowerCase() == Path.GetFileNameWithoutExtension(child.FileName).toLowerCase());
                if (queryNode) {
                    childNode.referenceInfo = {
                        boundingBox: "",
                        dsVersionModified: true,
                        fileLastModified: queryNode.spaceMcad.fileLastModified,
                        nodeName: queryNode.pdmMcad.name,
                        opacity: "",
                        pNumber: queryNode.pdmMcad.name,
                        state: queryNode.spaceMcad.state,
                        subType: queryNode.spaceMcad.subType,
                        toCreateVersion: queryNode.spaceMcad.pdmVersion,
                        type: queryNode.spaceMcad.type
                    }
                    childNode.instanceInfo = {
                        index: childIndex.toString(),
                        name: Path.GetFileNameWithoutExtension(child.FileName),
                        opacity: "",
                        position: child.ComponentProperties.Matrix.join(" "),
                        rgb: ""
                    };
                    batchCreateRefItem.children.push(childNode);
                    continue;
                }
                throw `Failed to find queryNode for ${child.FileName}`;
            }
        }
    }
    await batchCreateNodeAndRel(batchCreateNodes, batchCreateRels);
    await batchBindFiles(batchBindFilesInputItems);
    // 查询节点
    let batchByNamesInputItems = [] as batchByNamesInputItem[];
    for (let item of importResult) {
        batchByNamesInputItems.push({
            modelDefinition: getModelDefinition(item.lowerFormatFileName),
            nodeName: Path.GetFileNameWithoutExtension(item.formatFileName),
            nodeVersion: ""
        });
    }
    let batchByNamesResult = await batchByNames(batchByNamesInputItems);
    // 检入
    let previewInput = [] as string[];
    let confirmInput = [] as {
        oid: string,
        paths: string[]
    }[];
    for (let item of importResult) {
        let queryRecord = batchByNamesResult.find(x => x.pdmMcad.name.toLowerCase() == Path.GetFileNameWithoutExtension(item.formatFileName).toLowerCase());
        if (!queryRecord) {
            throw `Failed to find query record for ${item.originFileName}`;
        }
        if (queryRecord.spaceMcad.oid) {
            previewInput.push(queryRecord.spaceMcad.oid);
            confirmInput.push({
                oid: queryRecord.spaceMcad.oid,
                paths: queryRecord.spaceMcad.pdmCatalogFullPaths
            });
        }
        else {
            throw `Failed to find oid for ${item.originFileName}`;
        }
    }

    await preview(previewInput);
    await confirm(false, confirmInput);
    File.WriteAllText(outputPath, JSON.stringify(output), utf8);
};

await main();
