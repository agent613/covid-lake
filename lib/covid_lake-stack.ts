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
    /*const role = new iam.Role(this, 'glueRole', {
      assumedBy: new iam.ServicePrincipal('glue.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromManagedPolicyArn(this, 'glueServiceRole', 'arn:aws:iam::aws:policy/service-role/AWSGlueServiceRole'),
        iam.ManagedPolicy.fromManagedPolicyArn(this, 's3access', 'arn:aws:iam::aws:policy/AmazonS3FullAccess')
      ]
    });*/
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

    const jhu_timeseries_table = new glue.CfnTable(this, 'jhu_timeseries', {
      databaseName: db.databaseName,
      catalogId: this.account,
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

    const tableau_jhu_table = new glue.CfnTable(this, 'tableau_jhu', {
      databaseName: db.databaseName,
      catalogId: this.account,
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

    /*
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
    */
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

    const covid_testing_states_daily_table = new glue.CfnTable(this, 'covid_testing_states_daily', {
      databaseName: db.databaseName,
      catalogId: this.account,
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

    const covid_testing_us_total_table = new glue.CfnTable(this, 'covid_testing_us_total', {
      databaseName: db.databaseName,
      catalogId: this.account,
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
    */
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
          location: "s3://covid19-lake/static-datasets/csv/state-abv",
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
          location: "s3://covid19-lake/static-datasets/csv/CountyPopulation",
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
          location: "s3://covid19-lake/static-datasets/csv/countrycode",
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

    // #region NY Times
    const nyt_counties_table = new glue.CfnTable(this, 'nytimes_counties_table', {
      databaseName: db.databaseName,
      catalogId: this.account,
      tableInput: {
        name: "nytimes_counties",
        description: "Data on COVID-19 cases from NY Times at US county level",
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
            name: "county",
            type: "string",
            comment: ""
          },
          {
            name: "state",
            type: "string",
            comment: ""
          },
          {
            name: "fips",
            type: "string",
            comment: "FIPS code"
          },
          {
            name: "cases",
            type: "bigint",
            comment: "# confirmed cases"
          },
          {
            name: "deaths",
            type: "bigint",
            comment: "# deaths"
          }
          ],
          compressed: false,
          inputFormat: "org.apache.hadoop.mapred.TextInputFormat",
          location: "s3://covid19-lake/rearc-covid-19-nyt-data-in-usa/json/us-counties",
          outputFormat: "org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat",
          serdeInfo: {
            serializationLibrary: "org.openx.data.jsonserde.JsonSerDe", 
            parameters: {
              paths: "date,county,state,fips,cases,deaths"
              }
          },
          storedAsSubDirectories: false
        },
        tableType: "EXTERNAL_TABLE"
      }
    });

    const nyt_states_table = new glue.CfnTable(this, 'nytimes_states_table', {
      databaseName: db.databaseName,
      catalogId: this.account,
      tableInput: {
        name: "nytimes_states",
        description: "Data on COVID-19 cases from NY Times at US state level",
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
            name: "state",
            type: "string",
            comment: ""
          },
          {
            name: "fips",
            type: "string",
            comment: "FIPS code"
          },
          {
            name: "cases",
            type: "bigint",
            comment: "# confirmed cases"
          },
          {
            name: "deaths",
            type: "bigint",
            comment: "# deaths"
          }
          ],
          compressed: false,
          inputFormat: "org.apache.hadoop.mapred.TextInputFormat",
          location: "s3://covid19-lake/rearc-covid-19-nyt-data-in-usa/json/us-states",
          outputFormat: "org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat",
          serdeInfo: {
            serializationLibrary: "org.openx.data.jsonserde.JsonSerDe", 
            parameters: {
              paths: "date,state,fips,cases,deaths"
              }
          },
          storedAsSubDirectories: false
        },
        tableType: "EXTERNAL_TABLE"
      }
    });
    // #region

    // #region hospital beds
    const rearc_beds_table = new glue.CfnTable(this, 'hospital_beds_table', {
      databaseName: db.databaseName,
      catalogId: this.account,
      tableInput: {
        name: "hospital_beds",
        description: "Data on hospital beds and their utilization in the US.  Sourced from Definitive Healthcare via rearc",
        parameters: {
          has_encrypted_data: false,
          classification: "json", 
          typeOfData: "file"
        },
        storageDescriptor: {
          columns: [
            {
              type: "int", 
              name: "objectid",
              comment: "unique id for the record"
          }, 
          {
              type: "string", 
              name: "hospital_name"
          }, 
          {
              type: "string", 
              name: "hospital_type",
              comment: "Short Term Acute Care Hospital (STAC), Critical Access Hospital (CAH), Long Term Acute Care Hospitals, Children’s Hospitals, Veteran's Affairs (VA) Hospital or Department of Defense (DoD) Hospital"
          }, 
          {
              type: "string", 
              name: "hq_address"
          }, 
          {
              type: "string", 
              name: "hq_address1"
          }, 
          {
              type: "string", 
              name: "hq_city"
          }, 
          {
              type: "string", 
              name: "hq_state"
          }, 
          {
              type: "string", 
              name: "hq_zip_code"
          }, 
          {
              type: "string", 
              name: "county_name"
          }, 
          {
              type: "string", 
              name: "state_name"
          }, 
          {
              type: "string", 
              name: "state_fips"
          }, 
          {
              type: "string", 
              name: "cnty_fips"
          }, 
          {
              type: "string", 
              name: "fips"
          }, 
          {
              type: "int", 
              name: "num_licensed_beds",
              comment: "maximum number of beds for which a hospital holds a license to operate"
          }, 
          {
              type: "int", 
              name: "num_staffed_beds",
              comment: "adult bed, pediatric bed, birthing room, or newborn ICU bed (excluding newborn bassinets) maintained in a patient care area for lodging patients in acute, long term, or domiciliary areas of the hospital."
          }, 
          {
              type: "int", 
              name: "num_icu_beds",
              comment: "ICU beds, burn ICU beds, surgical ICU beds, premature ICU beds, neonatal ICU beds, pediatric ICU beds, psychiatric ICU beds, trauma ICU beds, and Detox ICU beds"
          }, 
          {
              type: "double", 
              name: "bed_utilization",
              comment: "calculated based on metrics from the Medicare Cost Report: Bed Utilization Rate = Total Patient Days (excluding nursery days)/Bed Days Available"
          }, 
          {
              type: "int", 
              name: "potential_increase_in_bed_capac",
              comment: "computed by subtracting “Number of Staffed Beds from Number of Licensed beds” (Licensed Beds – Staffed Beds). This would provide insights into scenario planning for when staff can be shifted around to increase available bed capacity as needed."
          }, 
          {
              type: "double", 
              name: "latitude",
              comment: "hospital location (latitude)"
          }, 
          {
              type: "double", 
              name: "longtitude",
              comment: "hospital location (longitude)"
          }
          ],
          compressed: false,
          inputFormat: "org.apache.hadoop.mapred.TextInputFormat",
          location: "s3://covid19-lake/rearc-usa-hospital-beds",
          outputFormat: "org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat",
          serdeInfo: {
            serializationLibrary: "org.openx.data.jsonserde.JsonSerDe", 
            parameters: {
              paths: "BED_UTILIZATION,CNTY_FIPS,COUNTY_NAME,FIPS,HOSPITAL_NAME,HOSPITAL_TYPE,HQ_ADDRESS,HQ_ADDRESS1,HQ_CITY,HQ_STATE,HQ_ZIP_CODE,NUM_ICU_BEDS,NUM_LICENSED_BEDS,NUM_STAFFED_BEDS,OBJECTID,Potential_Increase_In_Bed_Capac,STATE_FIPS,STATE_NAME,latitude,longtitude"
              }
          },
          storedAsSubDirectories: false
        },
        tableType: "EXTERNAL_TABLE"
      }
    });
    // #region

    // #region covidcast
    const covidcast_data_table = new glue.CfnTable(this, 'covidcast_data_table', {
      databaseName: db.databaseName,
      catalogId: this.account,
      tableInput: {
        name: "covidcast_data",
        description: "CMU Delphi's COVID-19 Surveillance Data",
        parameters: {
          has_encrypted_data: false,
          classification: "json", 
          typeOfData: "file", 
        },
        storageDescriptor: {
          columns: [
            {
                type: "string", 
                name: "data_source",
                comment: "name of upstream data source (e.g., fb-survey, google-survey, ght, quidel, doctor-visits)"
            }, 
            {
                type: "string", 
                name: "signal",
                comment: "name of signal derived from upstream data"
            }, 
            {
                type: "string", 
                name: "geo_type",
                comment: "spatial resolution of the signal (e.g., county, hrr, msa, dma, state)"
            }, 
            {
                type: "int", 
                name: "time_value",
                comment: "time unit (e.g., date) over which underlying events happened"
            }, 
            {
                type: "string", 
                name: "geo_value",
                comment: "unique code for each location, depending on geo_type (county -> FIPS 6-4 code, HRR -> HRR number, MSA -> CBSA code, DMA -> DMA code, state -> two-letter state code), or * for all"
            }, 
            {
                type: "int", 
                name: "direction",
                comment: "trend classifier (+1 -> increasing, 0 steady or not determined, -1 -> decreasing)"
            }, 
            {
                type: "double", 
                name: "value",
                comment: "value (statistic) derived from the underlying data source"
            }, 
            {
                type: "double", 
                name: "stderr",
                comment: "standard error of the statistic with respect to its sampling distribution"
            }, 
            {
                type: "double", 
                name: "sample_size",
                comment: "number of data points used in computing the statistic"
            }
          ],
          compressed: false,
          inputFormat: "org.apache.hadoop.mapred.TextInputFormat",
          location: "s3://covid19-lake/covidcast/json/data/",
          outputFormat: "org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat",
          serdeInfo: {
            serializationLibrary: "org.openx.data.jsonserde.JsonSerDe", 
            parameters: {
              paths: "data_source,direction,geo_type,geo_value,sample_size,signal,stderr,time_value,value"
              }
          },
          storedAsSubDirectories: false
        },
        tableType: "EXTERNAL_TABLE"
      }
    });

    const covidcast_meta_table = new glue.CfnTable(this, 'covidcast_meta_table', {
      databaseName: db.databaseName,
      catalogId: this.account,
      tableInput: {
        name: "covidcast_metadata",
        description: "CMU Delphi's COVID-19 Surveillance Metadata",
        parameters: {
          has_encrypted_data: false,
          classification: "json", 
          typeOfData: "file", 
        },
        storageDescriptor: {
          columns: [
            {
              type: "string", 
              name: "data_source",
              comment: "name of upstream data source (e.g., fb-survey, google-survey, ght, quidel, doctor-visits)"
            }, 
            {
                type: "string", 
                name: "signal",
                comment: "name of signal derived from upstream data"
            }, 
            {
                type: "string", 
                name: "time_type",
                comment: "temporal resolution of the signal (e.g., day, week)"
            }, 
            {
                type: "string", 
                name: "geo_type",
                comment: "geographic resolution (e.g. county, hrr, msa, dma, state)"
            }, 
            {
                type: "int", 
                name: "min_time",
                comment: "minimum time (e.g., 20200406)"
            }, 
            {
                type: "int", 
                name: "max_time",
                comment: "maximum time (e.g., 20200413)"
            }, 
            {
                type: "int", 
                name: "num_locations"
            }, 
            {
                type: "double", 
                name: "min_value"
            }, 
            {
                type: "double", 
                name: "max_value"
            }, 
            {
                type: "double", 
                name: "mean_value"
            }, 
            {
                type: "double", 
                name: "stdev_value"
            }
          ],
          compressed: false,
          inputFormat: "org.apache.hadoop.mapred.TextInputFormat",
          location: "s3://covid19-lake/covidcast/json/metadata/",
          outputFormat: "org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat",
          serdeInfo: {
            serializationLibrary: "org.openx.data.jsonserde.JsonSerDe", 
            parameters: {
              paths: "data_source,geo_type,max_time,max_value,mean_value,min_time,min_value,num_locations,signal,stdev_value,time_type"
              }
          },
          storedAsSubDirectories: false
        },
        tableType: "EXTERNAL_TABLE"
      }
    });
    // #region

     // #region neptune knowledge graph
     const covid_knowledge_graph_edges_table = new glue.CfnTable(this, 'covid_knowledge_graph_edges_table', {
      databaseName: db.databaseName,
      catalogId: this.account,
      tableInput: {
        name: "covid_knowledge_graph_edges",
        description: "AWS Knowledge Graph for COVID-19 data",
        parameters: {
          has_encrypted_data: false,
          classification: "json", 
          typeOfData: "file", 
        },
        storageDescriptor: {
          columns: [
            {
              type: "string", 
              name: "id"
          }, 
          {
              type: "string", 
              name: "label"
          }, 
          {
              type: "string", 
              name: "from"
          }, 
          {
              type: "string", 
              name: "to"
          }, 
          {
              type: "double", 
              name: "score"
          }
          ],
          compressed: false,
          inputFormat: "org.apache.hadoop.mapred.TextInputFormat",
          location: "s3://covid19-lake/covid_knowledge_graph/json/edges/",
          outputFormat: "org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat",
          serdeInfo: {
            serializationLibrary: "org.openx.data.jsonserde.JsonSerDe", 
            parameters: {
              paths: "from,id,label,score,to"
              }
          },
          storedAsSubDirectories: false
        },
        tableType: "EXTERNAL_TABLE"
      }
    });
    const covid_knowledge_graph_nodes_concept_table = new glue.CfnTable(this, 'covid_knowledge_graph_nodes_concept_table', {
      databaseName: db.databaseName,
      catalogId: this.account,
      tableInput: {
        name: "covid_knowledge_graph_nodes_concept",
        description: "AWS Knowledge Graph for COVID-19 data",
        parameters: {
          has_encrypted_data: false,
          classification: "json", 
          typeOfData: "file", 
        },
        storageDescriptor: {
          columns: [
            {
              type: "string", 
              name: "id"
          }, 
          {
              type: "string", 
              name: "label"
          }, 
          {
              type: "string", 
              name: "entity"
          }, 
          {
              type: "string", 
              name: "concept"
          }
          ],
          compressed: false,
          inputFormat: "org.apache.hadoop.mapred.TextInputFormat",
          location: "s3://covid19-lake/covid_knowledge_graph/json/nodes/concept_nodes/",
          outputFormat: "org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat",
          serdeInfo: {
            serializationLibrary: "org.openx.data.jsonserde.JsonSerDe", 
            parameters: {
              paths: "concept,entity,id,label"
              }
          },
          storedAsSubDirectories: false
        },
        tableType: "EXTERNAL_TABLE"
      }
    });
    const covid_knowledge_graph_nodes_institution_table = new glue.CfnTable(this, 'covid_knowledge_graph_nodes_institution_table', {
      databaseName: db.databaseName,
      catalogId: this.account,
      tableInput: {
        name: "covid_knowledge_graph_nodes_institution",
        description: "AWS Knowledge Graph for COVID-19 data",
        parameters: {
          has_encrypted_data: false,
          classification: "json", 
          typeOfData: "file", 
        },
        storageDescriptor: {
          columns: [
            {
              type: "string", 
              name: "id"
          }, 
          {
              type: "string", 
              name: "label"
          }, 
          {
              type: "string", 
              name: "institution"
          }, 
          {
              type: "string", 
              name: "country"
          },
          {
              type: "string", 
              name: "settlement"
          }
          ],
          compressed: false,
          inputFormat: "org.apache.hadoop.mapred.TextInputFormat",
          location: "s3://covid19-lake/covid_knowledge_graph/json/nodes/institution_nodes/",
          outputFormat: "org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat",
          serdeInfo: {
            serializationLibrary: "org.openx.data.jsonserde.JsonSerDe", 
            parameters: {
              paths: "country,id,institution,label,settlement"
              }
          },
          storedAsSubDirectories: false
        },
        tableType: "EXTERNAL_TABLE"
      }
    });
    const covid_knowledge_graph_nodes_paper_author_table = new glue.CfnTable(this, 'covid_knowledge_graph_nodes_paper_author_table', {
      databaseName: db.databaseName,
      catalogId: this.account,
      tableInput: {
        name: "covid_knowledge_graph_nodes_author",
        description: "AWS Knowledge Graph for COVID-19 data",
        parameters: {
          has_encrypted_data: false,
          classification: "json", 
          typeOfData: "file", 
        },
        storageDescriptor: {
          columns: [
            {
              type: "string", 
              name: "id"
          }, 
          {
              type: "string", 
              name: "label"
          }, 
          {
              type: "string", 
              name: "first"
          }, 
          {
              type: "string", 
              name: "last"
          },
          {
              type: "string", 
              name: "full_name"
          }
          ],
          compressed: false,
          inputFormat: "org.apache.hadoop.mapred.TextInputFormat",
          location: "s3://covid19-lake/covid_knowledge_graph/json/nodes/paper_author_nodes/",
          outputFormat: "org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat",
          serdeInfo: {
            serializationLibrary: "org.openx.data.jsonserde.JsonSerDe", 
            parameters: {
              paths: "first,full_name,id,label,last"
              }
          },
          storedAsSubDirectories: false
        },
        tableType: "EXTERNAL_TABLE"
      }
    });
    const covid_knowledge_graph_nodes_paper_table = new glue.CfnTable(this, 'covid_knowledge_graph_nodes_paper_table', {
      databaseName: db.databaseName,
      catalogId: this.account,
      tableInput: {
        name: "covid_knowledge_graph_nodes_paper",
        description: "AWS Knowledge Graph for COVID-19 data",
        parameters: {
          has_encrypted_data: false,
          classification: "json", 
          typeOfData: "file", 
        },
        storageDescriptor: {
          columns: [
            {
              type: "string", 
              name: "id"
          }, 
          {
              type: "string", 
              name: "label"
          }, 
          {
              name: "doi",
              type: "string"
            },
            {
              name: "sha_code",
              type: "string"
            },
            {
              name: "publish_time",
              type: "string"
            },
            {
              name: "source",
              type: "string"
            },
            {
              name: "title",
              type: "string"
            },
            {
              name: "year",
              type: "int"
            },
            {
              name: "pmcid",
              type: "string"
            },
            {
              name: "reference",
              type: "boolean"
            }
          ],
          compressed: false,
          inputFormat: "org.apache.hadoop.mapred.TextInputFormat",
          location: "s3://covid19-lake/covid_knowledge_graph/json/nodes/paper_nodes/",
          outputFormat: "org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat",
          serdeInfo: {
            serializationLibrary: "org.openx.data.jsonserde.JsonSerDe", 
            parameters: {
              paths: "DOI,PMCID,SHA_code,id,label,publish_time,reference,source,title,year"
              }
          },
          storedAsSubDirectories: false
        },
        tableType: "EXTERNAL_TABLE"
      }
    });
    const covid_knowledge_graph_nodes_topic_table = new glue.CfnTable(this, 'covid_knowledge_graph_nodes_topic_table', {
      databaseName: db.databaseName,
      catalogId: this.account,
      tableInput: {
        name: "covid_knowledge_graph_nodes_topic",
        description: "AWS Knowledge Graph for COVID-19 data",
        parameters: {
          has_encrypted_data: false,
          classification: "json", 
          typeOfData: "file", 
        },
        storageDescriptor: {
          columns: [
            {
              type: "string", 
              name: "id"
          }, 
          {
              type: "string", 
              name: "label"
          }, 
          {
              name: "topic",
              type: "string"
            },
            {
              name: "topic_num",
              type: "string"
            }
          ],
          compressed: false,
          inputFormat: "org.apache.hadoop.mapred.TextInputFormat",
          location: "s3://covid19-lake/covid_knowledge_graph/json/nodes/topic_nodes/",
          outputFormat: "org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat",
          serdeInfo: {
            serializationLibrary: "org.openx.data.jsonserde.JsonSerDe", 
            parameters: {
              paths: "id,label,topic,topic_num"
              }
          },
          storedAsSubDirectories: false
        },
        tableType: "EXTERNAL_TABLE"
      }
    });
    // #region
    
    // #region safegraph census
    /*
    const safegraph_census_cbg_geo_table = new glue.CfnTable(this, 'safegraph_census_cbg_geo_table', {
      databaseName: db.databaseName,
      catalogId: this.account,
      tableInput: {
        name: "safegraph_census_cbg_geographic",
        description: "Census data containing location and amount land/water for each Census Block Group.  Sourced from Safegraph. https://www.safegraph.com/blog/beginners-guide-to-census",
        parameters: {
          has_encrypted_data: false,
          classification: "json", 
          typeOfData: "file", 
        },
        storageDescriptor: {
          columns: [  
          {
              name: "census_block_group",
              type: "string", 
              comment: "Census Block Group id"
          }, 
          {
              name: "amount_land",
              type: "bigint", 
              comment: "amount of land"
          }, 
          {
              name: "amount_water",
              type: "bigint", 
              comment: "amount of water"
          }, 
          {
              name: "latitude",
              type: "double"
          }, 
          {
              name: "longtitude",
              type: "double"
          }
          ],
          compressed: false,
          inputFormat: "org.apache.hadoop.mapred.TextInputFormat",
          location: "s3://covid19-lake/safegraph-open-census-data/json/metadata/cbg_geographic_data/",
          outputFormat: "org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat",
          serdeInfo: {
            serializationLibrary: "org.openx.data.jsonserde.JsonSerDe", 
            parameters: {
              paths: "census_block_group,amount_land,amount_water,latitude,longtitude"
              }
          },
          storedAsSubDirectories: false
        },
        tableType: "EXTERNAL_TABLE"
      }
    });
    
    const safegraph_census_cbg_fips_table = new glue.CfnTable(this, 'safegraph_census_cbg_fips_table', {
      databaseName: db.databaseName,
      catalogId: this.account,
      tableInput: {
        name: "safegraph_census_cbg_fips_codes",
        description: "Census data containing fips codes for each location.  Sourced from Safegraph. https://www.safegraph.com/blog/beginners-guide-to-census",
        parameters: {
          has_encrypted_data: false,
          classification: "json", 
          typeOfData: "file", 
        },
        storageDescriptor: {
          columns: [  
          {
            name: "state",
            type: "string", 
            comment: "US State"
          }, 
          {
            name: "state_fips",
            type: "string", 
            comment: "US State fips code"
          }, 
          {
            name: "county_fips",
            type: "string", 
            comment: "US Country fips code"
          }, 
          {
            name: "county",
            type: "string", 
            comment: "US County fips code"
          }, 
          {
            name: "class_code",
            type: "string"
          }
          ],
          compressed: false,
          inputFormat: "org.apache.hadoop.mapred.TextInputFormat",
          location: "s3://covid19-lake/safegraph-open-census-data/json/metadata/cbg_fips_codes/",
          outputFormat: "org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat",
          serdeInfo: {
            serializationLibrary: "org.openx.data.jsonserde.JsonSerDe", 
            parameters: {
              paths: "state,state_fips,county_fips,county,class_code"
              }
          },
          storedAsSubDirectories: false
        },
        tableType: "EXTERNAL_TABLE"
      }
    });

    const safegraph_census_cbg_field_descriptions_table = new glue.CfnTable(this, 'safegraph_census_cbg_field_descriptions_table', {
      databaseName: db.databaseName,
      catalogId: this.account,
      tableInput: {
        name: "safegraph_census_cbg_field_descriptions",
        description: "Census data containing descriptions of the various fields used in the census data.  Sourced from Safegraph. https://www.safegraph.com/blog/beginners-guide-to-census",
        parameters: {
          has_encrypted_data: false,
          classification: "json", 
          typeOfData: "file", 
        },
        storageDescriptor: {
          columns: [  
          {
            name: "table_id",
            type: "string", 
            comment: "information about what type of data the field represents.  see link in the table description"
          }, 
          {
            name: "field_full_name",
            type: "string", 
            comment: "full name of the field"
          }, 
          {
            name: "field_level_1",
            type: "string"
          }, 
          {
            name: "field_level_2",
            type: "string"
          }, 
          {
            name: "field_level_3",
            type: "string"
          }, 
          {
            name: "field_level_4",
            type: "string"
          }, 
          {
            name: "field_level_5",
            type: "string"
          }, 
          {
            name: "field_level_6",
            type: "string"
          }, 
          {
            name: "field_level_7",
            type: "string"
          }, 
          {
            name: "field_level_8",
            type: "string"
          }
          ],
          compressed: false,
          inputFormat: "org.apache.hadoop.mapred.TextInputFormat",
          location: "s3://covid19-lake/safegraph-open-census-data/json/metadata/cbg_field_descriptions/",
          outputFormat: "org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat",
          serdeInfo: {
            serializationLibrary: "org.openx.data.jsonserde.JsonSerDe", 
            parameters: {
              paths: "table_id,field_full_name,field_level_1,field_level_2,field_level_3,field_level_4,field_level_5,field_level_6,field_level_7,field_level_8"
              }
          },
          storedAsSubDirectories: false
        },
        tableType: "EXTERNAL_TABLE"
      }
    });*/
    // #region
  }
}
