export interface IUploadFileInput {
    Items:{
        FilePath:string,
        FileName:string
    }[]
}

export interface IUploadFileOutput {
    Items:any[]
}