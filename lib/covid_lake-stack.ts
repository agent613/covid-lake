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
        parameters: {
          has_encrypted_data: false,
          classification: "csv", 
          areColumnsQuoted: "false", 
          typeOfData: "file", 
          columnsOrdered: "true", 
          delimiter: "\t", 
          "skip.header.line.count": "1"
        },
        storageDescriptor: {
          columns: [
            {
              type: "string", 
              name: "Prefix",
              comment: "S3 prefix where the paper is located"
          }, 
          {
              type: "string", 
              name: "Key"
          }, 
          {
              type: "string", 
              name: "ValueList"
          }, 
          ],
          compressed: false,
          inputFormat: "org.apache.hadoop.mapred.TextInputFormat",
          location: "s3://covid19-lake/alleninstitute/CORD19/comprehendmedical/",
          outputFormat: "org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat",
          serdeInfo: {
            serializationLibrary: "org.apache.hadoop.hive.serde2.lazy.LazySimpleSerDe", 
            parameters: {
                  "field.delim": "\t"
              }
          },
          storedAsSubDirectories: false
        },
        tableType: "EXTERNAL_TABLE"
      }
    });
    // #region

    const covidtracking_states_table = new glue.CfnTable(this, 'covidtracking_states', {
      databaseName: db.databaseName,
      catalogId: this.account,
      tableInput: {
        name: "covidtracking_states",
        description: "Data on COVID-19 testing per state fron covidtracking.com",
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
              name: "state"
          }, 
          {
              type: "bigint", 
              name: "positive",
              comment: "positive results"
          }, 
          {
            type: "bigint", 
            name: "negative",
            comment: "negative results"
          }, 
          {
            type: "bigint", 
            name: "pending",
            comment: "pending results"
          },
          {
            type: "bigint", 
            name: "death",
            comment: "number of deaths"
          },
          {
            type: "bigint", 
            name: "total",
            comment: "total results"
          },
          {
            type: "string", 
            name: "lastUpdateEt"
          }, 
          {
            type: "string", 
            name: "checkTimeEt"
          }, 
          {
            type: "string", 
            name: "dateModified"
          }, 
          {
            type: "string", 
            name: "dateChecked"
          }, 

          ],
          compressed: false,
          inputFormat: "org.apache.hadoop.mapred.TextInputFormat",
          location: "s3://covid19-lake/covidtracking.com/states",
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

    const covidtracking_counties_table = new glue.CfnTable(this, 'covidtracking_counties', {
      databaseName: db.databaseName,
      catalogId: this.account,
      tableInput: {
        name: "covidtracking_counties",
        description: "Data on COVID-19 testing per county fron covidtracking.com",
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
              name: "state"
          }, 
          {
            type: "string", 
            name: "county"
          }, 
          {
            type: "string", 
            name: "covid19Site"
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
          ],
          compressed: false,
          inputFormat: "org.apache.hadoop.mapred.TextInputFormat",
          location: "s3://covid19-lake/covidtracking.com/counties",
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

    new glue.CfnCrawler(this, 'allen-metadata-crawler', {
      name: 'covid-alleninstitute-metadata-crawler',
      databaseName: dbName,
      role: role.roleArn,
      targets: {
        //s3Targets: [{path:'s3://covid19-lake/alleninstitute/CORD19/raw/metadata'}]
        catalogTargets: [{databaseName: db.databaseName, tables: ['alleninstitute_metadata']}]
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
