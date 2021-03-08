import * as cdk from '@aws-cdk/core';
import * as glue from '@aws-cdk/aws-glue'; 

export function create(stack:cdk.Stack, dbName:string, account:string) {
    const cdc_vaccines_phizer = new glue.CfnTable(stack, 'cdc_vaccines_phizer', {
        databaseName: dbName,
        catalogId: account,
        tableInput: {
        name: "cdc_pfizer_vaccine_distribution",
        description: "Vaccine distribution data by state for the Phizer vaccine, sourced from the CDC.",
        parameters: {
            has_encrypted_data: false,
            classification: "json", 
            typeOfData: "file"
        },
        storageDescriptor: {
            columns: [
                {
					name: "jurisdiction",
					type: "string",
					comment: "US State"
				},
				{
					name: "week_of_allocations",
					type: "string",
					comment: "Monday of the week in which allocations are provided"
				},
				{
					name: "_1st_dose_allocations",
					type: "bigint",
					comment: "allocations for first vaccine dose"
				},
				{
					name: "_2nd_dose_allocations",
					type: "bigint",
					comment: "allocations for second vaccine dose"
				}
            ],
            compressed: false,
            inputFormat: "org.apache.hadoop.mapred.TextInputFormat",
            location: "s3://covid19-lake/cdc-pfizer-vaccine-distribution/json/",
            outputFormat: "org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat",
            serdeInfo: {
            parameters: {
                paths: "_1st_dose_allocations,_2nd_dose_allocations,jurisdiction,week_of_allocations"
            },
            serializationLibrary: "org.openx.data.jsonserde.JsonSerDe"
            },
            storedAsSubDirectories: false
        },
        tableType: "EXTERNAL_TABLE"
        }
    });

    const cdc_vaccines_moderna = new glue.CfnTable(stack, 'cdc_vaccines_moderna', {
        databaseName: dbName,
        catalogId: account,
        tableInput: {
        name: "cdc_moderna_vaccine_distribution",
        description: "Vaccine distribution data by state for the Moderna vaccine, sourced from the CDC.",
        parameters: {
            has_encrypted_data: false,
            classification: "json", 
            typeOfData: "file"
        },
        storageDescriptor: {
            columns: [
                {
					name: "jurisdiction",
					type: "string",
					comment: "US State"
				},
				{
					name: "week_of_allocations",
					type: "string",
					comment: "Monday of the week in which allocations are provided"
				},
				{
					name: "_1st_dose_allocations",
					type: "bigint",
					comment: "allocations for first vaccine dose"
				},
				{
					name: "_2nd_dose_allocations",
					type: "bigint",
					comment: "allocations for second vaccine dose"
				}
            ],
            compressed: false,
            inputFormat: "org.apache.hadoop.mapred.TextInputFormat",
            location: "s3://covid19-lake/cdc-moderna-vaccine-distribution/json/",
            outputFormat: "org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat",
            serdeInfo: {
            parameters: {
                paths: "_1st_dose_allocations,_2nd_dose_allocations,jurisdiction,week_of_allocations"
            },
            serializationLibrary: "org.openx.data.jsonserde.JsonSerDe"
            },
            storedAsSubDirectories: false
        },
        tableType: "EXTERNAL_TABLE"
        }
    });
}