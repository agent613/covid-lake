import * as cdk from '@aws-cdk/core';
import * as glue from '@aws-cdk/aws-glue'; 

export function create(stack:cdk.Stack, dbName:string, account:string) {
    const aspirevc_crowd_tracing = new glue.CfnTable(stack, 'aspirevc_crowd_tracing', {
        databaseName: dbName,
        catalogId: account,
        tableInput: {
        name: "aspirevc_crowd_tracing",
        description: "",
        parameters: {
            has_encrypted_data: false,
            classification: "json", 
            typeOfData: "file"
        },
        storageDescriptor: {
            columns: [
                {
                    name: "scandate",
                    type: "string"
                },
                {
                    name: "scannerdeviceid",
                    type: "string"
                },
                {
                    name: "scannerdevice_zipcode",
                    type: "string"
                },
                {
                    name: "location_maxcapacity",
                    type: "bigint"
                },
                {
                    name: "location_capacity_enforcedlimit",
                    type: "bigint"
                },
                {
                    name: "location_op_hours",
                    type: "string"
                },
                {
                    name: "userdeviceid",
                    type: "string"
                },
                {
                    name: "type_of_scan",
                    type: "string"
                },
                {
                    name: "userid",
                    type: "string"
                },
                {
                    name: "duration",
                    type: "bigint"
                },
                {
                    name: "risklevel",
                    type: "string"
                },
                {
                    name: "accesslevel",
                    type: "string"
                },
                {
                    name: "readtype",
                    type: "string"
                },
                {
                    name: "temp",
                    type: "double"
                },
                {
                    name: "o2",
                    type: "bigint"
                },
                {
                    name: "symptoms",
                    type: "boolean"
                },
                {
                    name: "diagnosed",
                    type: "boolean"
                },
                {
                    name: "contact",
                    type: "boolean"
                },
                {
                    name: "near",
                    type: "boolean"
                },
                {
                    name: "m_score",
                    type: "double"
                },
                {
                    name: "s_score",
                    type: "double"
                },
                {
                    name: "result",
                    type: "string"
                }
            ],
            compressed: false,
            inputFormat: "org.apache.hadoop.mapred.TextInputFormat",
            location: "s3://covid19-lake/aspirevc_crowd_tracing/json/",
            outputFormat: "org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat",
            serdeInfo: {
            parameters: {
                paths: "ACCESSLEVEL,CONTACT,DIAGNOSED,DURATION,LOCATION_CAPACITY_ENFORCEDLIMIT,LOCATION_MAXCAPACITY,LOCATION_OP_HOURS,M_SCORE,NEAR,O2,READTYPE,RESULT,RISKLEVEL,SCANDATE,SCANNERDEVICEID,SCANNERDEVICE_ZIPCODE,SYMPTOMS,S_SCORE,TEMP,TYPE_OF_SCAN,USERDEVICEID,USERID"
            },
            serializationLibrary: "org.openx.data.jsonserde.JsonSerDe"
            },
            storedAsSubDirectories: false
        },
        tableType: "EXTERNAL_TABLE"
        }
    });

}