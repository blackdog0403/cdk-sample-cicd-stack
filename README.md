# CDK SAMPLE CICD STACK

본 프로젝트는 CDK 이용하여 AWS게정에 CI/CD 파이프라인을 구성해주는 프로젝트이다

## 사전준비사항
- nodejs 설치 -[https://nodejs.org/en/download/package-manager/](https://nodejs.org/en/download/package-manager/)
- cdk 설치법 - [https://docs.aws.amazon.com/cdk/latest/guide/cli.html](https://docs.aws.amazon.com/cdk/latest/guide/cli.html)
- 샘플 어플리케이션 형상을 [https://github.com/stefanprodan/podinfo](https://github.com/stefanprodan/podinfo)를 자신의 github 계정으로 fork 하기 
- Github용 oauth token 생성 - 블로그 참조
- 위의 github용 token을 AWS Secret Manager에 `'dev-cdk8s-new'`라는 이름으로 등록할 것 - 블로그 참조

## 사용법

형상을 내려받고 npm으로 관련 라이브러리를 설치한다.

```bash
git clone https://github.com/blackdog0403/cdk-sample-cicd-stack # 형상 클론
cd cdk-sample-cicd-stack
npm install
```

IDE로 프로젝트 루트 디렉토리 아래의 lib/cicd-stack.ts 파일에 있는 Git Repo 정보를 자신의 깃험 정보에 맞춰서 수정한다.

```typescript
... 생략 ...

export class CiCdStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const githubRepoOwner ='blackdog0403'; // 깃험 아이디 
    const githubRepoBranch = 'master'; // 브랜치
    const githubRepoName = 'podinfo'; // 레포지토리 이름 

    const ecrRepository = new ecr.Repository(this, 'CdkEcr' ,{
      imageScanOnPush: false,
      repositoryName: 'cdk8s-demo-podinfo',
      removalPolicy: cdk.RemovalPolicy.DESTROY // test를 위해서 스택이 삭제되면 바로 삭제되도록 구성
    });
... 생략 ...
```

수정을 완료하고 나면 다음의 커맨드를 통해서 typescript를 빌드하고 cloud formation 템플릿을 생성하여 AWS 계정에 리소스를 생성합니다. 

```bash
npm run build # 에러가 발생하지 않았다면 정상적으로 코딩이 된 걸 확인 가능.
cdk synth # 코드를 cloud formatino으로 전환
cdk diff # 실제로 반영할 변경점에 대해서 확인.
```

terminal 통해서 출력이 되는 것을 확인해서 어떤 부분이 반영될지를 확인하고 나서 다음의 명령어로 실제로 반영합니다.

```bash
cdk deploy CiCdStack
```

에러없이 정상적으로 실행이 끝났다면 AWS Console에 접속하여 정상적으로 생성되었는지 확인한다.



## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template
