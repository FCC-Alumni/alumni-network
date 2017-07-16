#!/bin/bash -ex
docker run -it -v "$PWD":/usr/src/app -w /usr/src/app scottmiller171/yarn:8
docker run -it -v "$PWD":/usr/src/app -w /usr/src/app/client scottmiller171/yarn:8
