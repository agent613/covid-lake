import * as cdk from '@aws-cdk/core';
import * as glue from '@aws-cdk/aws-glue'; 

export function create(stack:cdk.Stack, dbName:string, account:string) {
    const covidcast_data_table = new glue.CfnTable(stack, 'covidcast_data_table', {
        databaseName: dbName,
        catalogId: account,
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

    const covidcast_meta_table = new glue.CfnTable(stack, 'covidcast_meta_table', {
        databaseName: dbName,
        catalogId: account,
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
}