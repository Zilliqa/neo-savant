#!/bin/bash


echo $(pwd)

docker --version
aws --version

echo $TRAVIS_COMMIT
commit=$(git rev-parse --short=7 $TRAVIS_COMMIT)

accountID=$(aws sts get-caller-identity --output text --query 'Account')
regionID=ap-southeast-2

#registryURL=${accountID}.dkr.ecr.${regionID}.amazonaws.com/$application

rm -rf savant-artifact
mkdir -p savant-artifact/stg/
mkdir -p savant-artifact/prd/
docker build --build-arg DEPLOY_ENV="stg" -t "tempimagestg:$commit" .
docker create --name extractstg "tempimagestg:$commit"
docker cp extractstg:/usr/share/nginx/html/. $(pwd)/savant-artifact/stg/
docker rm extractstg

docker build --build-arg DEPLOY_ENV="prd" -t "tempimageprd:$commit" .
docker create --name extractprd "tempimageprd:$commit"
docker cp extractprd:/usr/share/nginx/html/. $(pwd)/savant-artifact/prd/
docker rm extractprd

cd savant-artifact
echo $(date) > savant_artifact.txt
echo $commit > savant_artifact_commit.txt

cd ..
tar -zcvf savant-artifact.gz savant-artifact

aws s3 sync . s3://neo-savant-static-artifact --exclude='*' --include='savant-artifact.gz'

# Push to s3 staging
