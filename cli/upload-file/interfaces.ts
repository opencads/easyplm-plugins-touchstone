export interface IUploadFileInput {
    Items:{
        FilePath:string,
        FileName:string
    }[]
}

export interface IUploadFileOutput {
    Items:{
        oid: string;
        type: string;
        modelDefinition: null | any;
        modelIcon: null | any;
        markForDelete: boolean;
        owner: string;
        createBy: string;
        createDate: number;
        updateBy: string;
        updateDate: number;
        tenantOid: string;
        orderBy: number;
        fileOriginalName: string;
        fileName: string;
        filePath: string;
        fileSize: number;
        fileSuffix: string;
        bucketName: string;
    }[]
}