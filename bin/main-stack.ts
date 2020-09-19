#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { CiCdStack } from '../lib/cicd-stack';

const app = new cdk.App();
new CiCdStack(app, 'CiCdStack');
