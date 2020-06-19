import { Strategy, BackupData } from '../interfaces';
import * as aws from "aws-sdk";
import * as cfenv from "cfenv";

export class ObjectStore implements Strategy {

    private credentials;
    private bucket;
    private region;

    private getS3Client = (parameters?: any) => {
        if (parameters && parameters.bucket && parameters.access_key_id && parameters.secret_access_key) {
            this.credentials = new aws.Credentials(parameters.access_key_id, parameters.secret_access_key);
            this.region = parameters.region;
            this.bucket = parameters.bucket;
        } else {
            let appEnv = cfenv.getAppEnv({ vcapFile: "default-vcapfile.json" });
            if (appEnv.services.objectstore) {
                let objectStoreCredentials = appEnv.getServiceCreds(appEnv.services.objectstore[0].name)
                this.credentials = new aws.Credentials(objectStoreCredentials.access_key_id, objectStoreCredentials.secret_access_key);
                this.bucket = objectStoreCredentials.bucket;
                this.region = objectStoreCredentials.region;
            } else {
                throw 'No credentials found for Object Storage Service';
            }
        }
        aws.config.update({
            credentials: this.credentials,
            region: this.region
        });
        return new aws.S3({ apiVersion: '2006-03-01' });
    };

    loadData = async (key: string, parameters?: any): Promise<BackupData[]> => {
        let data = await this.getS3Client(parameters).getObject({
            Bucket: this.bucket,
            Key: key
        }).promise();
        if (data.Body) {
            return JSON.parse(data.Body.toString());
        } else {
            throw "Error while fetching backup from object store";
        }

    };

    persistData = (key: string, data: BackupData[], parameters?: any): Promise<any> => {
        let strData = JSON.stringify(data);
        return this.getS3Client(parameters).putObject({
            Body: Buffer.from(strData),
            Bucket: this.bucket,
            Key: key
        }).promise();
    }
}