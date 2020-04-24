import * as cdk from '@aws-cdk/core';
import * as glue from '@aws-cdk/aws-glue'; 

export function create(stack:cdk.Stack, dbName:string, account:string) {
    const covid_knowledge_graph_edges_table = new glue.CfnTable(stack, 'covid_knowledge_graph_edges_table', {
        databaseName: dbName,
        catalogId: account,
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
    const covid_knowledge_graph_nodes_concept_table = new glue.CfnTable(stack, 'covid_knowledge_graph_nodes_concept_table', {
        databaseName: dbName,
        catalogId: account,
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
    const covid_knowledge_graph_nodes_institution_table = new glue.CfnTable(stack, 'covid_knowledge_graph_nodes_institution_table', {
        databaseName: dbName,
        catalogId: account,
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
    const covid_knowledge_graph_nodes_paper_author_table = new glue.CfnTable(stack, 'covid_knowledge_graph_nodes_paper_author_table', {
        databaseName: dbName,
        catalogId: account,
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
    const covid_knowledge_graph_nodes_paper_table = new glue.CfnTable(stack, 'covid_knowledge_graph_nodes_paper_table', {
        databaseName: dbName,
        catalogId: account,
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
    const covid_knowledge_graph_nodes_topic_table = new glue.CfnTable(stack, 'covid_knowledge_graph_nodes_topic_table', {
        databaseName: dbName,
        catalogId: account,
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
}