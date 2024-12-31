import { args, env, setLoggerPath } from '../.tsc/context';
import { axios } from "../.tsc/Cangjie/TypeSharp/System/axios";
import { UTF8Encoding } from "../.tsc/System/Text/UTF8Encoding";
import { Json } from "../.tsc/TidyHPC/LiteJson/Json";
import { ILoginInfomation, ITouchstoneLoginResult, ITouchstoneWebMessage, IUserInfomation } from '../interfaces';
import { File } from '../.tsc/System/IO/File';
import { Path } from '../.tsc/System/IO/Path';
import { Directory } from '../.tsc/System/IO/Directory';
import { apis } from "../.tsc/Cangjie/TypeSharp/System/apis";
import { IDocumentRecord } from '../basicInterfaces';
import { ActiveWorkspaceResult } from './activeWorkspaceInterfaces';
import { TenantInfoResult } from './tenantInfoInterfaces';
import { GetListResult } from './getlistInterfaces';
import { DateTime } from '../.tsc/System/DateTime';
import { getRemoteDocumentsOutput } from './interfaces';
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

let cacheDirectory = Path.Combine(env('userprofile'), ".xplm", "cache");
if (Directory.Exists(cacheDirectory) == false) {
    Directory.CreateDirectory(cacheDirectory);
}
let cacheLoginJsonPath = Path.Combine(cacheDirectory, "login.json");

let getActiveWorkspace = async () => {
    let response = await apis.runAsync("activeWorkspace", {

    });
    if (response.StatusCode == 200) {
        let msg = response.Body as ITouchstoneWebMessage;
        if (msg.code == 0) {
            return msg.result as ActiveWorkspaceResult;
        }
        else {
            throw msg.msg;
        }
    }
    else {
        throw `Failed, status code: ${response.StatusCode}`;
    }
};

let getlist = async (mcadCatalogOid: string, size: number, page: number) => {
    let response = await apis.runAsync("getlist", {
        mcadCatalogOid,
        page,
        size
    });
    if (response.StatusCode == 200) {
        let msg = response.Body as ITouchstoneWebMessage;
        if (msg.code == 0) {
            return msg.result as GetListResult;
        }
        else {
            throw msg.msg;
        }
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
    let input = Json.Load(inputPath) as ILoginInfomation;
    let output = {} as getRemoteDocumentsOutput;
    setLoggerPath(loggerPath);
    if (File.Exists(cacheLoginJsonPath) == false) {
        output.Documents = [];
        File.WriteAllText(outputPath, JSON.stringify(output), utf8);
        return;
    }
    let workspace = await getActiveWorkspace();
    let tasks = [] as any[];
    let firstPage = await getlist(workspace.oid, 9999, 1);
    let result = [] as IDocumentRecord[];
    for (let row of firstPage.rows) {
        let document = {} as IDocumentRecord;
        document.name = row.name;
        document.fileName = "";
        if (row.primaryFiles) {
            if (row.primaryFiles.length > 0) {
                document.fileName = row.primaryFiles[0].fileName;
            }
        }
        document.number = '';
        document.partNumber = row.pnumber;
        document.remote = {
            lifeCycle: row.lifecycleStatus,
            remoteAttributes: [],
            remoteChildren: [],
            remoteLastModifiedTime: DateTime.Parse(row.fileLastModified).ToString("O"),
            remoteState: 'unknown',
            raw: row
        };
        let paramsKeys = Object.keys(row.params);
        for (let key of paramsKeys) {
            document.remote.remoteAttributes.push({
                key: key,
                value: row.params[key],
                type: 'string'
            });
        }
        if (row.state == "New") {
            document.remote.remoteState = 'new';
        }
        else if (row.checkin) {
            document.remote.remoteState = 'checkedIn';
        }
        else {
            document.remote.remoteState = 'checkedOut';
        }
        document.local = {
            localAttributes: [],
            localChildren: [],
            localFilePath: "",
            localLastModifiedTime: "",
            workspaceState: 'todownload'
        };
        result.push(document);
    }
    output.Documents = result;
    File.WriteAllText(outputPath, JSON.stringify(output), utf8);
};

await main();
