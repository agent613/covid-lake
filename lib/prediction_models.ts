import * as cdk from '@aws-cdk/core';
import * as glue from '@aws-cdk/aws-glue'; 

export function create(stack:cdk.Stack, dbName:string, account:string) {
    const prediction_models_severity_index_table = new glue.CfnTable(stack, 'prediction_models_severity_index_table', {
        databaseName: dbName,
        catalogId: account,
        tableInput: {
        description: "Severity Index models. Sourced from Yu Group at UC Berkeley via Rearc.",
        name: "prediction_models_severity_index",
        parameters: {
            has_encrypted_data: false,
            classification: "json",
            typeOfData: "file"
        },
        storageDescriptor: {
            columns: [
                {
                    type: "int", 
                    name: "severity_1-day"
                }, 
                {
                    type: "int", 
                    name: "severity_2-day"
                }, 
                {
                    type: "int", 
                    name: "severity_3-day"
                }, 
                {
                    type: "int", 
                    name: "severity_4-day"
                }, 
                {
                    type: "int", 
                    name: "severity_5-day"
                }, 
                {
                    type: "int", 
                    name: "severity_6-day"
                }, 
                {
                    type: "int", 
                    name: "severity_7-day"
                }, 
                {
                    type: "double", 
                    name: "total_deaths_hospital"
                }, 
                {
                    type: "string", 
                    name: "hospital_name"
                }, 
                {
                    type: "int", 
                    name: "cms_certification_number"
                }, 
                {
                    type: "string", 
                    name: "countyfips"
                }, 
                {
                    type: "string", 
                    name: "countyname"
                }, 
                {
                    type: "string", 
                    name: "statename"
                }, 
                {
                    type: "string", 
                    name: "system_affiliation"
                }, 
                {
                    type: "double", 
                    name: "latitude"
                }, 
                {
                    type: "double", 
                    name: "longitude"
                }
            ],
            compressed: false,
            inputFormat: "org.apache.hadoop.mapred.TextInputFormat",
            location: "s3://covid19-lake/rearc-covid-19-prediction-models/json/severity-index/",
            outputFormat: "org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat",
            serdeInfo: {
            parameters: {
                paths: "cms_certification_number,countyfips,countyname,hospital_name,latitude,longitude,severity_1-day,severity_2-day,severity_3-day,severity_4-day,severity_5-day,severity_6-day,severity_7-day,statename,system_affiliation,total_deaths_hospital"
            },
            serializationLibrary: "org.openx.data.jsonserde.JsonSerDe"
            },
            storedAsSubDirectories: false
        },
        tableType: "EXTERNAL_TABLE"
        }
    });

    const prediction_models_county_predictions_table = new glue.CfnTable(stack, 'prediction_models_county_predictions_table', {
        databaseName: dbName,
        catalogId: account,
        tableInput: {
        description: "County-level Predictions Data. Sourced from Yu Group at UC Berkeley via Rearc.",
        name: "prediction_models_county_predictions",
        tableType: "EXTERNAL_TABLE",
        storageDescriptor: {
            columns: [
                {
                    type: "string", 
                    name: "countyfips"
                }, 
                {
                    type: "string", 
                    name: "countyname"
                }, 
                {
                    type: "string", 
                    name: "statename"
                }, 
                {
                    type: "int", 
                    name: "severity_county_5-day"
                }, 
                {
                    type: "string", 
                    name: "predicted_date"
                }, 
                {
                    type: "double", 
                    name: "predicted_deaths"
                }

            ],
            location: "s3://covid19-lake/rearc-covid-19-prediction-models/json/county-predictions/",
            inputFormat: "org.apache.hadoop.mapred.TextInputFormat",
            outputFormat: "org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat",
            compressed: false,
            numberOfBuckets: -1,
            serdeInfo: {
                serializationLibrary: "org.openx.data.jsonserde.JsonSerDe",
                parameters: {}
            },
            parameters: {
                compressionType: "none",
                classification: "json",
                typeOfData: "file"
            },
            storedAsSubDirectories: false
        },
        parameters: {
            compressionType: "none",
            classification: "json",
            typeOfData: "file"
        }
        }
    });
}