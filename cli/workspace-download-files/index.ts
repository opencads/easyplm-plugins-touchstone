import { apis, args, setLoggerPath } from '../.tsc/context';
import { axios } from "../.tsc/Cangjie/TypeSharp/System/axios";
import { UTF8Encoding } from "../.tsc/System/Text/UTF8Encoding";
import { Json } from "../.tsc/TidyHPC/LiteJson/Json";
import { File } from '../.tsc/System/IO/File';
import { Path } from '../.tsc/System/IO/Path';
import { Directory } from '../.tsc/System/IO/Directory';
import { DateTime } from '../.tsc/System/DateTime';
import { ILoginInfomation, IProgresser, ITouchstoneWebMessage } from '../interfaces';
import { env } from '../.tsc/staticContext';
import { IDocumentRecord } from '../basicInterfaces';
import { fileUtils } from '../.tsc/Cangjie/TypeSharp/System/fileUtils';
import { Guid } from '../.tsc/System/Guid';
import { SpaceMcad } from '../checkin/interfaces';

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

let cacheDirectory = Path.Combine(env('userprofile'), ".easyplm", "cache");
if (Directory.Exists(cacheDirectory) == false) {
    Directory.CreateDirectory(cacheDirectory);
}
let cacheLoginJsonPath = Path.Combine(cacheDirectory, "login.json");

let downloadByOid = async (fileOid: string) => {
    let response = await apis.runAsync("downloadByOid", {
        fileOid
    });
    if (response.StatusCode == 200) {
        console.log(response);
    }
    else {
        throw `Failed, status code: ${response.StatusCode}`;
    }
};

let Progresser = (progressPath: string, start: number, length: number) => {
    return {} as IProgresser;
};
Progresser = (progressPath: string, start: number, length: number) => {
    let current = start;
    let recordByPercent = (item: {
        parentID?: string,
        id?: string,
        percent: number,
        message?: string,
        status?: 'todo' | 'doing' | 'success' | 'failed',
        data?: any
    }) => {
        current = start + length * item.percent;
        fileUtils.writeLineWithShare(progressPath, `${Guid.NewGuid().ToString()} ${JSON.stringify({
            dateTime: DateTime.Now.ToString("O"),
            progress: current,
            ...item
        }, null, 0)}`);
    };
    let recordByIncrease = (item: {
        parentID?: string,
        id?: string,
        increase: number,
        message?: string,
        status?: 'todo' | 'doing' | 'success' | 'failed',
        data?: any
    }) => {
        current += item.increase * length;
        fileUtils.writeLineWithShare(progressPath, `${Guid.NewGuid().ToString()} ${JSON.stringify({
            dateTime: DateTime.Now.ToString("O"),
            progress: current,
            ...item
        }, null, 0)}`);
    };
    let getSubProgresserByPercent = (percent: number) => {
        return Progresser(progressPath, current, length * percent);
    };
    return {
        recordByPercent,
        recordByIncrease,
        getSubProgresserByPercent
    };
};

let main = async () => {
    let inputPath = parameters.i ?? parameters.input;
    let outputPath = parameters.o ?? parameters.output;
    let loggerPath = parameters.l ?? parameters.logger;
    let progresserPath = parameters.p ?? parameters.progress ?? parameters.progresser;
    let progresser = Progresser(progresserPath, 0, 1);
    if (inputPath == undefined || inputPath == null) {
        throw "inputPath is required";
    }
    if (outputPath == undefined || outputPath == null) {
        throw "outputPath is required";
    }
    if (loggerPath == undefined || loggerPath == null) {
        throw "loggerPath is required";
    }
    let input = Json.Load(inputPath) as IDocumentRecord[];
    let output = {};
    setLoggerPath(loggerPath);
    if (File.Exists(cacheLoginJsonPath) == false) {
        File.WriteAllText(outputPath, JSON.stringify(output), utf8);
        return;
    }
    let cacheLogin = Json.Load(cacheLoginJsonPath);
    if (cacheLogin.isLogin == false) {
        File.WriteAllText(outputPath, JSON.stringify(output), utf8);
        return;
    }
    let documentProgressStep = 1.0 / input.length;
    for (let document of input) {
        let progressID_document = Guid.NewGuid().ToString();
        progresser.recordByIncrease({
            id: progressID_document,
            increase: documentProgressStep / 2,
            message: `Download ${document.fileName}`,
            status: 'doing'
        });
        if (document.remote && document.remote.raw) {
            let raw = document.remote.raw as SpaceMcad;
            if (raw.primaryFiles && (raw.primaryFiles.length > 0)) {
                let primaryFile = raw.primaryFiles[0];
                await downloadByOid(primaryFile.fileOid);
            }
            else {
                progresser.recordByIncrease({
                    id: progressID_document,
                    increase: documentProgressStep / 2,
                    status: 'failed'
                });
                progresser.recordByIncrease({
                    parentID: progressID_document,
                    increase: 0,
                    message: `No primary file`
                });
            }
        }
        else {
            progresser.recordByIncrease({
                id: progressID_document,
                increase: documentProgressStep / 2,
                status: 'failed'
            });
            progresser.recordByIncrease({
                parentID: progressID_document,
                increase: 0,
                message: `No remote document`
            });
        }
    }


    File.WriteAllText(outputPath, JSON.stringify(output), utf8);
};

await main();
