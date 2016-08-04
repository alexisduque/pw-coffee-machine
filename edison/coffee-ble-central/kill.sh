#!/usr/bin/env bash

kill -2 $(ps | grep '/node_app' | awk '{print $1}')
