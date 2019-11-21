#!/usr/bin/env bash

DISTRIBUTION_ID=${1}

echo "Deploying..."
aws s3 sync build/ s3://web.production.milkjobs.ga --region ap-northeast-1 --delete
echo "Invalidating..."
aws cloudfront create-invalidation --distribution-id ${DISTRIBUTION_ID} --paths /index.html
echo "Deployment complete!!!"
