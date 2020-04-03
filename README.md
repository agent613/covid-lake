# Template for Generating a Data Lake for analysis of COVID-19 related data sets


## To generate your data lake:

As a prerequisite, you should have already installed and configured [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html), cloned this repository and have your shell at the root of the project.


 * `npm install -g aws-cdk` will install the AWS CDK
 * `npm install` will fetch all the required packages
 * `npm run all`   will compile and deploy your app to the default account and region specified in your AWS CLI profile

 You can check that is successful by visiting the [AWS Glue Console](https://console.aws.amazon.com/glue/home).  You should see a database called "covid-19" with some tables in it.  

You should now be able to see and query the resulting tables in [Amazon Athena](https://console.aws.amazon.com/athena/home).