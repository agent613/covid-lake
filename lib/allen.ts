import * as cdk from '@aws-cdk/core';
import * as glue from '@aws-cdk/aws-glue'; 

export function create(stack:cdk.Stack, dbName:string, account:string) {
    const allen_metadata_table = new glue.CfnTable(stack, 'alleninstitute_metadata', {
        databaseName: dbName,
        catalogId: account,
        tableInput: {
        description: "Metadata on papers pulled from the Allen Institute.  The 'sha' column indicates the paper id",
        name: "alleninstitute_metadata",
        parameters: {
            has_encrypted_data: false,
            classification: "json",
            typeOfData: "file"
        },
        storageDescriptor: {
            columns: [
            {
                type: "string", 
                name: "cord_uid",
                comment: "unique identifier coming from CORD (COVID-19 Open Research Dataset)"
            }, 
            {
                type: "string", 
                name: "sha",
                comment: "hash for the paper id.  can now include multiple files (some PMC files have multiple associated PDFs)"
            }, 
            {
                type: "string", 
                name: "source_x",
                comment: "the data source, currently: PMC, biorxiv, CZI, or medrxiv"
            }, 
            {
                type: "string", 
                name: "title",
                comment: "the title of the paper"
            }, 
            {
                type: "string", 
                name: "doi",
                comment: "doi id for the paper"
            }, 
            {
                type: "string", 
                name: "pmcid",
                comment: "pmc id for the paper"
            }, 
            {
                type: "string", 
                name: "pubmed_id",
                comment: "pubmed id for the paper"
            }, 
            {
                type: "string", 
                name: "license",
                comment: "license associated to the paper"
            }, 
            {
                type: "string", 
                name: "abstract",
                comment: "abstract of the paper"
            }, 
            {
                type: "string", 
                name: "publish_time",
                comment: "When the paper was published.  Some papers are at the day level, while others are at the year."
            }, 
            {
                type: "string", 
                name: "authors"
            }, 
            {
                type: "string", 
                name: "journal",
                comment: "journal in which the paper was published"
            }, 
            {
                type: "string", 
                name: "microsoft academic paper id",
                comment: "paper id in microsoft academic (if applicable)"
            }, 
            {
                type: "string", 
                name: "who #covidence",
                comment: "covidence number from WHO"
            }, 
            {
                type: "boolean", 
                name: "has_full_text", 
                comment: "whether the full text of the paper is available"
            },
            {
                name: "full_text_file",
                type: "string",
                comment: "which S3 folder/prefix the full text is in"
            },
            {
            name: "url",
            type: "string",
            comment: "url of the journal or paper"
            }
            ],
            compressed: false,
            inputFormat: "org.apache.hadoop.mapred.TextInputFormat",
            location: "s3://covid19-lake/alleninstitute/CORD19/json/metadata",
            outputFormat: "org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat",
            serdeInfo: {
            parameters: {
                paths: "Microsoft Academic Paper ID,WHO #Covidence,abstract,authors,cord_uid,doi,full_text_file,has_full_text,journal,license,pmcid,publish_time,pubmed_id,sha,source_x,title,url"
            },
            serializationLibrary: "org.openx.data.jsonserde.JsonSerDe"
            },
            storedAsSubDirectories: false
        },
        tableType: "EXTERNAL_TABLE"
        }
    });

    const allen_comprehend_table = new glue.CfnTable(stack, 'alleninstitute_comprehend_medical', {
        databaseName: dbName,
        catalogId: account,
        tableInput: {
        description: "Comprehend Medical results run against Allen Institute data on medical papers.",
        name: "alleninstitute_comprehend_medical",
        tableType: "EXTERNAL_TABLE",
        storageDescriptor: {
            columns: [
                {
                    name: "paper_id",
                    type: "string",
                    comment: "the id of the paper"
                },
                {
                    name: "date",
                    type: "array<string>",
                    comment: ""
                },
                {
                    name: "dx_name",
                    type: "array<string>",
                    comment: "All medical conditions listed. Includes present illness, reason for visit, and medical history"
                },
                {
                    name: "test_name",
                    type: "array<string>",
                    comment: "Procedures performed on a patient for diagnostic, measurement, screening, or rating that might have a resulting value"
                },
                {
                    name: "procedure_name",
                    type: "array<string>",
                    comment: "Interventions as a one-time action performed on the patient to treat a medical condition or to provide patient care"
                },
                {
                    name: "phone_or_fax",
                    type: "array<string>",
                    comment: "Any phone, fax, or pager number. Excludes named phone numbers, such as 1-800-QUIT-NOW and 911"
                },
                {
                    name: "time_to_test_name",
                    type: "array<string>",
                    comment: "The date a test was performed"
                },
                {
                    name: "url",
                    type: "array<string>",
                    comment: ""
                },
                {
                    name: "generic_name",
                    type: "array<string>",
                    comment: "Non-brand name, ingredient name, or formula mixture of the medication or therapeutic agent"
                },
                {
                    name: "name",
                    type: "array<string>",
                    comment: "All names. Typically, names of the patient, family, or provider"
                },
                {
                    name: "brand_name",
                    type: "array<string>",
                    comment: "The copyrighted brand name of the medication or therapeutic agent"
                },
                {
                    name: "address",
                    type: "array<string>",
                    comment: "All geographical subdivisions of an address of any facility, named medical facilities, or wards within a facility"
                },
                {
                    name: "id",
                    type: "array<string>",
                    comment: "Social security number, medical record number, facility identification number, clinical trial number, certificate or license number, vehicle or device number. This includes any biometric number of the patient, place of care, or provider."
                },
                {
                    name: "treatment_name",
                    type: "array<string>",
                    comment: "Interventions performed over a span of time for combating a disease or disorder. This includes groupings of medications, such as antivirals and vaccinations"
                },
                {
                    name: "system_organ_site",
                    type: "array<string>",
                    comment: "Body systems, anatomic locations or regions, and body sites"
                },
                {
                    name: "time_to_treatment_name",
                    type: "array<string>",
                    comment: "The date a treatment was administered"
                },
                {
                    name: "time_to_dx_name",
                    type: "array<string>",
                    comment: "The date a medical condition occurred"
                },
                {
                    name: "time_to_medication_name",
                    type: "array<string>",
                    comment: "The date a medication was taken"
                },
                {
                    name: "time_to_procedure_name",
                    type: "array<string>",
                    comment: "The date a procedure was performed"
                },
                {
                    name: "profession",
                    type: "array<string>",
                    comment: "Any profession or employer that pertains to the patient or the patient's family. It does include the profession of the clinician mentioned in the note"
                },
                {
                    name: "email",
                    type: "array<string>",
                    comment: "Any email address"
                },
                {
                    name: "age",
                    type: "array<string>",
                    comment: "All components of age, spans of age, or any age mentioned. This includes those of a patient, family members, or others. The default is in years unless otherwise noted"
                }
            ],
            location: "s3://covid19-lake/alleninstitute/CORD19/comprehendmedical/",
            inputFormat: "org.apache.hadoop.mapred.TextInputFormat",
            outputFormat: "org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat",
            compressed: false,
            numberOfBuckets: -1,
            serdeInfo: {
                serializationLibrary: "org.openx.data.jsonserde.JsonSerDe",
                parameters: {
                paths: "ADDRESS,AGE,BRAND_NAME,DATE,DX_NAME,EMAIL,GENERIC_NAME,ID,NAME,PHONE_OR_FAX,PROCEDURE_NAME,PROFESSION,SYSTEM_ORGAN_SITE,TEST_NAME,TIME_TO_DX_NAME,TIME_TO_MEDICATION_NAME,TIME_TO_PROCEDURE_NAME,TIME_TO_TEST_NAME,TIME_TO_TREATMENT_NAME,TREATMENT_NAME,URL,paper_id"
                }
            },
            parameters: {
                compressionType: "none",
                classification: "json",
                typeOfData: "file"
            },
            storedAsSubDirectories: false
        },
        parameters: {
            compressionType: "none",
            classification: "json",
            typeOfData: "file"
        }
        }
    });

    /*
    new glue.CfnCrawler(stack, 'allen-metadata-crawler', {
        name: 'covid-alleninstitute-metadata-crawler',
        databaseName: dbName,
        role: role.roleArn,
        targets: {
        catalogTargets: [{databaseName: dbName, tables: ['alleninstitute_metadata']}]
        },
        schedule: {scheduleExpression: 'cron(5 * * * ? *)'},
        schemaChangePolicy: {deleteBehavior: "LOG"},
        configuration: "{\"Version\":1.0,\"CrawlerOutput\":{\"Tables\":{\"AddOrUpdateBehavior\":\"MergeNewColumns\"}},\"Grouping\":{\"TableGroupingPolicy\":\"CombineCompatibleSchemas\"}}"
    }).addDependsOn(allen_metadata_table);
    new glue.CfnCrawler(stack, 'allen-comprehend-crawler', {
        name: 'covid-alleninstitute-comprehend-crawler',
        databaseName: dbName,
        role: role.roleArn,
        targets: {
        catalogTargets: [{databaseName: dbName, tables: ['alleninstitute_comprehend_medical']}]
        },
        schedule: {scheduleExpression: 'cron(5 * * * ? *)'},
        schemaChangePolicy: {deleteBehavior: "LOG"},
        configuration: "{\"Version\":1.0,\"CrawlerOutput\":{\"Tables\":{\"AddOrUpdateBehavior\":\"MergeNewColumns\"}},\"Grouping\":{\"TableGroupingPolicy\":\"CombineCompatibleSchemas\"}}"
    }).addDependsOn(allen_comprehend_table);
    */
}