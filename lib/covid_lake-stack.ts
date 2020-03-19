import * as cdk from '@aws-cdk/core';
import * as glue from '@aws-cdk/aws-glue'; 
import * as iam from '@aws-cdk/aws-iam';

export class CovidLakeStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const dbName = 'covid';

    new glue.Database(this, dbName, {
      databaseName: dbName
    });

    const role = new iam.Role(this, 'glueRole', {
      assumedBy: new iam.ServicePrincipal('glue.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromManagedPolicyArn(this, 'glueServiceRole', 'arn:aws:iam::aws:policy/service-role/AWSGlueServiceRole'),
        iam.ManagedPolicy.fromManagedPolicyArn(this, 's3access', 'arn:aws:iam::aws:policy/AmazonS3FullAccess')
      ]
    });

    new glue.CfnCrawler(this, 'crawler', {
      name: 'covid-crawler',
      databaseName: dbName,
      role: role.roleArn,
      targets: {
        s3Targets: [{path:'s3://covid19-lake/jhu/jhu_time_series'}, {path:'s3://covid19-lake/jhu/jhu_consolidated'}]
      },
      schedule: {scheduleExpression: 'cron(5 * * * ? *)'}
    });


  }
}
