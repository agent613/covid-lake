import * as cdk from '@aws-cdk/core';
import * as glue from '@aws-cdk/aws-glue'; 

export function create(stack:cdk.Stack, dbName:string, account:string) {
    const nyt_counties_table = new glue.CfnTable(stack, 'nytimes_counties_table', {
        databaseName: dbName,
        catalogId: account,
        tableInput: {
        name: "nytimes_counties",
        description: "Data on COVID-19 cases from NY Times at US county level",
        parameters: {
            has_encrypted_data: false,
            classification: "json", 
            typeOfData: "file"
        },
        storageDescriptor: {
            columns: [
            {
            name: "date",
            type: "string",
            comment: "reporting date"
            },
            {
            name: "county",
            type: "string",
            comment: ""
            },
            {
            name: "state",
            type: "string",
            comment: ""
            },
            {
            name: "fips",
            type: "string",
            comment: "FIPS code"
            },
            {
            name: "cases",
            type: "bigint",
            comment: "# confirmed cases"
            },
            {
            name: "deaths",
            type: "bigint",
            comment: "# deaths"
            }
            ],
            compressed: false,
            inputFormat: "org.apache.hadoop.mapred.TextInputFormat",
            location: "s3://covid19-lake/rearc-covid-19-nyt-data-in-usa/json/us-counties",
            outputFormat: "org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat",
            serdeInfo: {
            serializationLibrary: "org.openx.data.jsonserde.JsonSerDe", 
            parameters: {
                paths: "date,county,state,fips,cases,deaths"
                }
            },
            storedAsSubDirectories: false
        },
        tableType: "EXTERNAL_TABLE"
        }
    });

    const nyt_states_table = new glue.CfnTable(stack, 'nytimes_states_table', {
        databaseName: dbName,
        catalogId: account,
        tableInput: {
        name: "nytimes_states",
        description: "Data on COVID-19 cases from NY Times at US state level",
        parameters: {
            has_encrypted_data: false,
            classification: "json", 
            typeOfData: "file"
        },
        storageDescriptor: {
            columns: [
            {
            name: "date",
            type: "string",
            comment: "reporting date"
            },
            {
            name: "state",
            type: "string",
            comment: ""
            },
            {
            name: "fips",
            type: "string",
            comment: "FIPS code"
            },
            {
            name: "cases",
            type: "bigint",
            comment: "# confirmed cases"
            },
            {
            name: "deaths",
            type: "bigint",
            comment: "# deaths"
            }
            ],
            compressed: false,
            inputFormat: "org.apache.hadoop.mapred.TextInputFormat",
            location: "s3://covid19-lake/rearc-covid-19-nyt-data-in-usa/json/us-states",
            outputFormat: "org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat",
            serdeInfo: {
            serializationLibrary: "org.openx.data.jsonserde.JsonSerDe", 
            parameters: {
                paths: "date,state,fips,cases,deaths"
                }
            },
            storedAsSubDirectories: false
        },
        tableType: "EXTERNAL_TABLE"
        }
    });
}