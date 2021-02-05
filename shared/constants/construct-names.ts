export const STORAGE = {
  buckets: {
    image: { CFN: "imageBucket", NAME: "ImageBucket", ID: "image" },
  },
  dynamo: {
    "image-labels": {
      CFN: "ddbTable",
      NAME: "ImageLabelsTable",
      ID: "image-labels",
    },
  },
};
