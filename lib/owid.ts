import * as cdk from '@aws-cdk/core';
import * as glue from '@aws-cdk/aws-glue'; 

export function create(stack:cdk.Stack, dbName:string, account:string) {
    const owid_world = new glue.CfnTable(stack, 'owid_world_vaccinations', {
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
					name: "total_vaccinations_per_hundred",
					type: "double",
					comment: "total_vaccinations per 100 people in the total population of the country"
				},
                {
					name: "daily_vaccinations_raw",
					type: "bigint",
					comment: "daily change in the total number of doses administered. It is only calculated for consecutive days. This is a raw measure provided for data checks and transparency."
				},
                {
					name: "daily_vaccinations",
					type: "bigint",
					comment: "new doses administered per day (7-day smoothed). For countries that don't report data on a daily basis, we assume that doses changed equally on a daily basis over any periods in which no data was reported."
				},
                {
					name: "daily_vaccinations_per_million",
					type: "double",
					comment: "daily_vaccinations per 1,000,000 people in the total population of the country"
				},
				{
					name: "people_vaccinated",
					type: "bigint",
					comment: "total number of people who received at least one vaccine dose. "
				},
				{
					name: "people_vaccinated_per_hundred",
					type: "double",
					comment: "people_vaccinated per 100 people in the total population of the country"
				},
                {
					name: "people_fully_vaccinated",
					type: "bigint",
					comment: "total number of people who received all doses prescribed by the vaccination protocol"
				},
				{
					name: "people_fully_vaccinated_per_hundred",
					type: "double",
					comment: "people_fully_vaccinated per 100 people in the total population of the country"
				}
            ],
            compressed: false,
            inputFormat: "org.apache.hadoop.mapred.TextInputFormat",
            location: "s3://covid19-lake/owid_vaccinations/json/world_vaccinations/",
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

    const owid_usstates = new glue.CfnTable(stack, 'owid_us_state_vaccinations', {
        databaseName: dbName,
        catalogId: account,
        tableInput: {
        name: "owid_us_state_vaccinations",
        description: "US data on COVID-19 vaccinations, sourced from Our World in Data.",
        parameters: {
            has_encrypted_data: false,
            classification: "json", 
            typeOfData: "file"
        },
        storageDescriptor: {
            columns: [
                {
					name: "location",
					type: "string",
					comment: "name of the state or federal entity"
				},
				{
					name: "date",
					type: "string",
					comment: "date of the observation"
				},
				{
					name: "total_vaccinations",
					type: "bigint",
					comment: "total number of doses administered. This is counted as a single dose, and may not equal the total number of people vaccinated, depending on the specific dose regime (e.g. people receive multiple doses)."
				},
				{
					name: "total_vaccinations_per_hundred",
					type: "double",
					comment: "total_vaccinations per 100 people in the total population of the state"
				},
				{
					name: "daily_vaccinations_raw",
					type: "bigint",
					comment: "daily change in the total number of doses administered. It is only calculated for consecutive days. This is a raw measure provided for data checks and transparency."
				},
				{
					name: "daily_vaccinations",
					type: "bigint",
					comment: "new doses administered per day (7-day smoothed). For countries that don't report data on a daily basis, we assume that doses changed equally on a daily basis over any periods in which no data was reported."
				},
				{
					name: "daily_vaccinations_per_million",
					type: "double",
					comment: "daily_vaccinations per 1,000,000 people in the total population of the state"
				},
				{
					name: "people_vaccinated",
					type: "bigint",
					comment: "total number of people who received at least one vaccine dose"
				},
				{
					name: "people_vaccinated_per_hundred",
					type: "double",
					comment: "people_vaccinated per 100 people in the total population of the state"
				},
				{
					name: "people_fully_vaccinated",
					type: "bigint",
					comment: "total number of people who received all doses prescribed by the vaccination protocol"
				},
				{
					name: "people_fully_vaccinated_per_hundred",
					type: "double",
					comment: "people_fully_vaccinated per 100 people in the total population of the state"
				},
				{
					name: "total_distributed",
					type: "bigint",
					comment: "cumulative counts of COVID-19 vaccine doses recorded as shipped in CDC's Vaccine Tracking System"
				},
				{
					name: "total_distributed_per_hundred",
					type: "double",
					comment: "cumulative counts of COVID-19 vaccine doses recorded as shipped in CDC's Vaccine Tracking System per 100 people in the total population of the state"
				},
				{
					name: "share_doses_used",
					type: "double",
					comment: "share of vaccination doses administered among those recorded as shipped in CDC's Vaccine Tracking System"
				}
            ],
            compressed: false,
            inputFormat: "org.apache.hadoop.mapred.TextInputFormat",
            location: "s3://covid19-lake/owid_vaccinations/json/us_state_vaccinations/",
            outputFormat: "org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat",
            serdeInfo: {
            parameters: {
                paths: "daily_vaccinations,daily_vaccinations_per_million,daily_vaccinations_raw,date,location,people_fully_vaccinated,people_fully_vaccinated_per_hundred,people_vaccinated,people_vaccinated_per_hundred,share_doses_used,total_distributed,total_distributed_per_hundred,total_vaccinations,total_vaccinations_per_hundred"
            },
            serializationLibrary: "org.openx.data.jsonserde.JsonSerDe"
            },
            storedAsSubDirectories: false
        },
        tableType: "EXTERNAL_TABLE"
        }
    });

    const owid_manufacturer = new glue.CfnTable(stack, 'owid_world_vaccinations_by_manufacturer', {
        databaseName: dbName,
        catalogId: account,
        tableInput: {
        name: "owid_world_vaccinations_by_manufacturer",
        description: "Country-by-country data on global COVID-19 vaccinations broken down by vaccine manufacturer, sourced from Our World in Data.",
        parameters: {
            has_encrypted_data: false,
            classification: "json", 
            typeOfData: "file"
        },
        storageDescriptor: {
            columns: [
                {
					name: "location",
					type: "string",
					comment: "name of the country (or region within a country)"
				},
				{
					name: "date",
					type: "string",
					comment: "date of the observation"
				},
				{
					name: "vaccine",
					type: "string",
					comment: "vaccine manufacturer"
				},
				{
					name: "total_vaccinations",
					type: "bigint",
					comment: "total number of doses adminisetered"
				}
            ],
            compressed: false,
            inputFormat: "org.apache.hadoop.mapred.TextInputFormat",
            location: "s3://covid19-lake/owid_vaccinations/json/world_vaccinations_by_manufacturer/",
            outputFormat: "org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat",
            serdeInfo: {
            parameters: {
                paths: "date,location,total_vaccinations,vaccine"
            },
            serializationLibrary: "org.openx.data.jsonserde.JsonSerDe"
            },
            storedAsSubDirectories: false
        },
        tableType: "EXTERNAL_TABLE"
        }
    });
}