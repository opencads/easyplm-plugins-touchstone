import { args, env, setLoggerPath } from '../.tsc/context';
import { axios } from "../.tsc/Cangjie/TypeSharp/System/axios";
import { UTF8Encoding } from "../.tsc/System/Text/UTF8Encoding";
import { Json } from "../.tsc/TidyHPC/LiteJson/Json";
import { File } from '../.tsc/System/IO/File';
import { Path } from '../.tsc/System/IO/Path';
import { Directory } from '../.tsc/System/IO/Directory';
import { apis } from "../.tsc/Cangjie/TypeSharp/System/apis";
import { DateTime } from '../.tsc/System/DateTime';
import { ILoginInfomation, ITouchstoneWebMessage } from '../interfaces';
import { IWorkspaceRecord, MCADCatalog } from './interfaces';
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

let getWorkspaces = async () => {
    let response = await apis.runAsync("getWorkspaces", {
    });
    if (response.StatusCode == 200) {
        let msg = response.Body as ITouchstoneWebMessage;
        if (msg.code == 0) {
            return msg.result as MCADCatalog[];
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
    let input = Json.Load(inputPath) as any;
    let output = [] as IWorkspaceRecord[];
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
    let remoteWorkspaces = await getWorkspaces();
    for (let workspace of remoteWorkspaces) {
        output.push({
            key: workspace.oid,
            name: workspace.name,
            active: workspace.active,
            raw: workspace
        });
    }

    File.WriteAllText(outputPath, JSON.stringify(output), utf8);
};

await main();
