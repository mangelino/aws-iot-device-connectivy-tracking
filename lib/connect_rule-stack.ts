// Copyright 2022 Massimiliano Angelino
// SPDX-License-Identifier: Apache-2.0

import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as iot from 'aws-cdk-lib/aws-iot';
import * as iam from 'aws-cdk-lib/aws-iam';

export class ConnectRuleStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const republishRole = new iam.Role(this, 'republishRole', {
      assumedBy: new iam.ServicePrincipal('iot.amazonaws.com'),
      inlinePolicies: {
        "republishToShadow": new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              actions: ["iot:Publish"],
              resources: ["*"],
              effect: iam.Effect.ALLOW
            })
          ]
        })
      }
      
    })
    
    new iot.CfnTopicRule(this, 'connectRule', {
      topicRulePayload: {
        awsIotSqlVersion: '2016-03-23',
        sql: 'SELECT { "state": { "reported": {"current": eventtype, "connected": timestamp  } } } from \'$aws/events/presence/connected/+\'',
        actions: [
          {
            republish: {
              topic: "$aws/thing/${clientId}/shadow/name/connectivity/update",
              qos: 1,
              roleArn: republishRole.roleArn
            }
          }
        ]
      }
    })

    new iot.CfnTopicRule(this, 'disconnectRule', {
      topicRulePayload: {
        awsIotSqlVersion: '2016-03-23',
        sql: 'SELECT { "state": { "reported": {"current": eventtype, "disconnected": timestamp, "reason": disconnectReason, "clientInitiatedDisconnect": clientInitiatedDisconnect  } } } from \'$aws/events/presence/disconnected/+\'',
        actions: [
          {
            republish: {
              topic: "$aws/thing/${clientId}/shadow/name/connectivity/update",
              qos: 1,
              roleArn: republishRole.roleArn
            }
          }
        ]
      }
    })
    // example resource
    // const queue = new sqs.Queue(this, 'ConnectRuleQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
