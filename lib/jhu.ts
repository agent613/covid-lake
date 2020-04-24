import * as cdk from '@aws-cdk/core';
import * as glue from '@aws-cdk/aws-glue'; 

export function create(stack:cdk.Stack, dbName:string, account:string) {
    const jhu_cons_table = new glue.CfnTable(stack, 'jhu_consolidated', {
        databaseName: dbName,
        catalogId: account,
        tableInput: {
        description: "Johns Hopkins University Consolidated data on COVID-19 cases, sourced from Enigma",
        name: "enigma_jhu",
        parameters: {
            has_encrypted_data: false,
            classification: "json", 
            typeOfData: "file"
        },
        storageDescriptor: { 
            columns: [
            {
                name: "fips",
                type: "string", 
                comment: "state and county two digits code"
            },
            {
                name: "admin2",
                type: "string", 
                comment: "county name"
            },
            {
                name: "province_state",
                type: "string", 
                comment: "province name or state name"
            }, 
            {
                name: "country_region",
                type: "string", 
                comment: "country name or region name"
            },
            {
                name: "last_update",
                type: "string", 
                comment: "last update timestamp"
            }, 
            {
                name: "latitude",
                type: "double", 
                comment: "location (latitude)"
            }, 
            {
                name: "longitude",
                type: "double", 
                comment: "location (longitude)"
            }, 
            {
                name: "confirmed",
                type: "int", 
                comment: "number of confirmed cases"
            }, 
            {
                name: "deaths",
                type: "int", 
                comment: "number of deaths"
            }, 
            {
                name: "recovered",
                type: "int", 
                comment: "number of recovered patients"
            }, 
            {
                name: "active",
                type: "int", 
                comment: "number of active cases"
            },
            {
                name: "combined_key",
                type: "string", 
                comment: "county name+state name+country name"
            }
            
            ],
            compressed: false,
            inputFormat: "org.apache.hadoop.mapred.TextInputFormat",
            location: "s3://covid19-lake/enigma-jhu/json",
            outputFormat: "org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat",
            serdeInfo: {
            parameters: {
                paths: "active,admin2,combined_key,confirmed,country_region,deaths,fips,last_update,latitude,longitude,province_state,recovered"
            },
            serializationLibrary: "org.openx.data.jsonserde.JsonSerDe"
            },
            storedAsSubDirectories: false
        },
        tableType: "EXTERNAL_TABLE"
        }
    });

    const jhu_timeseries_table = new glue.CfnTable(stack, 'jhu_timeseries', {
        databaseName: dbName,
        catalogId: account,
        tableInput: {
        description: "Johns Hopkins University data on COVID-19 cases, sourced from Enigma",
        name: "enigma_jhu_timeseries",
        parameters: {
            has_encrypted_data: false,
            classification: "json", 
            typeOfData: "file"
        },
        storageDescriptor: { 
            columns: [
            {
                name: "uid",
                type: "bigint",
                comment: ""
            },
            {
                name: "fips",
                type: "string", 
                comment: "state and county two digits code"
            },
            {
                name: "iso2",
                type: "string",
                comment: ""
            },
            {
                name: "iso3",
                type: "string",
                comment: ""
            },
            {
                name: "code3",
                type: "int",
                comment: ""
            },
            {
                name: "admin2",
                type: "string", 
                comment: "county name"
            },
            {
                name: "latitude",
                type: "double", 
                comment: "location (latitude)"
            }, 
            {
                name: "longitude",
                type: "double", 
                comment: "location (longitude)"
            }, 
            {
                name: "province_state",
                type: "string", 
                comment: "province name or state name"
            }, 
            {
                name: "country_region",
                type: "string", 
                comment: "country name or region name"
            },
            {
                name: "date",
                type: "string",
                comment: "reporting date"
            },
            {
                name: "confirmed",
                type: "int", 
                comment: "number of confirmed cases"
            }, 
            {
                name: "deaths",
                type: "int", 
                comment: "number of deaths"
            }, 
            {
                name: "recovered",
                type: "int", 
                comment: "number of recovered patients"
            }, 
            {
                name: "active",
                type: "int", 
                comment: "number of active cases"
            },
            {
                name: "combined_key",
                type: "string", 
                comment: "county name+state name+country name"
            }
            ],
            compressed: false,
            inputFormat: "org.apache.hadoop.mapred.TextInputFormat",
            location: "s3://covid19-lake/enigma-jhu-timeseries/json/",
            outputFormat: "org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat",
            serdeInfo: {
            parameters: {
                paths: "admin2,code3,confirmed,country_region,date,deaths,fips,iso2,iso3,latitude,longitude,province_state,recovered,uid"
            },
            serializationLibrary: "org.openx.data.jsonserde.JsonSerDe"
            },
            storedAsSubDirectories: false
        },
        tableType: "EXTERNAL_TABLE"
        }
    });

    const tableau_jhu_table = new glue.CfnTable(stack, 'tableau_jhu', {
        databaseName: dbName,
        catalogId: account,
        tableInput: {
        description: "Johns Hopkins University data on COVID-19 cases, sourced from Tableau",
        name: "tableau_jhu",
        parameters: {
            has_encrypted_data: false,
            classification: "json", 
            typeOfData: "file"
        },
        storageDescriptor: { 
            columns: [
            {
                name: "case_type",
                type: "string",
                comment: "Confirmed, Deaths, etc."
            },
            {
                name: "cases",
                type: "bigint",
                comment: "number of cases"
            },
            {
                name: "difference",
                type: "bigint",
                comment: "difference in cases vs the previous day"
            },
            {
                name: "date",
                type: "string",
                comment: "reporting date"
            },
            {
                name: "country_region",
                type: "string", 
                comment: "country name or region name"
            },
            {
                name: "province_state",
                type: "string", 
                comment: "province name or state name"
            }, 
            {
                name: "admin2",
                type: "string", 
                comment: "county name"
            },
            {
                name: "combined_key",
                type: "string", 
                comment: "county name+state name+country name"
            },
            {
                name: "fips",
                type: "string", 
                comment: "state and county two digits code"
            },
            {
                name: "lat",
                type: "double", 
                comment: "location (latitude)"
            }, 
            {
                name: "long",
                type: "double", 
                comment: "location (longitude)"
            }, 
            {
                name: "table_names",
                type: "string",
                comment: "source table name"
            },
            {
                name: "prep_flow_runtime",
                type: "string",
                comment: "timestamp when the data was generated for this data load"
            }
            ],
            compressed: false,
            inputFormat: "org.apache.hadoop.mapred.TextInputFormat",
            location: "s3://covid19-lake/tableau-jhu/json/",
            outputFormat: "org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat",
            serdeInfo: {
            parameters: {
                paths: "Admin2,Case_Type,Cases,Combined_Key,Country_Region,Date,Difference,FIPS,Lat,Long,Prep_Flow_Runtime,Province_State,Table_Names"
            },
            serializationLibrary: "org.openx.data.jsonserde.JsonSerDe"
            },
            storedAsSubDirectories: false
        },
        tableType: "EXTERNAL_TABLE"
        }
    });

    /*
    new glue.CfnCrawler(this, 'jhu-crawler', {
        name: 'covid-enigma-jhu-crawler',
        databaseName: dbName,
        role: role.roleArn,
        targets: {
        catalogTargets: [{databaseName: db.databaseName, tables: ['enigma_jhu']}]
        },
        schedule: {scheduleExpression: 'cron(5 * * * ? *)'},
        schemaChangePolicy: {deleteBehavior: "LOG"},
        configuration: "{\"Version\":1.0,\"CrawlerOutput\":{\"Tables\":{\"AddOrUpdateBehavior\":\"MergeNewColumns\"}},\"Grouping\":{\"TableGroupingPolicy\":\"CombineCompatibleSchemas\"}}"
    }).addDependsOn(jhu_cons_table);
    */
}