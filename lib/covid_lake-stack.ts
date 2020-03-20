import * as cdk from '@aws-cdk/core';
import * as glue from '@aws-cdk/aws-glue'; 
import * as iam from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';

export class CovidLakeStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const dbName = 'covid';
    const db = new glue.Database(this, dbName, {
      databaseName: dbName
    });

    const role = new iam.Role(this, 'glueRole', {
      assumedBy: new iam.ServicePrincipal('glue.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromManagedPolicyArn(this, 'glueServiceRole', 'arn:aws:iam::aws:policy/service-role/AWSGlueServiceRole'),
        iam.ManagedPolicy.fromManagedPolicyArn(this, 's3access', 'arn:aws:iam::aws:policy/AmazonS3FullAccess')
      ]
    });


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
                comment: "",
                name: "province/state",
                type: "string"
              },
              {
                name: "country/region",
                type: "string"
              },
              {
                comment: "location (latitude)",
                name: "lat",
                type: "double"
              },
              {
                comment: "location (longitude)",
                name: "long",
                type: "double"
              },
              {
                comment: "reporting date",
                name: "date",
                type: "string"
              },
              {
                comment: "number of cases",
                name: "value",
                type: "bigint"
              }
            ],
            compressed: false,
            inputFormat: "org.apache.hadoop.mapred.TextInputFormat",
            location: "s3://covid19-lake/jhu/jhu_time_series",
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
              name: "province/state",
              type: "string"
            },
            {
              name: "country/region",
              type: "string"
            },
            {
              type: "string", 
              name: "last update",
              comment: "reported date"
          }, 
          {
              type: "bigint", 
              name: "confirmed",
              comment: "nunmber of confirmed cases"
          }, 
          {
              type: "bigint", 
              name: "deaths",
              comment: "number of deaths"
          }, 
          {
              type: "bigint", 
              name: "recovered",
              comment: "number of recovered patients"
          }, 
          {
              type: "double",
              name: "latitude",
              comment: "location (latitude)"
          }, 
          {
              type: "double",
              name: "longitude",
              comment: "location (longitude)"
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

    
    new glue.CfnCrawler(this, 'crawler', {
      name: 'covid-crawler',
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

  }
}
