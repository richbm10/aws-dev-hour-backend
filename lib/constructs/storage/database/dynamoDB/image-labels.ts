import * as cdk from "@aws-cdk/core";
import dynamodb = require("@aws-cdk/aws-dynamodb");
import { STORAGE } from "shared/constants/construct-names";

interface ImageLabelsTableProps {}

const columns = {
  image: "image",
};

// =====================================================================================
// Amazon DynamoDB table for storing image labels
// =====================================================================================
export class ImageLabelsTable extends cdk.Construct {
  private _table: dynamodb.Table;

  constructor(scope: cdk.Construct, id: string, props?: ImageLabelsTableProps) {
    super(scope, id);
    this._table = new dynamodb.Table(
      this,
      STORAGE["dynamo"]["image-labels"].NAME,
      {
        partitionKey: {
          name: columns.image,
          type: dynamodb.AttributeType.STRING,
        },
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      }
    );
    new cdk.CfnOutput(this, STORAGE["dynamo"]["image-labels"].CFN, {
      value: this._table.tableName,
    });
  }

  get table() {
    return this._table;
  }
}
