import * as cdk from "@aws-cdk/core";
import s3 = require("@aws-cdk/aws-s3");
import iam = require("@aws-cdk/aws-iam");
import lambda = require("@aws-cdk/aws-lambda");
import event_sources = require("@aws-cdk/aws-lambda-event-sources");
import { Duration } from "@aws-cdk/core";
import { STORAGE } from "shared/constants/construct-names";
import { ImageLabelsTable } from "./constructs/storage/database/dynamoDB/image-labels";
import { ImageBucket } from "./constructs/storage/buckets/image";

export class AwsdevhourStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const imageBucket = new ImageBucket(this, STORAGE["buckets"]["image"].ID);

    const imageLabelsTable = new ImageLabelsTable(
      this,
      STORAGE["dynamo"]["image-labels"].ID
    );

    // =====================================================================================
    // Building our AWS Lambda Function; compute for our serverless microservice
    // =====================================================================================
    const rekFn = new lambda.Function(this, "rekognitionFunction", {
      code: lambda.Code.fromAsset("rekognitionlambda"),
      runtime: lambda.Runtime.PYTHON_3_7,
      handler: "index.handler",
      timeout: Duration.seconds(30),
      memorySize: 1024,
      environment: {
        TABLE: imageLabelsTable.table.tableName,
        BUCKET: imageBucket.bucket.bucketName,
      },
    });
    rekFn.addEventSource(
      new event_sources.S3EventSource(imageBucket.bucket, {
        events: [s3.EventType.OBJECT_CREATED],
      })
    );
    imageBucket.bucket.grantRead(rekFn);
    imageLabelsTable.table.grantWriteData(rekFn);

    rekFn.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["rekognition:DetectLabels"],
        resources: ["*"],
      })
    );
  }
}
