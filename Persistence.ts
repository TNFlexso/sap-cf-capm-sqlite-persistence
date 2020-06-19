import { Strategy, BackupData } from "./interfaces";

export class Persistence {
    private strategy: Strategy

    constructor(strategy: Strategy) {
        this.strategy = strategy;
    }

    persistData(key: string, data: BackupData[], parameters?: any): Promise<any> {
        return this.strategy.persistData(key, data);
    }

    async loadData(key: string, parameters?: any): Promise<BackupData[]> {
        return this.strategy.loadData(key);
    }

}