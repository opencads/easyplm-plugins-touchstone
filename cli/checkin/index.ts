import { args, setLoggerPath } from '../.tsc/context';
import { Json } from '../.tsc/TidyHPC/LiteJson/Json';
import { apis } from '../.tsc/Cangjie/TypeSharp/System/apis';
import { axios } from '../.tsc/Cangjie/TypeSharp/System/axios';
import { Path } from '../.tsc/System/IO/Path';
import { File } from '../.tsc/System/IO/File';
import { UTF8Encoding } from '../.tsc/System/Text/UTF8Encoding';
import { WebMessage } from '../interfaces';
import { DocumentInterface, ICheckInInput, ICheckInOutput, IImportInput } from './interfaces';
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
    return await callPlugin('workspace-import-files', input) as {
        importResult: DocumentInterface[]
    };
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
    for (let item of input.Items) {
        importInput.Items.push({
            FilePath: item.FilePath
        });
    }
    let importResult = await importDocumentsToWorkspace(importInput);
    // 对文件进行上载
    let uploadInput = {
        Items: (input.Items.map(item => {
            return {
                FilePath: item.FilePath,
                FileName: `${datetimeUtils.getJSTimestamp()}_${Path.GetFileName(item.FilePath)}`
            }
        }))
    } as IUploadFileInput;
    let uploadResult = await upload(uploadInput);
    output.Items = uploadResult.Items;
    File.WriteAllText(outputPath, JSON.stringify(output), utf8);
};

await main();
