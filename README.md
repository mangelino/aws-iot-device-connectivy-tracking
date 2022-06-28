# Welcome the AWS IoT Connectivy Tracker

This project deploys 2 AWS IoT Rules and 1 IAM Role to track device connectivity via device shadows. 
Tracking is done based on the MQTT `clientId` used for the connection. 

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template
