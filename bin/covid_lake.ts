#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CovidLakeStack } from '../lib/covid_lake-stack';

const app = new cdk.App();
new CovidLakeStack(app, 'CovidLakeStack');
