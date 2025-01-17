export interface ITouchstoneUser {
    oid: string,
    type: "User",
    name: string,
    password: string,
    phone: string,
    createBy: string,
    createDate: string,
    email: string
}

export interface ITouchstoneLoginResult {
    tenantAlias: string,
    tenantOid: string,
    accesstoken: string,
    user: ITouchstoneUser
}

export interface ITouchstoneWebMessage {
    code: number,
    msg: string,
    result: any
}

export interface IUserInfomation {
    isLogin: boolean,
    name: string,
    id: string,
    email: string,
    avatar_url: string,
    html_url: string,
    token: string,
    tenant_id?: string,
    raw?: any
    tenant_raw?: any
}

export interface ILoginInfomation {
    username: string,
    password: string
}

export interface WebMessage {
    success: boolean;
    code: number;
    message: string;
    data: any;
}

export interface IProgress {
    dateTime?: string,
    progress: number,
    message?: string,
    parentID?: string,
    id?: string,
    status?: 'todo' | 'doing' | 'success' | 'failed',
    data?: any
}

export interface IProgresser {
    recordByPercent: (item: {
        parentID?: string,
        id?: string,
        percent: number,
        message?: string,
        status?: 'todo' | 'doing' | 'success' | 'failed',
        data?: any
    }) => void;
    recordByIncrease: (item: {
        parentID?: string,
        id?: string,
        increase: number,
        message?: string,
        status?: 'todo' | 'doing' | 'success' | 'failed',
        data?: any
    }) => void;
    getSubProgresserByPercent: (percent: number) => IProgresser;
}

