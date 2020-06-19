export interface BackupData {
    entityName: string;
    data: any[];
}
import { localProject, ObjectStore } from "./strategies";
export interface Strategy {
    persistData(key: string, data: BackupData[]): any;
    loadData(key: string): Promise<BackupData[]>;
}
export declare enum strategies {
    localProject = 0,
    amazonS3 = 1
}
export declare const strategyInstances: {
    localProject: localProject;
    amazonS3: ObjectStore;
};
//# sourceMappingURL=interfaces.d.ts.map