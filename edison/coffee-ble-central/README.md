Intel Edison Board
======

## Getting familiar with the Intel Edison

If you are not familiar with the Intel Edison board, I suggest you to follow this great [Getting Started guide by Intel](https://software.intel.com/en-us/node/544867)

You will learn how to:
 * Assemble the Edison module with the breakout board
 * Safely power it
 * Access the board throught TTY Serial
 * Upgrade the OS
 * Configure Wifi
 * Connect throught SSH


## Upload the code to the Board

This can be achieved by 3-ways:
* Cloning the repository using GIT after connecting throught SSH
```sh
ssh root@192.168.0.16  # Use your Edison IP address
git clone https://github.com/alexisduque/pw-coffee-machine
```
* Using SCP
```
scp -r coffee-ble-central root@192.168.0.16:~/
```
* Also, you can configure your advanced IDE (like IntelliJ or the [Intel XDK](https://software.intel.com/en-us/getting-started-with-xdk-and-iot)) to upload the code by just one-click.

## Install NodeJs module

The Intel Edison come with Node v0.12 preinstalled.
Just move to the coffee-ble-central folder and run ``npm install``
## Edison BLE Configuration

### Warning
Require **Bluez > 5.39**, GATT Services discovery might be broken fo lower version.

### Configure Bluetooth systemd service

```sh
# This assume your project root is /home/root/pw-coffee
chmod a+x /home/root/pw-coffee/bluetooth.sh /home/root/pw-coffee/bluetooth.service
cp /home/root/pw-coffee/bluetooth.service /lib/systemd/system/
systemctl enable bluetooth
systemctl start bluetooth
```

### Configure the app to start on boot

```sh
# This assume your project root is /home/root/pw-coffee
rm -rf /node_app_slot
ln -sf /home/root/pw-coffee /node_app_slot

# XDK Daemon should start after bluetooth.service
nano /lib/systemd/system/xdk_daemon.service

# And add line 4 : After=mdns.service bluetooth.service

systemctl daemon-reload
systemctl enable xdk_daemon
```
