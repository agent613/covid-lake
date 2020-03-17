import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import CovidLake = require('../lib/covid_lake-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new CovidLake.CovidLakeStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
