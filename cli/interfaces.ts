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
    token: string
}

export interface ILoginInfomation {
    username: string,
    password: string
}
