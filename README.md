
# SAP-CF-CAPM-SQLITE-PERSISTENCE

This module allows you to persist data in the Object Store service when using an in-memory SQLite database in a SAP CAPM application. SQLite is an in-memory database and all data will be reset when the application is restarted.

If you want to create an application on SAP Cloud Platform using CAPM, but there is no HANA database available, you can use this module to persist your SQLite data.

# How it works

There are two important functions in this module: backup and resore.

The <b>backup</b> function will extract all data from database entities that are annotated with @sql.dump:

```js
@sql.dump
entity Employees {
key id : String(40);
jobCode : String(255);
firstName : String(255);
lastName : String(255);
hireDate : Date;
emailAddress : String(255);
}
````

It will serialize all this data into a large JSON object, which will be save in the object store service.
  
The <b>restore</b>  function  will  read  the  serialized  data  from  the  object  store  service  and  upload  it  into  the  corresponding  tables.

## Backup

The  backup  function  requires 3 parameters:
```js
import { backup, restore, strategies } from  "sap-cf-capm-sqlite-persistence";
backup("<<datamodel namespace>>", "<<unique filename id>>", strategies.amazonS3);
```
| Parameter | Description | Example |
|--|--|--|
| Datamodel namespace | The namespace of your cds datamodel | `com.sap.capm.datamodel` |
| unique id | A unique ID which will be used to save your file in the object store service | `backupdata_dev` `backupdata_prd`
| Persistence strategy | Defines where the data will be saved, currently two strategies are available | `strategies.amazonS3` `localProject`

The function returns a promise which will be resolved when the backup has been completed successfully.

## Restore
```js
import { backup, restore, strategies } from  "sap-cf-capm-sqlite-persistence";
restore("<<datamodel namespace>>", `<<unique filename id>>`, strategies.amazonS3)
```
| Parameter | Description | Example |
|--|--|--|
| Datamodel namespace | The namespace of your cds datamodel | `com.sap.capm.datamodel` |
| unique id | A unique ID which will be used to read your file in the object store service | `backupdata_dev` `backupdata_prd`
| Persistence strategy | Defines where the data will be read, currently two strategies are available | `strategies.amazonS3` `localProject`
The function returns a promise which will be resolved when the restore has been completed successfully.

## Strategies  
### amazonS3
This strategy will use the SAP Cloud Platform Object Store service instance which is bound to your application. The serialized data will be saved as an object there.
### localProject
This startegy will save the data in the project root folder as `data.txt`. The file can then be used to transfer it to an FTP drive/cloud storage/...
