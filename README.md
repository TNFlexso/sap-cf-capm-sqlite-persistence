# SAP-CF-CAPM-SQLITE-PERSISTENCE

This module allows you to persist data in the Object Store service when using an in-memory SQLite database in a SAP CAPM application. SQLite is an in-memory database and all data will be reset when the application is restarted.

If you want to create an application on SAP Cloud Platform using CAPM, but there is no HANA database available, you can use this module to persist your SQLite data.

# How it works
There are two important functions in this module: backup and resore.
The backup function will extract all data from database entities that are annotated with @sql.dump:

```js
@sql.dump
entity Employees {
    key id                  : String(40);
        jobCode             : String(255);
        firstName           : String(255);
        lastName            : String(255);
        hireDate            : Date;
        emailAddress        : String(255);
}
````

It will serialize all this data into a large JSON object, which will be save in the object store service.

The resore function will read the serialized data from the object store service and upload it into the corresponding tables.

