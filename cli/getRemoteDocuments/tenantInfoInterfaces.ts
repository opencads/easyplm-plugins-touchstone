// Tenant Object Interface
export interface Tenant {
    oid: string;
    type: string;
    modelDefinition: string;
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
    alias: string;
    description: string | null;
    address: string | null;
    icon: string | null;
    website: string | null;
    industry: string | null;
    size: number;
    disable: number;
    siteOid: string;
    administrativeDomainOid: string;
}

// Default Tenant Object Interface
export interface DefaultTenant {
    oid: string;
    type: string;
    modelDefinition: string;
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
    alias: string;
    description: string | null;
    address: string | null;
    icon: string | null;
    website: string | null;
    industry: string | null;
    size: number;
    disable: number;
    siteOid: string;
    administrativeDomainOid: string;
}

// User Tenant Authorization Info Interface
export interface UserTenantAuthInfo {
    systemAdmin: boolean;
    tenantAdmin: boolean;
    securityLevel: number;
}

// Main Result Interface
export interface TenantInfoResult {
    tenantList: Tenant[];
    defaultTanant: DefaultTenant;
    userTenantAuthInfo: UserTenantAuthInfo;
}
