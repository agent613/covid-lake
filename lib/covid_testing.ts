import * as cdk from '@aws-cdk/core';
import * as glue from '@aws-cdk/aws-glue'; 

export function create(stack:cdk.Stack, dbName:string, account:string) {
    const covid_testing_us_daily_table = new glue.CfnTable(stack, 'covid_testing_us_daily', {
        databaseName: dbName,
        catalogId: account,
        tableInput: {
        name: "covid_testing_us_daily",
        description: "USA total test daily trend.  Sourced from covidtracking.com via REARC",
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
            name: "states",
            type: "bigint", 
            comment: "number of states and territories included"
            }, 
            {
            name: "positive",
            type: "double",
            comment: "number of positive cases"
            },
            {
            name: "negative",
            type: "double",
            comment: "number of negative cases"
            },
            {
            name: "posNeg",
            type: "double",
            comment: "positive + negative cases"
            },
            {
            name: "pending",
            type: "double",
            comment: "tests pending results"
            },
            {
            name: "hospitalized",
            type: "double",
            comment: "number of hospitalized patients"
            },
            {
            name: "death",
            type: "double",
            comment: "number of deaths"
            },
            {
            name: "total",
            type: "double",
            comment: "total tests"
            },
            {
            name: "hash",
            type: "string",
            comment: "hash value"
            },
            {
            name: "dateChecked",
            type: "string",
            comment: "last data sync"
            },
            {
            name: "totalTestResults",
            type: "double",
            comment: "total test results"
            },
            {
            name: "deathIncrease",
            type: "double",
            comment: "increase in deaths vs previous day"
            },
            {
            name: "hospitalizedIncrease",
            type: "double",
            comment: "increase in hospitalized patients vs previous day"
            },
            {
            name: "negativeIncrease",
            type: "double",
            comment: "increase in negative cases vs previous day"
            },
            {
            name: "positiveIncrease",
            type: "double",
            comment: "increase in positive cases vs previous day"
            },
            {
            name: "totalTestResultsIncrease",
            type: "double",
            comment: "increase in total results vs previous day"
            }
            ],
            compressed: false,
            inputFormat: "org.apache.hadoop.mapred.TextInputFormat",
            location: "s3://covid19-lake/rearc-covid-19-testing-data/json/us_daily",
            outputFormat: "org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat",
            serdeInfo: {
            parameters: {
                paths: "date,dateChecked,death,deathIncrease,hash,hospitalized,hospitalizedIncrease,negative,negativeIncrease,pending,posNeg,positive,positiveIncrease,states,total,totalTestResults,totalTestResultsIncrease"
            },
            serializationLibrary: "org.openx.data.jsonserde.JsonSerDe"/*
            serializationLibrary: "org.apache.hadoop.hive.serde2.lazy.LazySimpleSerDe", 
            parameters: {
                    "field.delim": ","
            }*/
            },
            storedAsSubDirectories: false
        },
        tableType: "EXTERNAL_TABLE"
        }
    });

    const covid_testing_states_daily_table = new glue.CfnTable(stack, 'covid_testing_states_daily', {
        databaseName: dbName,
        catalogId: account,
        tableInput: {
        name: "covid_testing_states_daily",
        description: "USA total test daily trend by state.  Sourced from covidtracking.com via REARC",
        parameters: {
            has_encrypted_data: false,
            classification: "json", 
            typeOfData: "file", 
            areColumnsQuoted: "false", 
            columnsOrdered: "true", 
            delimiter: ",", 
            "skip.header.line.count": "1"
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
            comment: "US State"
            }, 
            {
            name: "positive",
            type: "double",
            comment: "number of positive cases"
            },
            {
            name: "negative",
            type: "double",
            comment: "number of negative cases"
            },
            {
            name: "pending",
            type: "double",
            comment: "tests pending results"
            },
            {
            name: "hospitalized",
            type: "double",
            comment: "number of hospitalized patients"
            },
            {
            name: "death",
            type: "double",
            comment: "number of deaths"
            },
            {
            name: "total",
            type: "double",
            comment: "total tests"
            },
            {
            name: "hash",
            type: "string",
            comment: "hash value"
            },
            {
            name: "dateChecked",
            type: "string",
            comment: "last data sync"
            },
            {
            name: "totalTestResults",
            type: "double",
            comment: "total test results"
            },
            {
            name: "fips",
            type: "string",
            comment: "fips code"
            },
            {
            name: "deathIncrease",
            type: "double",
            comment: "increase in deaths vs previous day"
            },
            {
            name: "hospitalizedIncrease",
            type: "double",
            comment: "increase in hospitalized patients vs previous day"
            },
            {
            name: "negativeIncrease",
            type: "double",
            comment: "increase in negative cases vs previous day"
            },
            {
            name: "positiveIncrease",
            type: "double",
            comment: "increase in positive cases vs previous day"
            },
            {
            name: "totalTestResultsIncrease",
            type: "double",
            comment: "increase in total results vs previous day"
            }
            ],
            compressed: false,
            inputFormat: "org.apache.hadoop.mapred.TextInputFormat",
            location: "s3://covid19-lake/rearc-covid-19-testing-data/json/states_daily",
            outputFormat: "org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat",
            serdeInfo: {
            parameters: {
                paths: "date,dateChecked,death,deathIncrease,fips,hash,hospitalized,hospitalizedIncrease,negative,negativeIncrease,pending,positive,positiveIncrease,state,total,totalTestResults,totalTestResultsIncrease"
            },
            serializationLibrary: "org.openx.data.jsonserde.JsonSerDe" /*
            serializationLibrary: "org.apache.hadoop.hive.serde2.lazy.LazySimpleSerDe", 
            parameters: {
                    "field.delim": ","
                }*/
            },
            storedAsSubDirectories: false
        },
        tableType: "EXTERNAL_TABLE"
        }
    });

    const covid_testing_us_total_table = new glue.CfnTable(stack, 'covid_testing_us_total', {
        databaseName: dbName,
        catalogId: account,
        tableInput: {
        name: "covid_testing_us_total",
        description: "USA total tests.  Sourced from covidtracking.com via REARC",
        parameters: {
            has_encrypted_data: false,
            classification: "json",
            typeOfData: "file"
        },
        storageDescriptor: {
            columns: [ 
            {
            name: "positive",
            type: "double",
            comment: "number of positive cases"
            },
            {
            name: "negative",
            type: "double",
            comment: "number of negative cases"
            },
            {
            name: "posNeg",
            type: "double",
            comment: "positive + negative cases"
            },
            {
            name: "hospitalized",
            type: "double",
            comment: "number of hospitalized patients"
            },
            {
            name: "death",
            type: "double",
            comment: "number of deaths"
            },
            {
            name: "total",
            type: "double",
            comment: "total tests"
            },
            {
            name: "hash",
            type: "string",
            comment: "hash value"
            },
            {
            name: "lastModified",
            type: "string",
            comment: "eporting date"
            },
            {
            name: "totalTestResults",
            type: "double",
            comment: "total test results"
            },
            {
            name: "notes",
            type: "string",
            comment: ""
            }
            ],
            compressed: false,
            inputFormat: "org.apache.hadoop.mapred.TextInputFormat",
            location: "s3://covid19-lake/rearc-covid-19-testing-data/json/us-total-latest",
            outputFormat: "org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat",
            serdeInfo: {
            parameters: {
                paths: "death,hash,hospitalized,lastModified,negative,notes,posNeg,positive,total,totalTestResults"
            },
            serializationLibrary: "org.openx.data.jsonserde.JsonSerDe"
            },
            storedAsSubDirectories: false
        },
        tableType: "EXTERNAL_TABLE"
        }
    });

    /*
    new glue.CfnCrawler(stack, 'covid_testing_us_daily-crawler', {
        name: 'covid_testing_us_daily_crawler',
        databaseName: dbName,
        role: role.roleArn,
        targets: {
        catalogTargets: [{databaseName: dbName, tables: ['covid_testing_us_daily']}]
        },
        schedule: {scheduleExpression: 'cron(5 * * * ? *)'},
        schemaChangePolicy: {deleteBehavior: "LOG"},
        configuration: "{\"Version\":1.0,\"CrawlerOutput\":{\"Tables\":{\"AddOrUpdateBehavior\":\"MergeNewColumns\"}},\"Grouping\":{\"TableGroupingPolicy\":\"CombineCompatibleSchemas\"}}"
    }).addDependsOn(covid_testing_us_daily_table);
    new glue.CfnCrawler(stack, 'covid_testing_states_daily-crawler', {
        name: 'covid_testing_states_daily_crawler',
        databaseName: dbName,
        role: role.roleArn,
        targets: {
        catalogTargets: [{databaseName: dbName, tables: ['covid_testing_states_daily']}]
        },
        schedule: {scheduleExpression: 'cron(5 * * * ? *)'},
        schemaChangePolicy: {deleteBehavior: "LOG"},
        configuration: "{\"Version\":1.0,\"CrawlerOutput\":{\"Tables\":{\"AddOrUpdateBehavior\":\"MergeNewColumns\"}},\"Grouping\":{\"TableGroupingPolicy\":\"CombineCompatibleSchemas\"}}"
    }).addDependsOn(covid_testing_states_daily_table);
    new glue.CfnCrawler(stack, 'covid_testing_us_total-crawler', {
        name: 'covid_testing_us_total_crawler',
        databaseName: dbName,
        role: role.roleArn,
        targets: {
        catalogTargets: [{databaseName: dbName, tables: ['covid_testing_us_total']}]
        },
        schedule: {scheduleExpression: 'cron(5 * * * ? *)'},
        schemaChangePolicy: {deleteBehavior: "LOG"},
        configuration: "{\"Version\":1.0,\"CrawlerOutput\":{\"Tables\":{\"AddOrUpdateBehavior\":\"MergeNewColumns\"}},\"Grouping\":{\"TableGroupingPolicy\":\"CombineCompatibleSchemas\"}}"
    }).addDependsOn(covid_testing_us_total_table);
    */
}