import { Strategy, BackupData } from '../interfaces';
export declare class localProject implements Strategy {
    loadData: () => Promise<BackupData[]>;
    persistData: (key: string, data: BackupData[]) => void;
}
//# sourceMappingURL=local-project.d.ts.map