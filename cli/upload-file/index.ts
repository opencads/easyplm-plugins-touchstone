import { UTF8Encoding } from "../.tsc/System/Text/UTF8Encoding";
import { Json } from "../.tsc/TidyHPC/LiteJson/Json";
import { apis, args, setLoggerPath } from "../.tsc/context";
import { ITouchstoneWebMessage } from "../interfaces";
import { IUploadFileInput, IUploadFileOutput } from "./interfaces";
import { fileUtils } from "../.tsc/Cangjie/TypeSharp/System/fileUtils";
import { datetimeUtils } from "../.tsc/Cangjie/TypeSharp/System/datetimeUtils";
import { taskUtils } from "../.tsc/Cangjie/TypeSharp/System/taskUtils";
import { File } from "../.tsc/System/IO/File";

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

let createFileMetadata = async (fileSize: number, fileName: string, bucketName: string) => {
    let response = await apis.runAsync("createFileMetadata", {
        fileSize,
        fileName,
        bucketName
    });
    if (response.StatusCode == 200) {
        let msg = response.Body as ITouchstoneWebMessage;
        if (msg.code == 0) {
            return msg.result as {
                oid: string;
                type: string;
                modelDefinition: null | any;
                modelIcon: null | any;
                markForDelete: boolean;
                owner: string;
                createBy: string;
                createDate: number;
                updateBy: string;
                updateDate: number;
                tenantOid: string;
                orderBy: number;
                fileOriginalName: string;
                fileName: string;
                filePath: string;
                fileSize: number;
                fileSuffix: string;
                bucketName: string;
            };
        }
        else {
            throw msg.msg;
        }
    }
    else {
        throw `Failed, status code: ${response.StatusCode}`;
    }
};

let preSignedPutUrl = async (fileName: string) => {
    let response = await apis.runAsync("preSignedPutUrl", {
        fileName
    });
    if (response.StatusCode == 200) {
        let msg = response.Body as ITouchstoneWebMessage;
        if (msg.code == 0) {
            return msg.result as {
                url: string,
                bucketName: string
            };
        }
        else {
            throw msg.msg;
        }
    }
    else {
        throw `Failed, status code: ${response.StatusCode}`;
    }
};

let upload = async (url: string, filePath: string) => {
    let response = await apis.runAsync("upload", {
        url,
        filePath
    });
    if (response.StatusCode == 200) {

    }
    else {
        throw `Failed, status code: ${response.StatusCode}`;
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
    let input = Json.Load(inputPath) as IUploadFileInput;
    let output = {
        Items: []
    } as IUploadFileOutput;
    setLoggerPath(loggerPath);
    let tasks = [] as any[];
    let outputMap = {} as any;
    for (let item of input.Items) {
        let tempItem = item;
        tasks.push((async () => {
            let preResult = await preSignedPutUrl(tempItem.FileName);
            await upload(preResult.url, tempItem.FilePath);
            let metadata = await createFileMetadata(fileUtils.size(tempItem.FilePath), tempItem.FileName, preResult.bucketName);
            outputMap[metadata.oid] = metadata;
        })());
    }
    await taskUtils.whenAll(tasks);
    let keys = Object.keys(outputMap);
    for (let key of keys) {
        output.Items.push(outputMap[key]);
    }
    File.WriteAllText(outputPath, JSON.stringify(output), utf8);
};

await main();