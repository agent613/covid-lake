import * as cdk from '@aws-cdk/core';
import * as glue from '@aws-cdk/aws-glue'; 
//import * as iam from '@aws-cdk/aws-iam';
//import * as s3 from '@aws-cdk/aws-s3';
import {create as jhu} from './jhu';
import {create as allen} from './allen';
import {create as covid_testing} from './covid_testing';
import {create as static_data} from './static'; 
import {create as nytimes} from './nytimes';
import {create as beds} from './beds';
import {create as covidcast} from './covidcast';
import {create as knowledge_graph} from './knowledge_graph';
import {create as prediction_models} from './prediction_models';
import {create as tableau} from './tableau';
import {create as rearc_world} from './rearc_world';
import {create as aspirevc} from './aspirevc'; 

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


    const dataSets = [jhu, allen, covid_testing, static_data, nytimes, beds, covidcast, knowledge_graph, prediction_models, tableau, rearc_world, aspirevc] ;
    
    dataSets.map(ds => ds(this, db.databaseName, this.account));

    

     
    
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
