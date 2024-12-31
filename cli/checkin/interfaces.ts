import { DateTime } from "../.tsc/System/DateTime"
import { Guid } from "../.tsc/System/Guid"
import { RawJsonDocument } from "../basicInterfaces"

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

export interface IImportOutput extends DocumentInterface {
    rawJson: RawJsonDocument
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
        Document: IDocumentRecord
    }[]
}

export interface ICheckInOutput {

}

export interface batchByNamesInputItem {
    "modelDefinition": "CADAssembly" | "CADPart",
    "nodeName": string,
    "nodeVersion": string
}

interface Params {
    ActivateBOM: string;
    J_BOUNDINGBOX: string;
    [key: string]: string
}

interface SpaceMcad {
    oid: string;
    type: string;
    modelDefinition: null | undefined; // 使用 null | undefined 表示可能为 null
    modelIcon: null | undefined;
    markForDelete: boolean;
    owner: string;
    createBy: string;
    createDate: number;
    updateBy: string;
    updateDate: number;
    tenantOid: string;
    orderBy: number;
    name: string;
    state: string;
    pdmType: string;
    pdmOwner: null | undefined;
    pnumber: string;
    opacity: string;
    rgb: string;
    subType: string;
    refNodeName: null | undefined;
    refNodeType: null | undefined;
    pdmCatalogFullPaths: string[];
    pdmVersion: string;
    params: Params;
    shapeInfo: null | undefined;
    pmiInfo: null | undefined;
    annotationInfo: null | undefined;
    downloaded: boolean;
    simpleIcon: null | undefined;
    description: null | undefined;
    userOid: string;
    displayVersion: string;
    lifecycleOid: string;
    lifecycleStatus: string;
    containerOid: string;
    containerName: null | undefined;
    containerType: string;
    containerModel: string;
    sourceOid: string;
    checkin: boolean;
    lockNote: null | undefined;
    lockOwnerAccount: null | undefined;
    lockOwnerOid: null | undefined;
    lockedTime: null | undefined;
    lockSourceOid: null | undefined;
    fileLastModified: string;
    spaceContainerOid: string;
    spaceLifecycleCode: number;
    spaceLifecycleStatus: string;
    boundingBox: string;
    pdmLatest: boolean;
    primaryFiles: any[]; // 假设为任意类型数组，可以根据需要具体化
    secondaryFiles: any[];
    needCheckin: boolean;
    checkinMessage: null | undefined;
}

interface PdmMcad {
    fileLastModified: string;
    displayVersion: string;
    name: string;
    modelDefinition: "CADAssembly" | "CADPart"
}

export interface batchByNamesOutputItem {
    spaceMcad: SpaceMcad,
    pdmMcad: PdmMcad
}

export interface batchCreateNodeAndRelItem {
    "boundingBox": string,
    "dsVersionModified": boolean,
    "fileLastModified": string,
    "nodeName": string,
    "opacity": string,
    "pNumber": string,
    "params": {
        [key: string]: string
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