import * as cdk from "@aws-cdk/core";
import { STORAGE } from "../../../../shared/constants/construct-names";
import s3 = require("@aws-cdk/aws-s3");

interface ImageBucketProps {}

// =====================================================================================
// Image Bucket
// =====================================================================================
export class ImageBucket extends cdk.Construct {
  private _bucket: s3.Bucket;

  constructor(scope: cdk.Construct, id: string, props?: ImageBucketProps) {
    super(scope, id);

    this._bucket = new s3.Bucket(this, STORAGE["buckets"]["image"].NAME, {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    new cdk.CfnOutput(this, STORAGE["buckets"]["image"].CFN, {
      value: this._bucket.bucketName,
    });
  }

  get bucket() {
    return this._bucket;
  }
}
