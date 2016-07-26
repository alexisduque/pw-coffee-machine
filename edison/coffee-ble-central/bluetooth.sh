#!/bin/sh

rfkill block bluetooth
rfkill unblock bluetooth
#Wait until BT is initialized
for ((i = 0; i <= 100; i++)) do
  hciconfig hci0 && break
  usleep 100000
done
hciconfig hci0 up
