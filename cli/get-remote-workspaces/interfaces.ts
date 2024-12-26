export interface IWorkspaceRecord {
    key: string,
    name: string,
    active?: boolean,
    raw?: any
}

export interface MCADCatalog {
    oid: string;
    type: string;
    modelDefinition: null | any; // 假设modelDefinition可以是任何类型或null，根据实际需求调整
    modelIcon: null | any; // 假设modelIcon可以是任何类型或null，根据实际需求调整
    markForDelete: boolean;
    owner: string;
    createBy: string;
    createDate: number;
    updateBy: string;
    updateDate: number;
    tenantOid: string;
    orderBy: number;
    name: string;
    downloaded: boolean;
    active: boolean;
    pdmDefaultFullPaths: string[];
    sourceOid: string;
    sourceTenantOid: null | string; // 假设sourceTenantOid可以是string或null
    containerOid: string;
    containerName: string;
    containerType: string;
    containerModel: string;
    spaceContainerOid: string;
    command: null | any; // 假设command可以是任何类型或null，根据实际需求调整
    appName: string;
    lightUrl: string;
    children: any[]; // 假设children是某种类型的数组，根据实际需求调整
}