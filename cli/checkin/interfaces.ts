import { DateTime } from "../.tsc/System/DateTime"
import { Guid } from "../.tsc/System/Guid"

export interface IImportInput {
    Items: {
        FilePath: string
    }[]
}

export interface DocumentInterface {
    id: Guid,
    key: string,
    originFileName: string,
    formatFileName: string,
    lowerFormatFileName: string,
    contentMD5: string,
    rawJsonMD5: string,
    documentNumber0: string,
    documentNumber1: string,
    documentNumber2: string,
    partNumber0: string,
    partNumber1: string,
    partNumber2: string,
    documentRemoteID: string,
    partRemoteID: string,
    displayName: string,
    createTime: DateTime,
    updateTime: DateTime,
    fileLastWriteTime: DateTime,
    fileLength: number
}

export interface IDocumentRecord {
    name: string;
    fileName: string;
    number: string;
    partNumber: string;
    remote: {
        success: boolean;
        remoteState: 'new' | 'checkedIn' | 'checkedOut' | 'unknown';
        remoteLastModifiedTime: string;
        lifeCycle: string;
        remoteAttributes: {
            key: string,
            value: string,
            type: string
        }[];
        remoteChildren: {
            fileName: string,
            name: string,
            number: string,
            partNumber: string
        }[];
        raw?: any
    },
    local: {
        success: boolean;
        workspaceState: 'untracked' | 'modified' | 'archived' | 'missing' | 'todownload';
        localFilePath: string;
        localAttributes: {
            key: string,
            value: string,
            type: string
        }[];
        localChildren: {
            fileName: string,
            name: string,
            number: string,
            partNumber: string
        }[];
        localLastModifiedTime: string;
        raw?: any
    };
}

export interface ICheckInInput {
    Items: {
        FilePath: string,
        Document:IDocumentRecord
    }[]
}

export interface ICheckInOutput {

}

export interface batchByNamesInputItem {
    "modelDefinition": "CADAssembly" | "CADPart",
    "nodeName": string,
    "nodeVersion": string
}

export interface batchByNamesOutputItem {
    "spaceMcad": any,
    "pdmMcad": {
        "fileLastModified": any,
        "displayVersion": string,
        "name": string,
        "modelDefinition": "CADAssembly" | "CADPart"
    }
}

export interface batchCreateNodeAndRelItem {
    "boundingBox": string,
    "dsVersionModified": boolean,
    "fileLastModified": string,
    "nodeName": string,
    "opacity": string,
    "pNumber": string,
    "params": {
        "ActivateBOM": "1",
        "J_BOUNDINGBOX": ""
    },
    "projName": string[],
    "rgb": string,
    "state": "New",
    "subType": "Assembly" | "Part",
    "toCreateVersion": string,
    "type": "CADAssembly" | "CADPart"
}

export interface batchBindFilesInputItem {
    "fileName": string,
    "fileOid": string,
    "filePath": string,
    "fileType": string,
    "lastModified": string,
    "nodeName": string,
    "primary": boolean,
    "nodeType": "CADAssembly" | "CADPart",
    "dsVersionModified": boolean
}