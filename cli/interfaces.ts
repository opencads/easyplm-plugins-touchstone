export interface ITouchtoneUser {
    oid: string,
    type: "User",
    name: string,
    password: string,
    phone: string,
    createBy: string,
    createDate: string,
    email: string
}

export interface ITouchtoneLoginResult {
    tenantAlias: string,
    tenantOid: string,
    accesstoken: string,
    user: ITouchtoneUser
}

export interface ITouchtoneWebMessage {
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
    html_url: string
}

export interface ILoginInfomation {
    username: string,
    password: string
}