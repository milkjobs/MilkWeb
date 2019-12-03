#!/usr/bin/env bash

DISTRIBUTION_ID=${1}
BUCKET="web.production.milk.jobs"
BUILD_DIR="build/"

echo "Deploying..."
aws s3 sync ${BUILD_DIR} s3://${BUCKET} --region ap-northeast-1 --delete
# Set content type of AASA to json
# https://developer.apple.com/library/archive/documentation/General/Conceptual/AppSearch/UniversalLinks.html
aws s3 cp ${BUILD_DIR}.well-known/apple-app-site-association s3://${BUCKET}/.well-known/ --content-type application/json
echo "Invalidating..."
aws cloudfront create-invalidation --distribution-id ${DISTRIBUTION_ID} --paths /index.html
echo "Deployment complete!!!"
