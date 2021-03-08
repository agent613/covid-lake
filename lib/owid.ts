import * as cdk from '@aws-cdk/core';
import * as glue from '@aws-cdk/aws-glue'; 

export function create(stack:cdk.Stack, dbName:string, account:string) {
    const cdc_vaccines_phizer = new glue.CfnTable(stack, 'owid_world_vaccinations', {
        databaseName: dbName,
        catalogId: account,
        tableInput: {
        name: "owid_world_vaccinations",
        description: "Country-by-country data on global COVID-19 vaccinations, sourced from Our World in Data.",
        parameters: {
            has_encrypted_data: false,
            classification: "json", 
            typeOfData: "file"
        },
        storageDescriptor: {
            columns: [
                {
					name: "country",
					type: "string",
					comment: "name of the country (or region within a country)"
				},
				{
					name: "iso_code",
					type: "string",
					comment: "ISO 3166-1 alpha-3 – three-letter country codes"
				},
				{
					name: "date",
					type: "string",
					comment: "date of the observation"
				},
				{
					name: "total_vaccinations",
					type: "bigint",
					comment: "total number of doses administered. This is counted as a single dose, and may not equal the total number of people vaccinated, depending on the specific dose regime."
				},
				{
					name: "people_vaccinated",
					type: "bigint",
					comment: "total number of people who received at least one vaccine dose. "
				},
				{
					name: "daily_vaccinations",
					type: "bigint",
					comment: "new doses administered per day (7-day smoothed). For countries that don't report data on a daily basis, we assume that doses changed equally on a daily basis over any periods in which no data was reported."
				},
				{
					name: "total_vaccinations_per_hundred",
					type: "double",
					comment: "total_vaccinations per 100 people in the total population of the country"
				},
				{
					name: "people_vaccinated_per_hundred",
					type: "double",
					comment: "people_vaccinated per 100 people in the total population of the country"
				},
				{
					name: "daily_vaccinations_per_million",
					type: "double",
					comment: "daily_vaccinations per 1,000,000 people in the total population of the country"
				}
            ],
            compressed: false,
            inputFormat: "org.apache.hadoop.mapred.TextInputFormat",
            location: "s3://covid19-lake/owid_world_vaccinations/json/",
            outputFormat: "org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat",
            serdeInfo: {
            parameters: {
                paths: "country,daily_vaccinations,daily_vaccinations_per_million,date,iso_code,people_vaccinated,people_vaccinated_per_hundred,total_vaccinations,total_vaccinations_per_hundred"
            },
            serializationLibrary: "org.openx.data.jsonserde.JsonSerDe"
            },
            storedAsSubDirectories: false
        },
        tableType: "EXTERNAL_TABLE"
        }
    });

}