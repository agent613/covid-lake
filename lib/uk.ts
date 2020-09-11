import * as cdk from '@aws-cdk/core';
import * as glue from '@aws-cdk/aws-glue'; 

export function create(stack:cdk.Stack, dbName:string, account:string) {
    const uk_covid = new glue.CfnTable(stack, 'uk_covid', {
        databaseName: dbName,
        catalogId: account,
        tableInput: {
        name: "uk_covid",
        description: "COVID-19 case and testing data from the United Kingdom, sourced from https://coronavirus.data.gov.uk/",
        parameters: {
            has_encrypted_data: false,
            classification: "json", 
            typeOfData: "file"
        },
        storageDescriptor: {
            columns: [
                {
					name: "areatype",
					type: "string",
					comment: "type of area covered: overview, nation, region, nhsRegion, utla, ltla"
				},
				{
					name: "areaname",
					type: "string",
					comment: "name of the covered area"
				},
				{
					name: "areacode",
					type: "string",
					comment: "code of the covered area"
				},
				{
					name: "date",
					type: "string",
					comment: "reporting date"
				},
				{
					name: "newcasesbypublishdate",
					type: "bigint",
					comment: "New cases by publish date"
				},
				{
					name: "cumcasesbypublishdate",
					type: "bigint",
					comment: "Cumulative cases by publish date"
				},
				{
					name: "newcasesbyspecimendate",
					type: "bigint",
					comment: "New cases by specimen date"
				},
				{
					name: "cumcasesbyspecimendate",
					type: "bigint",
					comment: "Cumulative cases by specimen date"
				},
				{
					name: "malecases",
					type: "array<struct<age:string,value:bigint,rate:double>>",
					comment: "Male cases (by age)"
				},
				{
					name: "femalecases",
					type: "array<struct<age:string,value:bigint,rate:double>>",
					comment: "Female cases (by age)"
				},
				{
					name: "newpillaronetestsbypublishdate",
					type: "bigint",
					comment: "New pillar one tests by publish date"
				},
				{
					name: "cumpillaronetestsbypublishdate",
					type: "bigint",
					comment: "Cumulative pillar one tests by publish date"
				},
				{
					name: "newpillartwotestsbypublishdate",
					type: "bigint",
					comment: "New pillar two tests by publish date"
				},
				{
					name: "cumpillartwotestsbypublishdate",
					type: "bigint",
					comment: "Cumulative pillar two tests by publish date"
				},
				{
					name: "newpillarthreetestsbypublishdate",
					type: "bigint",
					comment: "New pillar three tests by publish date"
				},
				{
					name: "cumpillarthreetestsbypublishdate",
					type: "bigint",
					comment: "Cumulative pillar three tests by publish date"
				},
				{
					name: "newpillarfourtestsbypublishdate",
					type: "bigint",
					comment: "New pillar four tests by publish date"
				},
				{
					name: "cumpillarfourtestsbypublishdate",
					type: "bigint",
					comment: "Cumulative pillar four tests by publish date"
				},
				{
					name: "newadmissions",
					type: "bigint",
					comment: "New admissions"
				},
				{
					name: "cumadmissions",
					type: "bigint",
					comment: "Cumulative number of admissions"
				},
				{
					name: "cumadmissionsbyage",
					type: "array<struct<age:string,value:bigint,rate:double>>",
					comment: "Cumulative admissions by age"
				},
				{
					name: "cumtestsbypublishdate",
					type: "bigint",
					comment: "Cumulative tests by publish date"
				},
				{
					name: "newtestsbypublishdate",
					type: "bigint",
					comment: "New tests by publish date"
				},
				{
					name: "covidoccupiedmvbeds",
					type: "bigint",
					comment: "COVID-19 occupied beds with mechanical ventilators"
				},
				{
					name: "hospitalcases",
					type: "bigint",
					comment: "Hospital cases"
				},
				{
					name: "plannedcapacitybypublishdate",
					type: "bigint",
					comment: "Planned capacity by publish date"
				},
				{
					name: "newdeaths28daysbypublishdate",
					type: "bigint",
					comment: "Deaths within 28 days of positive test"
				},
				{
					name: "cumdeaths28daysbypublishdate",
					type: "bigint",
					comment: ""
				},
				{
					name: "cumdeaths28daysbypublishdaterate",
					type: "double",
					comment: "Cumulative deaths within 28 days of positive test"
				},
				{
					name: "newdeaths28daysbydeathdate",
					type: "bigint",
					comment: "Deaths within 28 days of positive test by death date"
				},
				{
					name: "cumdeaths28daysbydeathdate",
					type: "bigint",
					comment: "Cumulative deaths within 28 days of positive test by death date"
				},
				{
					name: "cumdeaths28daysbydeathdaterate",
					type: "double",
					comment: "Rate of cumulative deaths within 28 days of positive test per 100k resident population"
				}
            ],
            compressed: false,
            inputFormat: "org.apache.hadoop.mapred.TextInputFormat",
            location: "s3://covid19-lake/uk_covid/json/",
            outputFormat: "org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat",
            serdeInfo: {
            parameters: {
                paths: "areaCode,areaName,areaType,covidOccupiedMVBeds,cumAdmissions,cumAdmissionsByAge,cumCasesByPublishDate,cumCasesBySpecimenDate,cumDeaths28DaysByDeathDate,cumDeaths28DaysByDeathDateRate,cumDeaths28DaysByPublishDate,cumDeaths28DaysByPublishDateRate,cumPillarFourTestsByPublishDate,cumPillarOneTestsByPublishDate,cumPillarThreeTestsByPublishDate,cumPillarTwoTestsByPublishDate,cumTestsByPublishDate,date,femaleCases,hospitalCases,maleCases,newAdmissions,newCasesByPublishDate,newCasesBySpecimenDate,newDeaths28DaysByDeathDate,newDeaths28DaysByPublishDate,newPillarFourTestsByPublishDate,newPillarOneTestsByPublishDate,newPillarThreeTestsByPublishDate,newPillarTwoTestsByPublishDate,newTestsByPublishDate,plannedCapacityByPublishDate"
            },
            serializationLibrary: "org.openx.data.jsonserde.JsonSerDe"
            },
            storedAsSubDirectories: false
        },
        tableType: "EXTERNAL_TABLE"
        }
    });

}