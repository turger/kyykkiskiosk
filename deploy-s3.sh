#!/usr/bin/env bash

deploy () {
    yarn build
    aws s3 sync build/ s3://pikkukaveri --profile personal
    aws cloudfront create-invalidation --distribution-id E18XH36INF30PZ --paths '/*' --profile personal
}

echo
echo 'This will build and deploy Kyykkiskiosk to S3.'
echo 'You must have AWS cli installed and configured with user that has write access.'
echo
echo -n "Deploy? (y/n) "
read answer
echo

if [ "$answer" == "y" ] ;then

    deploy

    echo
    echo '** Uploaded to S3! **'
    echo
else
    echo 'Wrong answer :('
fi

