#!/bin/sh

# stop shell execution on the first error
set -e

echo "build image"
docker image build -t cms-out-project .

echo "save image file"
docker save -o cms-out-project.tar cms-out-project:latest
docker image rm cms-out-project:latest
echo "done!"