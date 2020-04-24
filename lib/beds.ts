import * as cdk from '@aws-cdk/core';
import * as glue from '@aws-cdk/aws-glue'; 

export function create(stack:cdk.Stack, dbName:string, account:string) {
    const rearc_beds_table = new glue.CfnTable(stack, 'hospital_beds_table', {
        databaseName: dbName,
        catalogId: account,
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
}