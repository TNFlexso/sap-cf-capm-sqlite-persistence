import { Strategy, BackupData } from "./interfaces";
export declare class Persistence {
    private strategy;
    constructor(strategy: Strategy);
    persistData(key: string, data: BackupData[], parameters?: any): Promise<any>;
    loadData(key: string, parameters?: any): Promise<BackupData[]>;
}
//# sourceMappingURL=Persistence.d.ts.map