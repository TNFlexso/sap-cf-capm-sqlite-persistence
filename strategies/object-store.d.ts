import { Strategy, BackupData } from '../interfaces';
export declare class ObjectStore implements Strategy {
    private credentials;
    private bucket;
    private region;
    private getS3Client;
    loadData: (key: string, parameters?: any) => Promise<BackupData[]>;
    persistData: (key: string, data: BackupData[], parameters?: any) => Promise<any>;
}
//# sourceMappingURL=object-store.d.ts.map