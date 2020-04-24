import * as cdk from '@aws-cdk/core';
import * as glue from '@aws-cdk/aws-glue'; 

export function create(stack:cdk.Stack, dbName:string, account:string) {
    const state_abbrevs_table = new glue.CfnTable(stack, 'state_abbrevs_table', {
        databaseName: dbName,
        catalogId: account,
        tableInput: {
        name: "us_state_abbreviations",
        description: "Lookup table for US state abbreviations",
        parameters: {
            has_encrypted_data: false,
            classification: "csv", 
            areColumnsQuoted: "false", 
            typeOfData: "file", 
            columnsOrdered: "true", 
            delimiter: ",", 
            "skip.header.line.count": "1"
        },
        storageDescriptor: {
            columns: [ 
            {
            name: "state",
            type: "string",
            comment: "State name"
            },
            {
            name: "abbreviation",
            type: "string",
            comment: "abbreviation"
            }
            ],
            compressed: false,
            inputFormat: "org.apache.hadoop.mapred.TextInputFormat",
            location: "s3://covid19-lake/static-datasets/csv/state-abv",
            outputFormat: "org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat",
            serdeInfo: {
            serializationLibrary: "org.apache.hadoop.hive.serde2.lazy.LazySimpleSerDe", 
            parameters: {
                    "field.delim": ","
                }
            },
            storedAsSubDirectories: false
        },
        tableType: "EXTERNAL_TABLE"
        }
    });

    const county_pop_table = new glue.CfnTable(stack, 'county_pop_table', {
        databaseName: dbName,
        catalogId: account,
        tableInput: {
        name: "county_populations",
        description: "Lookup table for population for each county based on recent census data",
        parameters: {
            has_encrypted_data: false,
            classification: "csv", 
            areColumnsQuoted: "false", 
            typeOfData: "file", 
            columnsOrdered: "true", 
            delimiter: ",", 
            "skip.header.line.count": "1"
        },
        storageDescriptor: {
            columns: [  
            {
            name: "Id",
            type: "string",
            comment: "geo id"
            },
            {
            name: "Id2",
            type: "string",
            comment: "geo id2"
            },
            {
            name: "county",
            type: "string",
            comment: "county name"
            },
            {
            name: "state",
            type: "string",
            comment: "state name"
            },
            {
            name: "Population Estimate 2018",
            type: "string",
            comment: ""
            }
            ],
            compressed: false,
            inputFormat: "org.apache.hadoop.mapred.TextInputFormat",
            location: "s3://covid19-lake/static-datasets/csv/CountyPopulation",
            outputFormat: "org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat",
            serdeInfo: {
            serializationLibrary: "org.apache.hadoop.hive.serde2.lazy.LazySimpleSerDe", 
            parameters: {
                    "field.delim": ","
                }
            },
            storedAsSubDirectories: false
        },
        tableType: "EXTERNAL_TABLE"
        }
    });

    const country_code_table = new glue.CfnTable(stack, 'country_code_table', {
        databaseName: dbName,
        catalogId: account,
        tableInput: {
        name: "country_codes",
        description: "Lookup table for country codes",
        parameters: {
            has_encrypted_data: false,
            classification: "csv", 
            areColumnsQuoted: "false", 
            typeOfData: "file", 
            columnsOrdered: "true", 
            delimiter: ",", 
            "skip.header.line.count": "1"
        },
        storageDescriptor: {
            columns: [
            {
            name: "Country",
            type: "string",
            comment: "geo id"
            },
            {
            name: "Alpha-2 code",
            type: "string",
            comment: "geo id2"
            },
            {
            name: "Alpha-3 code",
            type: "string",
            comment: "state name"
            },
            {
            name: "Numeric code",
            type: "bigint",
            comment: ""
            },
            {
            name: "Latitude",
            type: "bigint",
            comment: "location (latitude)"
            },
            {
            name: "Longitude",
            type: "bigint",
            comment: "location (longitude)"
            }
            ],
            compressed: false,
            inputFormat: "org.apache.hadoop.mapred.TextInputFormat",
            location: "s3://covid19-lake/static-datasets/csv/countrycode",
            outputFormat: "org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat",
            serdeInfo: {
            serializationLibrary: "org.apache.hadoop.hive.serde2.lazy.LazySimpleSerDe", 
            parameters: {
                    "field.delim": ","
                }
            },
            storedAsSubDirectories: false
        },
        tableType: "EXTERNAL_TABLE"
        }
    });
}