# BLE Peripheral


## Warning
Require **Bluez > 5.39**, GATT Services discovery might be broken fo lower version.

## Configure Bluetooth systemd service

```sh
# This assume your project root is /home/root/pw-coffee
chmod a+x /home/root/pw-coffee/bluetooth.sh /home/root/pw-coffee/bluetooth.service
cp /home/root/pw-coffee/bluetooth.service /lib/systemd/system/
systemctl enable bluetooth
systemctl start bluetooth
```

## Configure the app to start on boot

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
