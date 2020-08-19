import * as cdk from '@aws-cdk/core';
import * as glue from '@aws-cdk/aws-glue'; 

export function create(stack:cdk.Stack, dbName:string, account:string) {
    const enigma_aggregation_global_table = new glue.CfnTable(stack, 'enigma_aggregation_global', {
        databaseName: dbName,
        catalogId: account,
        tableInput: {
        name: "enigma_aggregation_global",
        description: "Aggregation of COVID-19 data from Our World in Data, The New York Times and The COVID Tracking project. All geographies combined. Sourced from Enigma",
        parameters: {
            has_encrypted_data: false,
            classification: "json", 
            typeOfData: "file"
        },
        storageDescriptor: {
            columns: [
                {
                    name: "geographic_level",
                    type: "string"
                },
                {
                    name: "country_name",
                    type: "string"
                },
                {
                    name: "country_iso2",
                    type: "string"
                },
                {
                    name: "country_iso3",
                    type: "string"
                },
                {
                    name: "state_fips",
                    type: "string"
                },
                {
                    name: "state_name",
                    type: "string"
                },
                {
                    name: "county_fips",
                    type: "string"
                },
                {
                    name: "county_name",
                    type: "string"
                },
                {
                    name: "area_name",
                    type: "string"
                },
                {
                    name: "lat",
                    type: "double"
                },
                {
                    name: "long",
                    type: "double"
                },
                {
                    name: "population",
                    type: "double"
                },
                {
                    name: "date",
                    type: "string"
                },
                {
                    name: "cases",
                    type: "double"
                },
                {
                    name: "deaths",
                    type: "double"
                },
                {
                    name: "tests",
                    type: "double"
                },
                {
                    name: "tests_pending",
                    type: "double"
                },
                {
                    name: "tests_negative",
                    type: "double"
                },
                {
                    name: "tests_positive",
                    type: "double"
                },
                {
                    name: "tests_units",
                    type: "string"
                },
                {
                    name: "patients_icu",
                    type: "double"
                },
                {
                    name: "patients_hosp",
                    type: "double"
                },
                {
                    name: "patients_vent",
                    type: "double"
                },
                {
                    name: "recovered",
                    type: "double"
                },
                {
                    name: "version_timestamp",
                    type: "string"
                }
            ],
            compressed: false,
            inputFormat: "org.apache.hadoop.mapred.TextInputFormat",
            location: "s3://covid19-lake/enigma-aggregation/json/global/",
            outputFormat: "org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat",
            serdeInfo: {
            parameters: {
                paths: "area_name,cases,country_iso2,country_iso3,country_name,county_fips,county_name,date,deaths,geographic_level,lat,long,patients_hosp,patients_icu,patients_vent,population,recovered,state_fips,state_name,tests,tests_negative,tests_pending,tests_positive,tests_units,version_timestamp"
            },
            serializationLibrary: "org.openx.data.jsonserde.JsonSerDe"
            },
            storedAsSubDirectories: false
        },
        tableType: "EXTERNAL_TABLE"
        }
    });

    const enigma_aggregation_global_countries_table = new glue.CfnTable(stack, 'enigma_aggregation_global_countries', {
        databaseName: dbName,
        catalogId: account,
        tableInput: {
        name: "enigma_aggregation_global_countries",
        description: "Aggregation of COVID-19 data from Our World in Data, The New York Times and The COVID Tracking project. Country level only. Sourced from Enigma",
        parameters: {
            has_encrypted_data: false,
            classification: "json", 
            typeOfData: "file"
        },
        storageDescriptor: {
            columns: [
                {
                    name: "country_name",
                    type: "string"
                },
                {
                    name: "country_iso2",
                    type: "string"
                },
                {
                    name: "country_iso3",
                    type: "string"
                },
                {
                    name: "lat",
                    type: "double"
                },
                {
                    name: "long",
                    type: "double"
                },
                {
                    name: "population",
                    type: "double"
                },
                {
                    name: "date",
                    type: "string"
                },
                {
                    name: "cases",
                    type: "double"
                },
                {
                    name: "deaths",
                    type: "double"
                },
                {
                    name: "tests",
                    type: "double"
                },
                {
                    name: "tests_units",
                    type: "string"
                }
            ],
            compressed: false,
            inputFormat: "org.apache.hadoop.mapred.TextInputFormat",
            location: "s3://covid19-lake/enigma-aggregation/json/global_countries/",
            outputFormat: "org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat",
            serdeInfo: {
            parameters: {
                paths: "cases,country_iso2,country_iso3,country_name,date,deaths,lat,long,population,tests,tests_units"
            },
            serializationLibrary: "org.openx.data.jsonserde.JsonSerDe"
            },
            storedAsSubDirectories: false
        },
        tableType: "EXTERNAL_TABLE"
        }
    });

    const enigma_aggregation_us_counties_table = new glue.CfnTable(stack, 'enigma_aggregation_us_counties', {
        databaseName: dbName,
        catalogId: account,
        tableInput: {
        name: "enigma_aggregation_us_counties",
        description: "Aggregation of COVID-19 data from Our World in Data, The New York Times and The COVID Tracking project. US counties only. Sourced from Enigma",
        parameters: {
            has_encrypted_data: false,
            classification: "json", 
            typeOfData: "file"
        },
        storageDescriptor: {
            columns: [
                {
                    name: "state_fips",
                    type: "string"
                },
                {
                    name: "state_name",
                    type: "string"
                },
                {
                    name: "county_fips",
                    type: "string"
                },
                {
                    name: "county_name",
                    type: "string"
                },
                {
                    name: "area_name",
                    type: "string"
                },
                {
                    name: "lat",
                    type: "double"
                },
                {
                    name: "long",
                    type: "double"
                },
                {
                    name: "date",
                    type: "string"
                },
                {
                    name: "cases",
                    type: "double"
                },
                {
                    name: "deaths",
                    type: "double"
                }
            ],
            compressed: false,
            inputFormat: "org.apache.hadoop.mapred.TextInputFormat",
            location: "s3://covid19-lake/enigma-aggregation/json/us_counties/",
            outputFormat: "org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat",
            serdeInfo: {
            parameters: {
                paths: "area_name,cases,county_fips,county_name,date,deaths,lat,long,state_fips,state_name"
            },
            serializationLibrary: "org.openx.data.jsonserde.JsonSerDe"
            },
            storedAsSubDirectories: false
        },
        tableType: "EXTERNAL_TABLE"
        }
    });

    const enigma_aggregation_us_states_table = new glue.CfnTable(stack, 'enigma_aggregation_us_states', {
        databaseName: dbName,
        catalogId: account,
        tableInput: {
        name: "enigma_aggregation_us_states",
        description: "Aggregation of COVID-19 data from Our World in Data, The New York Times and The COVID Tracking project. US states only. Sourced from Enigma",
        parameters: {
            has_encrypted_data: false,
            classification: "json", 
            typeOfData: "file"
        },
        storageDescriptor: {
            columns: [
                {
                    name: "state_fips",
                    type: "string"
                },
                {
                    name: "state_name",
                    type: "string"
                },
                {
                    name: "lat",
                    type: "double"
                },
                {
                    name: "long",
                    type: "double"
                },
                {
                    name: "date",
                    type: "string"
                },
                {
                    name: "cases",
                    type: "double"
                },
                {
                    name: "deaths",
                    type: "double"
                },
                {
                    name: "tests",
                    type: "double"
                },
                {
                    name: "tests_pending",
                    type: "double"
                },
                {
                    name: "tests_negative",
                    type: "double"
                },
                {
                    name: "tests_positive",
                    type: "double"
                },
                {
                    name: "patients_icu",
                    type: "double"
                },
                {
                    name: "patients_hosp",
                    type: "double"
                },
                {
                    name: "patients_vent",
                    type: "double"
                },
                {
                    name: "recovered",
                    type: "double"
                }
            ],
            compressed: false,
            inputFormat: "org.apache.hadoop.mapred.TextInputFormat",
            location: "s3://covid19-lake/enigma-aggregation/json/us_states/",
            outputFormat: "org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat",
            serdeInfo: {
            parameters: {
                paths: "cases,date,deaths,lat,long,patients_hosp,patients_icu,patients_vent,recovered,state_fips,state_name,tests,tests_negative,tests_pending,tests_positive"
            },
            serializationLibrary: "org.openx.data.jsonserde.JsonSerDe"
            },
            storedAsSubDirectories: false
        },
        tableType: "EXTERNAL_TABLE"
        }
    });
}