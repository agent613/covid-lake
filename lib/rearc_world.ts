import * as cdk from '@aws-cdk/core';
import * as glue from '@aws-cdk/aws-glue'; 

export function create(stack:cdk.Stack, dbName:string, account:string) {
    const world_cases_deaths_testing_table = new glue.CfnTable(stack, 'world_cases_deaths_testing_table', {
        databaseName: dbName,
        catalogId: account,
        tableInput: {
            name: "world_cases_deaths_testing",
            description: "Data on confirmed cases, deaths, and testing. Sourced from rearc.",
            parameters: {
                has_encrypted_data: false,
                classification: "json", 
                typeOfData: "file"
        },
        storageDescriptor: { 
            columns: [
                {
                    type: "string", 
                    name: "iso_code"
                }, 
                {
                    type: "string", 
                    name: "location"
                }, 
                {
                    type: "string", 
                    name: "date"
                }, 
                {
                    type: "double", 
                    name: "total_cases"
                }, 
                {
                    type: "double", 
                    name: "new_cases"
                }, 
                {
                    type: "double", 
                    name: "total_deaths"
                }, 
                {
                    type: "double", 
                    name: "new_deaths"
                }, 
                {
                    type: "double", 
                    name: "total_cases_per_million"
                }, 
                {
                    type: "double", 
                    name: "new_cases_per_million"
                }, 
                {
                    type: "double", 
                    name: "total_deaths_per_million"
                }, 
                {
                    type: "double", 
                    name: "new_deaths_per_million"
                }, 
                {
                    type: "double", 
                    name: "total_tests"
                }, 
                {
                    type: "double", 
                    name: "new_tests"
                }, 
                {
                    type: "double", 
                    name: "total_tests_per_thousand"
                }, 
                {
                    type: "double", 
                    name: "new_tests_per_thousand"
                }, 
                {
                    type: "string", 
                    name: "tests_units"
                }
            ],
            compressed: false,
            inputFormat: "org.apache.hadoop.mapred.TextInputFormat",
            location: "s3://covid19-lake/rearc-covid-19-world-cases-deaths-testing/json/",
            outputFormat: "org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat",
            serdeInfo: {
            parameters: {
                paths: "date,iso_code,location,new_cases,new_cases_per_million,new_deaths,new_deaths_per_million,new_tests,new_tests_per_thousand,tests_units,total_cases,total_cases_per_million,total_deaths,total_deaths_per_million,total_tests,total_tests_per_thousand"
            },
            serializationLibrary: "org.openx.data.jsonserde.JsonSerDe"
            },
            storedAsSubDirectories: false
        },
        tableType: "EXTERNAL_TABLE"
    }
    });
}