export interface BackupData {
    entityName: string;
    data: any[];
}

import { localProject, ObjectStore } from "./strategies";

export interface Strategy {
    persistData(key: string, data: BackupData[])
    loadData(key: string): Promise<BackupData[]>
}

export enum strategies { localProject, amazonS3 };
export const strategyInstances = {
    localProject: new localProject(),
    amazonS3: new ObjectStore()
}