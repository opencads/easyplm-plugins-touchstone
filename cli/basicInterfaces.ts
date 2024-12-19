export interface IDocumentRecord {
    name: string;
    fileName: string;
    number: string;
    partNumber: string;
    remoteState: 'new' | 'checkedIn' | 'checkedOut'|'unknown';
    remoteLastModifiedTime: string;
    lifeCycle: string;
    local: {
        workspaceState: 'untracked' | 'modified' | 'archived' | 'missing'| 'todownload';
        localFilePath: string;
        localAttributes: {
            key: string,
            value: string,
            type: string
        }[];
        localChildren: {
            fileName: string,
            name: string,
            number: string,
            partNumber: string
        }[];
        localLastModifiedTime: string;
    };
    remoteAttributes: {
        key: string,
        value: string,
        type: string
    }[];
    remoteChildren: {
        fileName: string,
        name: string,
        number: string,
        partNumber: string
    }[];
}