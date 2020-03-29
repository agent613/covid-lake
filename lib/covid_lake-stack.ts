import * as cdk from '@aws-cdk/core';
import * as glue from '@aws-cdk/aws-glue'; 
import * as iam from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';

export class CovidLakeStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

     // #region Database
    const dbName = 'covid-19';
    const db = new glue.Database(this, dbName, {
      databaseName: dbName
    });
    // #endregion

    // #region IAM Role 
    const role = new iam.Role(this, 'glueRole', {
      assumedBy: new iam.ServicePrincipal('glue.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromManagedPolicyArn(this, 'glueServiceRole', 'arn:aws:iam::aws:policy/service-role/AWSGlueServiceRole'),
        iam.ManagedPolicy.fromManagedPolicyArn(this, 's3access', 'arn:aws:iam::aws:policy/AmazonS3FullAccess')
      ]
    });
    // #endregion


    // #region JHU 
    const jhu_cons_table = new glue.CfnTable(this, 'jhu_consolidated', {
      databaseName: db.databaseName,
      catalogId: this.account,
      tableInput: {
        description: "Johns Hopkins University Consolidated data on COVID-19 cases, sourced from Enigma",
        name: "enigma_jhu",
        parameters: {
          has_encrypted_data: false,
          classification: "csv", 
          areColumnsQuoted: "false", 
          typeOfData: "file", 
          columnsOrdered: "true", 
          delimiter: ",", 
          "skip.header.line.count": "1"
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
              type: "string", 
              comment: "location (latitude)"
            }, 
            {
              name: "longitude",
              type: "string", 
              comment: "location (longitude)"
            }, 
            {
              name: "confirmed",
              type: "string", 
              comment: "number of confirmed cases"
            }, 
            {
              name: "deaths",
              type: "string", 
              comment: "number of deaths"
            }, 
            {
              name: "recovered",
              type: "string", 
              comment: "number of recovered patients"
            }, 
            {
              name: "active",
              type: "string", 
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
          location: "s3://covid19-lake/enigma-jhu/",
          outputFormat: "org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat",
          serdeInfo: {
            serializationLibrary: "org.apache.hadoop.hive.serde2.OpenCSVSerde", 
            parameters: {
              separatorChar: ",",
              quoteChar: '"',
              escapeChar: "\\"
            }
          },
          storedAsSubDirectories: false
        },
        tableType: "EXTERNAL_TABLE"
      }
    });

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
    // #region

    // #region allen
    const allen_metadata_table = new glue.CfnTable(this, 'alleninstitute_metadata', {
      databaseName: db.databaseName,
      catalogId: this.account,
      tableInput: {
        description: "Metadata on papers pulled from the Allen Institute.  The 'sha' column indicates the paper id",
        name: "alleninstitute_metadata",
        parameters: {
          has_encrypted_data: false,
          classification: "csv", 
          areColumnsQuoted: "false", 
          typeOfData: "file", 
          columnsOrdered: "true", 
          delimiter: ",", 
          "skip.header.line.count": "1"
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
          location: "s3://covid19-lake/alleninstitute/CORD19/raw/metadata",
          outputFormat: "org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat",
          serdeInfo: {
            serializationLibrary: "org.apache.hadoop.hive.serde2.OpenCSVSerde", 
            parameters: {
              separatorChar: ",",
              quoteChar: '"',
              escapeChar: "\\"
            }
          },
          storedAsSubDirectories: false
        },
        tableType: "EXTERNAL_TABLE"
      }
    });

    const allen_comprehend_table = new glue.CfnTable(this, 'alleninstitute_comprehend_medical', {
      databaseName: db.databaseName,
      catalogId: this.account,
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

    new glue.CfnCrawler(this, 'allen-metadata-crawler', {
      name: 'covid-alleninstitute-metadata-crawler',
      databaseName: dbName,
      role: role.roleArn,
      targets: {
        catalogTargets: [{databaseName: db.databaseName, tables: ['alleninstitute_metadata']}]
      },
      schedule: {scheduleExpression: 'cron(5 * * * ? *)'},
      schemaChangePolicy: {deleteBehavior: "LOG"},
      configuration: "{\"Version\":1.0,\"CrawlerOutput\":{\"Tables\":{\"AddOrUpdateBehavior\":\"MergeNewColumns\"}},\"Grouping\":{\"TableGroupingPolicy\":\"CombineCompatibleSchemas\"}}"
    }).addDependsOn(allen_metadata_table);
    new glue.CfnCrawler(this, 'allen-comprehend-crawler', {
      name: 'covid-alleninstitute-comprehend-crawler',
      databaseName: dbName,
      role: role.roleArn,
      targets: {
        catalogTargets: [{databaseName: db.databaseName, tables: ['alleninstitute_comprehend_medical']}]
      },
      schedule: {scheduleExpression: 'cron(5 * * * ? *)'},
      schemaChangePolicy: {deleteBehavior: "LOG"},
      configuration: "{\"Version\":1.0,\"CrawlerOutput\":{\"Tables\":{\"AddOrUpdateBehavior\":\"MergeNewColumns\"}},\"Grouping\":{\"TableGroupingPolicy\":\"CombineCompatibleSchemas\"}}"
    }).addDependsOn(allen_comprehend_table);
    // #region

    // #region covid_testing
    const covid_testing_us_daily_table = new glue.CfnTable(this, 'covid_testing_us_daily', {
      databaseName: db.databaseName,
      catalogId: this.account,
      tableInput: {
        name: "covid_testing_us_daily",
        description: "USA total test daily trend.  Sourced from covidtracking.com via REARC",
        parameters: {
          has_encrypted_data: false,
          classification: "csv", 
          areColumnsQuoted: "false", 
          typeOfData: "file", 
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
          location: "s3://covid19-lake/rearc-covid-19-testing-data/us_daily",
          outputFormat: "org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat",
          serdeInfo: {
            serializationLibrary: "org.apache.hadoop.hive.serde2.lazy.LazySimpleSerDe", 
            parameters: {
                  "field.delim": ","
              }
          },
          storedAsSubDirectories: false
        },
        tableType: "EXTERNAL_TABLE"
      }
    });

    const covid_testing_states_daily_table = new glue.CfnTable(this, 'covid_testing_states_daily', {
      databaseName: db.databaseName,
      catalogId: this.account,
      tableInput: {
        name: "covid_testing_states_daily",
        description: "USA total test daily trend by state.  Sourced from covidtracking.com via REARC",
        parameters: {
          has_encrypted_data: false,
          classification: "csv", 
          areColumnsQuoted: "false", 
          typeOfData: "file", 
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
          location: "s3://covid19-lake/rearc-covid-19-testing-data/states_daily",
          outputFormat: "org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat",
          serdeInfo: {
            serializationLibrary: "org.apache.hadoop.hive.serde2.lazy.LazySimpleSerDe", 
            parameters: {
                  "field.delim": ","
              }
          },
          storedAsSubDirectories: false
        },
        tableType: "EXTERNAL_TABLE"
      }
    });

    const covid_testing_us_total_table = new glue.CfnTable(this, 'covid_testing_us_total', {
      databaseName: db.databaseName,
      catalogId: this.account,
      tableInput: {
        name: "covid_testing_us_total",
        description: "USA total tests.  Sourced from covidtracking.com via REARC",
        parameters: {
          has_encrypted_data: false,
          classification: "csv", 
          areColumnsQuoted: "false", 
          typeOfData: "file", 
          columnsOrdered: "true", 
          delimiter: ",", 
          "skip.header.line.count": "1"
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
            name: "notes",
            type: "string",
            comment: ""
          },
          {
            name: "totalTestResults",
            type: "double",
            comment: "total test results"
          }
          ],
          compressed: false,
          inputFormat: "org.apache.hadoop.mapred.TextInputFormat",
          location: "s3://covid19-lake/rearc-covid-19-testing-data/us-total-latest",
          outputFormat: "org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat",
          serdeInfo: {
            serializationLibrary: "org.apache.hadoop.hive.serde2.lazy.LazySimpleSerDe", 
            parameters: {
                  "field.delim": ","
              }
          },
          storedAsSubDirectories: false
        },
        tableType: "EXTERNAL_TABLE"
      }
    });

    new glue.CfnCrawler(this, 'covid_testing_us_daily-crawler', {
      name: 'covid_testing_us_daily_crawler',
      databaseName: dbName,
      role: role.roleArn,
      targets: {
        catalogTargets: [{databaseName: db.databaseName, tables: ['covid_testing_us_daily']}]
      },
      schedule: {scheduleExpression: 'cron(5 * * * ? *)'},
      schemaChangePolicy: {deleteBehavior: "LOG"},
      configuration: "{\"Version\":1.0,\"CrawlerOutput\":{\"Tables\":{\"AddOrUpdateBehavior\":\"MergeNewColumns\"}},\"Grouping\":{\"TableGroupingPolicy\":\"CombineCompatibleSchemas\"}}"
    }).addDependsOn(covid_testing_us_daily_table);
    new glue.CfnCrawler(this, 'covid_testing_states_daily-crawler', {
      name: 'covid_testing_states_daily_crawler',
      databaseName: dbName,
      role: role.roleArn,
      targets: {
        catalogTargets: [{databaseName: db.databaseName, tables: ['covid_testing_states_daily']}]
      },
      schedule: {scheduleExpression: 'cron(5 * * * ? *)'},
      schemaChangePolicy: {deleteBehavior: "LOG"},
      configuration: "{\"Version\":1.0,\"CrawlerOutput\":{\"Tables\":{\"AddOrUpdateBehavior\":\"MergeNewColumns\"}},\"Grouping\":{\"TableGroupingPolicy\":\"CombineCompatibleSchemas\"}}"
    }).addDependsOn(covid_testing_states_daily_table);
    new glue.CfnCrawler(this, 'covid_testing_us_total-crawler', {
      name: 'covid_testing_us_total_crawler',
      databaseName: dbName,
      role: role.roleArn,
      targets: {
        catalogTargets: [{databaseName: db.databaseName, tables: ['covid_testing_us_total']}]
      },
      schedule: {scheduleExpression: 'cron(5 * * * ? *)'},
      schemaChangePolicy: {deleteBehavior: "LOG"},
      configuration: "{\"Version\":1.0,\"CrawlerOutput\":{\"Tables\":{\"AddOrUpdateBehavior\":\"MergeNewColumns\"}},\"Grouping\":{\"TableGroupingPolicy\":\"CombineCompatibleSchemas\"}}"
    }).addDependsOn(covid_testing_us_total_table);
    // #region

    // #region static data sets
    const state_abbrevs_table = new glue.CfnTable(this, 'state_abbrevs_table', {
      databaseName: db.databaseName,
      catalogId: this.account,
      tableInput: {
        name: "us_state_abbreviations",
        description: "Lookup table for US state abbreviations",
        parameters: {
          has_encrypted_data: false,
          classification: "csv", 
          areColumnsQuoted: "false", 
          typeOfData: "file", 
          columnsOrdered: "true", 
          delimiter: ",", 
          "skip.header.line.count": "1"
        },
        storageDescriptor: {
          columns: [ 
          {
            name: "state",
            type: "string",
            comment: "State name"
          },
          {
            name: "abbreviation",
            type: "string",
            comment: "abbreviation"
          }
          ],
          compressed: false,
          inputFormat: "org.apache.hadoop.mapred.TextInputFormat",
          location: "s3://covid19-lake/static-datasets/state-abv",
          outputFormat: "org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat",
          serdeInfo: {
            serializationLibrary: "org.apache.hadoop.hive.serde2.lazy.LazySimpleSerDe", 
            parameters: {
                  "field.delim": ","
              }
          },
          storedAsSubDirectories: false
        },
        tableType: "EXTERNAL_TABLE"
      }
    });

    const county_pop_table = new glue.CfnTable(this, 'county_pop_table', {
      databaseName: db.databaseName,
      catalogId: this.account,
      tableInput: {
        name: "county_populations",
        description: "Lookup table for population for each county based on recent census data",
        parameters: {
          has_encrypted_data: false,
          classification: "csv", 
          areColumnsQuoted: "false", 
          typeOfData: "file", 
          columnsOrdered: "true", 
          delimiter: ",", 
          "skip.header.line.count": "1"
        },
        storageDescriptor: {
          columns: [  
          {
            name: "Id",
            type: "string",
            comment: "geo id"
          },
          {
            name: "Id2",
            type: "string",
            comment: "geo id2"
          },
          {
            name: "county",
            type: "string",
            comment: "county name"
          },
          {
            name: "state",
            type: "string",
            comment: "state name"
          },
          {
            name: "Population Estimate 2018",
            type: "string",
            comment: ""
          }
          ],
          compressed: false,
          inputFormat: "org.apache.hadoop.mapred.TextInputFormat",
          location: "s3://covid19-lake/static-datasets/CountyPopulation",
          outputFormat: "org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat",
          serdeInfo: {
            serializationLibrary: "org.apache.hadoop.hive.serde2.lazy.LazySimpleSerDe", 
            parameters: {
                  "field.delim": ","
              }
          },
          storedAsSubDirectories: false
        },
        tableType: "EXTERNAL_TABLE"
      }
    });

    const country_code_table = new glue.CfnTable(this, 'country_code_table', {
      databaseName: db.databaseName,
      catalogId: this.account,
      tableInput: {
        name: "country_codes",
        description: "Lookup table for country codes",
        parameters: {
          has_encrypted_data: false,
          classification: "csv", 
          areColumnsQuoted: "false", 
          typeOfData: "file", 
          columnsOrdered: "true", 
          delimiter: ",", 
          "skip.header.line.count": "1"
        },
        storageDescriptor: {
          columns: [
          {
            name: "Country",
            type: "string",
            comment: "geo id"
          },
          {
            name: "Alpha-2 code",
            type: "string",
            comment: "geo id2"
          },
          {
            name: "Alpha-3 code",
            type: "string",
            comment: "state name"
          },
          {
            name: "Numeric code",
            type: "bigint",
            comment: ""
          },
          {
            name: "Latitude",
            type: "bigint",
            comment: "location (latitude)"
          },
          {
            name: "Longitude",
            type: "bigint",
            comment: "location (longitude)"
          }
          ],
          compressed: false,
          inputFormat: "org.apache.hadoop.mapred.TextInputFormat",
          location: "s3://covid19-lake/static-datasets/countrycode",
          outputFormat: "org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat",
          serdeInfo: {
            serializationLibrary: "org.apache.hadoop.hive.serde2.lazy.LazySimpleSerDe", 
            parameters: {
                  "field.delim": ","
              }
          },
          storedAsSubDirectories: false
        },
        tableType: "EXTERNAL_TABLE"
      }
    });
    // #region
  }
}
