import * as cdk from '@aws-cdk/core';
import * as glue from '@aws-cdk/aws-glue'; 

export function create(stack:cdk.Stack, dbName:string, account:string) {
    const aspirevc_crowd_tracing = new glue.CfnTable(stack, 'aspirevc_crowd_tracing', {
        databaseName: dbName,
        catalogId: account,
        tableInput: {
        name: "aspirevc_crowd_tracing",
        description: "Contact Tracing data from AspireVC",
        parameters: {
            has_encrypted_data: false,
            classification: "json", 
            typeOfData: "file"
        },
        storageDescriptor: {
            columns: [
                {
                    name: "scandate",
                    type: "string",
                    comment: "Date that the scan occurred"
                },
                {
                    name: "scannerdeviceid",
                    type: "string",
                    comment: "Unique Tokenized identifier of kiosk device"
                },
                {
                    name: "scannerdevice_zipcode",
                    type: "string",
                    comment: "ZIP Code of Device Location"
                },
                {
                    name: "location_maxcapacity",
                    type: "bigint",
                    comment: "Total number of people they can hold"
                },
                {
                    name: "location_capacity_enforcedlimit",
                    type: "bigint",
                    comment: "Government enforced limit %"
                },
                {
                    name: "location_op_hours",
                    type: "string",
                    comment: "Operating hours of device location"
                },
                {
                    name: "userdeviceid",
                    type: "string",
                    comment: "Unique Tokenized identifier of smart phone"
                },
                {
                    name: "type_of_scan",
                    type: "string",
                    comment: "Checkin or Checkout"
                },
                {
                    name: "userid",
                    type: "string",
                    comment: "Unique Tokenized identifier of user"
                },
                {
                    name: "duration",
                    type: "bigint",
                    comment: "Time in seconds for how long it took the user to complete the survey"
                },
                {
                    name: "risklevel",
                    type: "string",
                    comment: "Classification determined by the Go Pass system"
                },
                {
                    name: "accesslevel",
                    type: "string",
                    comment: "The type of door being entered. 'Public' or 'Private'"
                },
                {
                    name: "readingtype",
                    type: "string",
                    comment: "Device type used.  'Gate' or 'Personal' (Gate = Kiosk; Personal = Smart Phone) "
                },
                {
                    name: "temp",
                    type: "double",
                    comment: "Temperature of user in F"
                },
                {
                    name: "o2",
                    type: "bigint",
                    comment: "O2 level of user"
                },
                {
                    name: "symptoms",
                    type: "boolean",
                    comment: "Past 2 weeks, have you had any of the following symptoms: shortness of breath, fever, loss of taste or smell, new cough?"
                },
                {
                    name: "diagnosed",
                    type: "boolean",
                    comment: "Past 2 weeks, have you been diagnosed with COVID or are waiting for COVID test results?"
                },
                {
                    name: "contact",
                    type: "boolean",
                    comment: "Past 2 weeks, have you been in contact with anyone who has been diagnosed with COVID or is waiting for COVID test results?"
                },
                {
                    name: "near",
                    type: "boolean",
                    comment: "Past 2 weeks, have you been near anyone with the following symptoms: shortness of breath, fever, loss of taste or smell, new cough?"
                },
                {
                    name: "m_score",
                    type: "double",
                    comment: "User's mask usage score"
                },
                {
                    name: "s_score",
                    type: "double",
                    comment: "User's social distancing score"
                },
                {
                    name: "result",
                    type: "string",
                    comment: "Result of the scan.  'Approved' or 'Declined'"
                }
            ],
            compressed: false,
            inputFormat: "org.apache.hadoop.mapred.TextInputFormat",
            location: "s3://covid19-lake/aspirevc_crowd_tracing/json/data",
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

    const aspirevc_crowd_tracing_zip = new glue.CfnTable(stack, 'aspirevc_crowd_tracing_zipcode_3digits', {
        databaseName: dbName,
        catalogId: account,
        tableInput: {
        name: "aspirevc_crowd_tracing_zipcode_3digits",
        description: "3 digit zip code lookup for AspireVC tracing data",
        parameters: {
            has_encrypted_data: false, 
            typeOfData: "file",
            'skip.header.line.count': "1",
		    classification: "csv"
        },
        storageDescriptor: {
            columns: [
                {
                    name: "zip",
                    type: "string",
                    comment: "3 digit zip"
                },
                {
                    name: "state",
                    type: "string",
                    comment: "US Sate"
                }

            ],
            compressed: false,
            inputFormat: "org.apache.hadoop.mapred.TextInputFormat",
            location: "s3://covid19-lake/aspirevc_crowd_tracing/csv/zip-data/3digits/",
            outputFormat: "org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat",
            serdeInfo: {
                parameters: {
                    "separatorChar": ","
                },
                serializationLibrary: "org.apache.hadoop.hive.serde2.OpenCSVSerde"
            },
            storedAsSubDirectories: false
        },
        tableType: "EXTERNAL_TABLE"
        }
    });

}