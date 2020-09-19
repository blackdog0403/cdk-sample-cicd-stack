import * as cdk from '@aws-cdk/core';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';
import * as ecr from '@aws-cdk/aws-ecr'

import { generateCodeBuildProject } from './buildspec'

export class CiCdStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const githubRepoOwner ='blackdog0403';
    const githubRepoBranch = 'master';
    const githubRepoUrl = 'https://github.com/blackdog0403/podinfo.git';

    const ecrRepository = new ecr.Repository(this, 'CdkEcr' ,{
      imageScanOnPush: false,
      repositoryName: 'cdk8s-demo-podinfo',
      removalPolicy: cdk.RemovalPolicy.DESTROY // test를 위해서 스택이 삭제되면 바로 삭제되도록 구성
    });

    const cdkBuildProject = generateCodeBuildProject(this, ecrRepository.repositoryUri);

    ecrRepository.grantPullPush(cdkBuildProject.role!);

    const sourceOutput = new codepipeline.Artifact();
    const cdkBuildOutput = new codepipeline.Artifact('CdkBuildOutput');

    new codepipeline.Pipeline(this, 'Pipeline', {
      
      stages: [
        {
          stageName: 'Source',
          actions: [
            new codepipeline_actions.GitHubSourceAction({
              actionName: 'Github_Source',
              repo: githubRepoUrl,
              output: sourceOutput,
              owner: githubRepoOwner,
              branch: githubRepoBranch,
              oauthToken: cdk.SecretValue.secretsManager("dev-cdk8s-demo")
            })
          ]
        },
        {
          stageName: 'Build',
          actions: [
            new codepipeline_actions.CodeBuildAction({
              actionName: 'BuildAndPushToECR',
              project: cdkBuildProject,
              input: sourceOutput,
              outputs: [ cdkBuildOutput ]
            })
          ]
        }
      ]
    })


  }
}
