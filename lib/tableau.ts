import * as cdk from '@aws-cdk/core';
import * as glue from '@aws-cdk/aws-glue'; 

export function create(stack:cdk.Stack, dbName:string, account:string) {

    const tableau_datahub_table = new glue.CfnTable(stack, 'tableau_datahub_table', {
        databaseName: dbName,
        catalogId: account,
        tableInput: {
        description: "COVID-19 data that has been gathered and unified from trusted sources to include the New York Times and the European CDC. Sourced from Tableau",
        name: "tableau_covid_datahub",
        parameters: {
            has_encrypted_data: false,
            classification: "json", 
            typeOfData: "file"
        },
        storageDescriptor: { 
            columns: [
                {
                    type: "string", 
                    name: "country_short_name"
                }, 
                {
                    type: "string", 
                    name: "country_alpha_3_code"
                }, 
                {
                    type: "string", 
                    name: "country_alpha_2_code"
                }, 
                {
                    type: "string", 
                    name: "continent_name"
                }, 
                {
                    type: "string", 
                    name: "province_state_name"
                }, 
                {
                    type: "string", 
                    name: "county_name"
                }, 
                {
                    type: "string", 
                    name: "county_fips_number"
                }, 
                {
                    type: "bigint", 
                    name: "people_positive_cases_count",
                    comment: " Total (cumulative) positive cases"
                }, 
                {
                    type: "string", 
                    name: "report_date"
                }, 
                {
                    type: "string", 
                    name: "data_source_name",
                    comment: "NYT for New York Times and EUDC for  European Centre for Disease Prevention and Control"
                }, 
                {
                    type: "bigint", 
                    name: "people_death_new_count",
                    comment: "total deaths for each day"
                }, 
                {
                    type: "bigint", 
                    name: "people_positive_new_cases_count",
                    comment: "Total new positive cases for each day"
                }, 
                {
                    type: "bigint", 
                    name: "people_death_count",
                    comment: "Total (cumulative) deaths"
                }
            ],
            compressed: false,
            inputFormat: "org.apache.hadoop.mapred.TextInputFormat",
            location: "s3://covid19-lake/tableau-covid-datahub/json/",
            outputFormat: "org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat",
            serdeInfo: {
            parameters: {
                paths: "CONTINENT_NAME,COUNTRY_ALPHA_2_CODE,COUNTRY_ALPHA_3_CODE,COUNTRY_SHORT_NAME,COUNTY_FIPS_NUMBER,COUNTY_NAME,DATA_SOURCE_NAME,PEOPLE_DEATH_COUNT,PEOPLE_DEATH_NEW_COUNT,PEOPLE_POSITIVE_CASES_COUNT,PEOPLE_POSITIVE_NEW_CASES_COUNT,PROVINCE_STATE_NAME,REPORT_DATE"
            },
            serializationLibrary: "org.openx.data.jsonserde.JsonSerDe"
            },
            storedAsSubDirectories: false
        },
        tableType: "EXTERNAL_TABLE"
    }
});
}