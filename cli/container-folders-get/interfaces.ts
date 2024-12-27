export interface Folder {
    oid: string;
    type: string;
    modelDefinition: string;
    modelIcon: string;
    markForDelete: boolean;
    owner: string;
    createBy: string;
    createDate: number;
    updateBy: string;
    updateDate: number;
    tenantOid: string;
    orderBy: number;
    name: string;
    description: null | string; // 假设description可以是null或string
    containerOid: string;
    containerType: string;
    containerModelDefinition: string;
    catalogType: string;
    catalogOid: string;
    extensionContent: null | any; // 假设extensionContent可以是null或任何类型
    clsOid: null | string; // 假设clsOid可以是null或string
    clsCode: null | string; // 假设clsCode可以是null或string
    clsDisplayName: null | string; // 假设clsDisplayName可以是null或string
    clsProperty: null | any; // 假设clsProperty可以是null或任何类型
    max: number;
    children: null | any[]; // 假设children可以是null或任何类型的数组
  }

  export interface IFolderRecord {
    key: string,
    name: string,
    raw: any
}