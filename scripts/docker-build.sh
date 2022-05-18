#!/bin/sh

# stop shell execution on the first error
set -e

echo "build image"
docker image build -t demo .

echo "save image file"
docker save -o demo.tar demo:latest
docker image rm demo:latest
echo "done!"