import { BackupData, strategies, strategyInstances } from "./interfaces";
import { localProject } from "./strategies"
import { Persistence } from "./Persistence";


export const restore = async (namespace: string, key: string, strategy: strategies) => {
    if (await databaseIsEmpty(namespace)) {
        try {
            const data = await readDataFromBackup(key, strategy);
            const recordCounts = await restoreData(namespace, data);
            recordCounts.forEach(recordCount => {
                console.log(`Successfully inserted ${recordCount} records`)
            });
            console.log("Backup has successfully been restored");
        } catch (e) {
            console.log(e);
        }
    } else {
        console.log("Data is present, backup not necessary")
    }
};

const readDataFromBackup = async (key: string, strategy: strategies): Promise<BackupData[]> => {
    let strategyInstance = strategyInstances[strategies[strategy]];
    let persitance = new Persistence(strategyInstance);
    return persitance.loadData(key);
}

const restoreData = async (namespace: string, restoreData: BackupData[]): Promise<any> => {
    const cds = await require('@sap/cds').connect('db');
    const entities = cds.entities(namespace);
    const tx = cds.transaction(new Object());
    let mPromises = await Promise.all(restoreData.filter(data => entities[data.entityName] && data.data.length).map(async (data) => {
        let entity = entities[data.entityName];
        let records = data.data;
        console.log(`Restoring ${records.length} records in entity ${data.entityName}`);
        if (records.length) {
            return await tx.run(INSERT.into(entity).entries(records));
        } else {
            return true;
        }

    }));
    await tx.commit();
    return mPromises;
}

const databaseIsEmpty = async (namespace): Promise<Boolean> => {
    return new Promise(async (resolve, reject) => {
        const cds = await require('@sap/cds').connect('db');
        const entities = cds.entities(namespace);
        const entityName = Object.keys(entities).find(entity => entities[entity]['@backup.master']) || Object.keys(entities).find(entity => entities[entity]['@sql.dump']) || "";
        const record = await cds.run(SELECT.from(entities[entityName]).limit(1));
        if (record.length) {
            resolve(false);
        } else {
            resolve(true);
        }
    });
}

