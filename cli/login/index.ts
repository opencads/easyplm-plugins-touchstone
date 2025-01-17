import { args, env, setLoggerPath } from '../.tsc/context';
import { axios } from "../.tsc/Cangjie/TypeSharp/System/axios";
import { UTF8Encoding } from "../.tsc/System/Text/UTF8Encoding";
import { Json } from "../.tsc/TidyHPC/LiteJson/Json";
import { ILoginInfomation, ITouchstoneLoginResult, ITouchstoneWebMessage, IUserInfomation } from '../interfaces';
import { File } from '../.tsc/System/IO/File';
import { Path } from '../.tsc/System/IO/Path';
import { Directory } from '../.tsc/System/IO/Directory';
import { apis } from '../.tsc/Cangjie/TypeSharp/System/apis';
import { TenantInfoResult } from '../workspace-get-remote-documents/tenantInfoInterfaces';
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

let getTenantInfo = async (token: string) => {
    let response = await apis.runAsync("tenantInfo", {
        token
    });
    if (response.StatusCode == 200) {
        let msg = response.Body as ITouchstoneWebMessage;
        if (msg.code == 0) {
            return msg.result as TenantInfoResult;
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
    let output = {} as IUserInfomation;
    setLoggerPath(loggerPath);
    let response = await axios.post('http://116.198.204.139:5001/pdm-standalone/account-micro/authentication/login', {
        "account": input.username,
        "device": {
            "createBy": "string",
            "createDate": 0,
            "deviceBrand": "string",
            "deviceId": "string",
            "deviceModel": "string",
            "extensionContent": {

            },
            "macAddress": "string",
            "markForDelete": true,
            "modelDefinition": "string",
            "modelIcon": "string",
            "oid": "string",
            "orderBy": 0,
            "owner": "string",
            "tenantOid": "string",
            "type": "string",
            "updateBy": "string",
            "updateDate": 0
        },
        "password": input.password
    }, {
        headers: {
            appName: "easyplm"
        }
    });
    if (response.status == 200) {
        let loginWebMessage = response.data as ITouchstoneWebMessage;
        if (loginWebMessage.code == 0) {
            let loginResult = loginWebMessage.result as ITouchstoneLoginResult;
            let tenantInfo = await getTenantInfo(loginResult.accesstoken);
            output.isLogin = true;
            output.name = loginResult.user.name;
            output.id = loginResult.user.oid;
            output.avatar_url = '';
            output.email = loginResult.user.email;
            output.html_url = '';
            output.token = loginResult.accesstoken;
            output.tenant_id = tenantInfo.defaultTanant.oid;
            output.raw = loginResult.user;
            output.tenant_raw = tenantInfo;
            File.WriteAllText(cacheLoginJsonPath, JSON.stringify(output), utf8);
            File.WriteAllText(outputPath, JSON.stringify(output), utf8);
        }
        else {
            throw loginWebMessage.msg;
        }
    }
    else {
        throw "login failed";
    }
};

await main();
