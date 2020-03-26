import * as cdk from '@aws-cdk/core';
import * as glue from '@aws-cdk/aws-glue'; 
import * as iam from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';

export class CovidLakeStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

     // #region Database
    const dbName = 'covid';
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
    const jhu_ts_table = new glue.CfnTable(this, 'jhu_time_series', {
      databaseName: db.databaseName,
      catalogId: this.account,
      tableInput: {
          description: "Johns Hopkins University Time Series data on COVID-19 cases",
          name: "jhu_time_series",
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
                name: "province/state",
                type: "string"
              },
              {
                name: "country/region",
                type: "string"
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
                name: "date",
                type: "string",
                comment: "reporting date"
              },
              {
                name: "value",
                type: "double",
                comment: "number of cases"
              }
            ],
            compressed: false,
            inputFormat: "org.apache.hadoop.mapred.TextInputFormat",
            location: "s3://covid19-lake/jhu/jhu_time_series/",
            outputFormat: "org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat",
            serdeInfo: {
              serializationLibrary: "org.apache.hadoop.hive.serde2.lazy.LazySimpleSerDe", 
              parameters: {
                    "field.delim": ","
                }
            },
            storedAsSubDirectories: false
          },
          partitionKeys: [
            {
                type: "string", 
                name: "status",
                comment: "status of the cases: confirmed, recovered or death"
            }
          ],
          tableType: "EXTERNAL_TABLE"
        }
    }); 

    //new CfnWaitCondition(this, 'wait_jhu_ts_table', {}).addDependsOn(jhu_ts_table);

    new glue.CfnPartition(this, 'jhu_time_series_recovered', {
      databaseName: db.databaseName,
      catalogId: this.account,
      tableName: "jhu_time_series",
      partitionInput: {
        storageDescriptor: {
          outputFormat: "org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat", 
          sortColumns: [], 
          inputFormat: "org.apache.hadoop.mapred.TextInputFormat", 
          serdeInfo: {
              serializationLibrary: "org.apache.hadoop.hive.serde2.lazy.LazySimpleSerDe", 
              parameters: {
                  "field.delim": ","
              }
          }, 
          bucketColumns: [], 
          parameters: {
              "compressionType": "none", 
              "classification": "csv", 
              "recordCount": "38129", 
              "typeOfData": "file", 
              "areColumnsQuoted": "false", 
              "columnsOrdered": "true", 
              "objectCount": "1", 
              "delimiter": ",", 
              "skip.header.line.count": "1", 
              "averageRecordSize": "36", 
              "sizeKey": "1372652"
          }, 
          location: "s3://covid19-lake/jhu/jhu_time_series/status=recovered/", 
          numberOfBuckets: -1, 
          storedAsSubDirectories: false, 
          columns: [
            {
              name: "province/state",
              type: "string"
            },
            {
              name: "country/region",
              type: "string"
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
              name: "date",
              type: "string",
              comment: "reporting date"
            },
            {
              name: "value",
              type: "double",
              comment: "number of cases"
            }
          ],
          compressed: false
      }, 
      parameters: {}, 
      values: ["recovered"]
    }
    }).addDependsOn(jhu_ts_table);
    new glue.CfnPartition(this, 'jhu_time_series_confirmed', {
      databaseName: db.databaseName,
      catalogId: this.account,
      tableName: "jhu_time_series",
      partitionInput: {
        storageDescriptor: {
          outputFormat: "org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat", 
          sortColumns: [], 
          inputFormat: "org.apache.hadoop.mapred.TextInputFormat", 
          serdeInfo: {
              serializationLibrary: "org.apache.hadoop.hive.serde2.lazy.LazySimpleSerDe", 
              parameters: {
                  "field.delim": ","
              }
          }, 
          bucketColumns: [], 
          parameters: {
              "compressionType": "none", 
              "classification": "csv", 
              "recordCount": "38129", 
              "typeOfData": "file", 
              "areColumnsQuoted": "false", 
              "columnsOrdered": "true", 
              "objectCount": "1", 
              "delimiter": ",", 
              "skip.header.line.count": "1", 
              "averageRecordSize": "36", 
              "sizeKey": "1372652"
          }, 
          location: "s3://covid19-lake/jhu/jhu_time_series/status=confirmed/", 
          numberOfBuckets: -1, 
          storedAsSubDirectories: false, 
          columns: [
            {
              name: "province/state",
              type: "string"
            },
            {
              name: "country/region",
              type: "string"
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
              name: "date",
              type: "string",
              comment: "reporting date"
            },
            {
              name: "value",
              type: "double",
              comment: "number of cases"
            }
          ],
          compressed: false
      }, 
      parameters: {}, 
      values: ["confirmed"]
    }
    }).addDependsOn(jhu_ts_table);
    new glue.CfnPartition(this, 'jhu_time_series_deaths', {
      databaseName: db.databaseName,
      catalogId: this.account,
      tableName: "jhu_time_series",
      partitionInput: {
        storageDescriptor: {
          outputFormat: "org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat", 
          sortColumns: [], 
          inputFormat: "org.apache.hadoop.mapred.TextInputFormat", 
          serdeInfo: {
              serializationLibrary: "org.apache.hadoop.hive.serde2.lazy.LazySimpleSerDe", 
              parameters: {
                  "field.delim": ","
              }
          }, 
          bucketColumns: [], 
          parameters: {
              "compressionType": "none", 
              "classification": "csv", 
              "recordCount": "38129", 
              "typeOfData": "file", 
              "areColumnsQuoted": "false", 
              "columnsOrdered": "true", 
              "objectCount": "1", 
              "delimiter": ",", 
              "skip.header.line.count": "1", 
              "averageRecordSize": "36", 
              "sizeKey": "1372652"
          }, 
          location: "s3://covid19-lake/jhu/jhu_time_series/status=death/", 
          numberOfBuckets: -1, 
          storedAsSubDirectories: false, 
          columns: [
            {
              name: "province/state",
              type: "string"
            },
            {
              name: "country/region",
              type: "string"
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
              name: "date",
              type: "string",
              comment: "reporting date"
            },
            {
              name: "value",
              type: "double",
              comment: "number of cases"
            }
          ],
          compressed: false
      }, 
      parameters: {}, 
      values: ["death"]
    }
    }).addDependsOn(jhu_ts_table);


    const jhu_cons_table = new glue.CfnTable(this, 'jhu_consolidated', {
      databaseName: db.databaseName,
      catalogId: this.account,
      tableInput: {
        description: "Johns Hopkins University Consolidated data on COVID-19 cases",
        name: "jhu_consolidated",
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
              type: "bigint", 
              name: "date",
              comment: "reported date"
            }, 
            {
              name: "state",
              type: "string"
            },
            {
              type: "bigint", 
              name: "positive",
              comment: "nunmber of confirmed cases"
            }, 
            {
              type: "bigint", 
              name: "negative",
              comment: "number of negative tests"
            }, 
            {
              type: "bigint", 
              name: "pending",
              comment: "number of pending results"
            }, 
            {
              type: "bigint", 
              name: "hospitalized",
              comment: "number of hospitalized patients"
            }, 
            {
              type: "bigint", 
              name: "death",
              comment: "number of deaths"
            }, 
            {
              type: "bigint", 
              name: "total",
              comment: "total tests"
            }, 
            {
              name: "dateChecked",
              type: "string",
              comment: "test date"
            }
            
          ],
          compressed: false,
          inputFormat: "org.apache.hadoop.mapred.TextInputFormat",
          location: "s3://covid19-lake/jhu/jhu_consolidated",
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
              name: "sha",
              comment: "the paper id.  this represents the file name of the json file on s3 where the details are stored"
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
              name: "doi"
          }, 
          {
              type: "string", 
              name: "pmcid"
          }, 
          {
              type: "bigint", 
              name: "pubmed_id"
          }, 
          {
              type: "string", 
              name: "license"
          }, 
          {
              type: "string", 
              name: "abstract",
              comment: "abstract of the paper"
          }, 
          {
              type: "bigint", 
              name: "publish_time",
              comment: "when the paper was published"
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
              type: "bigint", 
              name: "microsoft academic paper id"
          }, 
          {
              type: "string", 
              name: "who #covidence"
          }, 
          {
              type: "boolean", 
              name: "has_full_text", 
              comment: "whether the full text of the paper is available"
          },
          {
              name: "full_text_file",
              type: "string",
              comment: "location of the full text of the paper"
          }

          ],
          compressed: false,
          inputFormat: "org.apache.hadoop.mapred.TextInputFormat",
          location: "s3://covid19-lake/alleninstitute/CORD19/raw/metadata",
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
                  comment: ""
                },
                {
                  name: "date",
                  type: "array<string>",
                  comment: ""
                },
                {
                  name: "dx_name",
                  type: "array<string>",
                  comment: ""
                },
                {
                  name: "test_name",
                  type: "array<string>",
                  comment: ""
                },
                {
                  name: "procedure_name",
                  type: "array<string>",
                  comment: ""
                },
                {
                  name: "phone_or_fax",
                  type: "array<string>",
                  comment: ""
                },
                {
                  name: "time_to_test_name",
                  type: "array<string>",
                  comment: ""
                },
                {
                  name: "url",
                  type: "array<string>",
                  comment: ""
                },
                {
                  name: "generic_name",
                  type: "array<string>",
                  comment: ""
                },
                {
                  name: "name",
                  type: "array<string>",
                  comment: ""
                },
                {
                  name: "brand_name",
                  type: "array<string>",
                  comment: ""
                },
                {
                  name: "address",
                  type: "array<string>",
                  comment: ""
                },
                {
                  name: "id",
                  type: "array<string>",
                  comment: ""
                },
                {
                  name: "treatment_name",
                  type: "array<string>",
                  comment: ""
                },
                {
                  name: "system_organ_site",
                  type: "array<string>",
                  comment: ""
                },
                {
                  name: "time_to_treatment_name",
                  type: "array<string>",
                  comment: ""
                },
                {
                  name: "time_to_dx_name",
                  type: "array<string>",
                  comment: ""
                },
                {
                  name: "time_to_medication_name",
                  type: "array<string>",
                  comment: ""
                },
                {
                  name: "time_to_procedure_name",
                  type: "array<string>",
                  comment: ""
                },
                {
                  name: "profession",
                  type: "array<string>",
                  comment: ""
                },
                {
                  name: "email",
                  type: "array<string>",
                  comment: ""
                },
                {
                  name: "age",
                  type: "array<string>",
                  comment: ""
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
    });
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
    });
    // #region

    // #region covid_testing
    const covid_testing_counties_table = new glue.CfnTable(this, 'covid_testing_counties', {
      databaseName: db.databaseName,
      catalogId: this.account,
      tableInput: {
        name: "covid_testing_counties",
        description: "Testing data at country level",
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
              name: "state",
              comment: ""
          }, 
          {
              type: "string", 
              name: "county",
              comment: ""
          }, 
          {
              type: "string", 
              name: "covid19Site",
              comment: ""
          }, 
          {
              type: "string", 
              name: "dataSite"
          }, 
          {
              type: "string", 
              name: "mainSite"
          }, 
          {
              type: "string", 
              name: "twitter"
          }, 
          {
              type: "string", 
              name: "pui"
          }, 
          {
              type: "string", 
              name: "pum",
              comment: ""
          }, 
          ],
          compressed: false,
          inputFormat: "org.apache.hadoop.mapred.TextInputFormat",
          location: "s3://covid19-lake/covid-19-testing-data/dataset/counties.csv",
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
    
    /* 
    new glue.CfnCrawler(this, 'jhu-crawler', {
      name: 'covid-jhu-crawler',
      databaseName: dbName,
      role: role.roleArn,
      targets: {
        //s3Targets: [{path:'s3://covid19-lake/jhu/jhu_time_series'}, {path:'s3://covid19-lake/jhu/jhu_consolidated'}]
        catalogTargets: [{databaseName: db.databaseName, tables: ['jhu_time_series', "jhu_consolidated"]}]
      },
      schedule: {scheduleExpression: 'cron(5 * * * ? *)'},
      schemaChangePolicy: {deleteBehavior: "LOG"},
      configuration: "{\"Version\":1.0,\"CrawlerOutput\":{\"Tables\":{\"AddOrUpdateBehavior\":\"MergeNewColumns\"}},\"Grouping\":{\"TableGroupingPolicy\":\"CombineCompatibleSchemas\"}}"
    });



    
    new glue.CfnCrawler(this, 'covid-covidtracking-crawler', {
      name: 'covid-covidtracking-crawler',
      databaseName: dbName,
      role: role.roleArn,
      targets: {
        s3Targets: [{path:'s3://covid19-lake/covidtracking.com'}]
        //catalogTargets: [{databaseName: db.databaseName, tables: ['jhu_time_series', "jhu_consolidated"]}]
      },
      schedule: {scheduleExpression: 'cron(5 * * * ? *)'},
      schemaChangePolicy: {deleteBehavior: "LOG"},
      configuration: "{\"Version\":1.0,\"CrawlerOutput\":{\"Tables\":{\"AddOrUpdateBehavior\":\"MergeNewColumns\"}},\"Grouping\":{\"TableGroupingPolicy\":\"CombineCompatibleSchemas\"}}"
    });
    */
  }
}
