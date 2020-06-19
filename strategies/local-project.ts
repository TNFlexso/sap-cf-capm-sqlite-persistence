import { Strategy, BackupData } from '../interfaces';
import * as fs from "fs";
import * as util from "util";

export class localProject implements Strategy {

    loadData = async (): Promise<BackupData[]> => {
        let data = await util.promisify(fs.readFile)("data.txt");
        return JSON.parse(data.toString());
    };

    persistData = (key: string, data: BackupData[]) => {
        fs.writeFile("data.txt", JSON.stringify(data), (error) => {
            if (error) {
                console.log("An error has occurred in writing to local filesystem", error);
            } else {
                console.log("Backup has been created in local file data.txt");
            }
        });
    }
}