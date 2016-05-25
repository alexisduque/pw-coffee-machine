#!/bin/bash

rfkill block bluetooth
rfkill unblock bluetooth
hciconfig hci0 up
