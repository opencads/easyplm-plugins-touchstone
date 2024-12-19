// MCADIteration
export interface MCADIteration {
    oid: string;
    type: string;
    modelDefinition: any;
    modelIcon: any;
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
    pdmOwner: any;
    pnumber: any;
    opacity: string;
    rgb: string;
    subType: string;
    refNodeName: any;
    refNodeType: any;
    pdmCatalogFullPaths: string[];
    pdmVersion: any;
    params: {
        ActivateBOM: string;
        J_BOUNDINGBOX: string;
        PART_WEIGHT?: string;
        PART_MATERIAL?: string;
        J_CENTER_GRAVITY?: string;
        J_SURFACE_AREA?: string;
        J_MOMENT_INERTIA?: string;
        J_VOLUME?: string;
        J_DENSITY?: string;
        J_MASS?: string;
        [key: string]: any;
    };
    shapeInfo: any;
    pmiInfo: any;
    annotationInfo: any;
    downloaded: boolean;
    simpleIcon: any;
    description: any;
    userOid: string;
    displayVersion: string;
    lifecycleOid: string;
    lifecycleStatus: string;
    containerOid: string;
    containerName: any;
    containerType: string;
    containerModel: string;
    sourceOid: any;
    checkin: boolean;
    lockNote: any;
    lockOwnerAccount: any;
    lockOwnerOid: any;
    lockedTime: any;
    lockSourceOid: any;
    fileLastModified: string;
    spaceContainerOid: string;
    spaceLifecycleCode: number;
    spaceLifecycleStatus: string;
    boundingBox: string;
    pdmLatest: boolean;
    primaryFiles: MCADFile[];
    secondaryFiles: any[];
    needCheckin: boolean;
    checkinMessage: any;
}

// MCADFile
export interface MCADFile {
    oid: string;
    type: string;
    modelDefinition: any;
    modelIcon: any;
    markForDelete: boolean;
    owner: string;
    createBy: string;
    createDate: number;
    updateBy: string;
    updateDate: number;
    tenantOid: string;
    orderBy: number;
    userOid: string;
    fileOid: string;
    fileName: string;
    filePath: string;
    fileType: string;
    fileLastModified: string;
    pdmFileLastModified: string;
    primary: boolean;
}

// RootObject
export interface GetListResult {
    rows: MCADIteration[];
    count: number;
    pageIndex: number;
    pageSize: number;
}