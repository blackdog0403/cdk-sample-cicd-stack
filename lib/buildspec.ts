// import { PipelineProject } from '@aws-cdk/aws-codebuild';
import * as cdk from '@aws-cdk/core';
import codebuild = require('@aws-cdk/aws-codebuild');

export function generateCodeBuildProject (scope: cdk.Construct, ecrRepository: string) : codebuild.PipelineProject {

    const cdkBuild = new codebuild.PipelineProject(scope, 'CdkBuild', {
        projectName: 'cdk8s-demo-docker-build',
        
        environmentVariables: { 'IMAGE_REPOSITORY': {
            value: ecrRepository
        }},
        
        environment: {
            buildImage: codebuild.LinuxBuildImage.STANDARD_4_0,
            privileged: true
        },

        buildSpec: codebuild.BuildSpec.fromObject({
            version: "0.2",
            phases: {
                pre_build: {
                    commands: [
                        'env', `$(aws ecr get-login --region $AWS_DEFAULT_REGION --no-include-email)`, 
                        'IMAGE_TAG="$(echo $CODEBUILD_RESOLVED_SOURCE_VERSION | head -c 8)"'
                    ]
                },
                build: {
                    commands: [
                        'docker build -t $IMAGE_REPOSITORY:latest .',
                        'docker tag $IMAGE_REPOSITORY:latest $IMAGE_REPOSITORY:$IMAGE_TAG'
                    ]
                },
                post_build: {
                    commands: [
                        'docker push $IMAGE_REPOSITORY:latest',
                        'docker push $IMAGE_REPOSITORY:$IMAGE_TAG'
                    ]
                }
            }
        })   
    });

    return cdkBuild;
}

