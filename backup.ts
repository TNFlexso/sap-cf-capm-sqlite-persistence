import { BackupData, strategies, strategyInstances } from "./interfaces";
import { Persistence } from "./Persistence";
import '@sap/cds';

export const backup = async (namespace: string, key: string, strategy: strategies, parameters?: any): Promise<any> => {
  const data = await extractData(namespace);
  return persistData(key, strategy, data);
};

const extractData = async (namespace: string): Promise<BackupData[]> => {
  const cds = await require('@sap/cds').connect('db');
  return new Promise((resolve, reject) => {
    let mResults: BackupData[] = [],
      mPromises: Promise<any>[] = [];
    const entities = cds.entities(namespace);
    Object.keys(entities).forEach(entityName => {
      let entity = entities[entityName];
      if (entity["@sql.dump"]) {
        console.log("Creating backup of entity " + entityName);
        mPromises.push(cds.run(SELECT.from(entity)).then((result: any) => {
          mResults.push({
            entityName: entityName,
            data: result
          });
        }));
      }
    });
    Promise.all(mPromises).then((results: any) => {
      resolve(mResults);
    })
  });
}

const persistData = async (key: string, strategy, data: BackupData[]) => {
  let strategyInstance = strategyInstances[strategies[strategy]];
  let persitance = new Persistence(strategyInstance);
  return persitance.persistData(key, data);
}
