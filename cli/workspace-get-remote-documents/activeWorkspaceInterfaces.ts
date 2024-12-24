// MCADCatalog Object Interface
export interface ActiveWorkspaceResult {
    oid: string;
    type: string;
    modelDefinition: string | null;
    modelIcon: string | null;
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
    sourceTenantOid: string | null;
    containerOid: string;
    containerName: string;
    containerType: string;
    containerModel: string;
    spaceContainerOid: string;
    command: string | null;
    appName: string;
    lightUrl: string;
}