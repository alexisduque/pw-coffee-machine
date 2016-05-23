# Physical Web Smart Coffee Machine project

<img align="left" src="https://raw.githubusercontent.com/google/physical-web/master/documentation/images/logo/logo-black.png" hspace="15" width="70px" style="float: left">

### Projet overview

This project aims to demonstrate the new capabilities of the Bluetooth Web API and Physical Web to easily connect and configure a smart coffee machine, using Bluetooth Low Energy and a smartphone, with no need to download and install a specific Android/iOS application before.

### Technical Stack
#### Server
- Web Components and Polymer

#### Peripheral
- Intel Edison (+ Breackout board)
- Physical Web + Eddystone BLE implementation
- Node JS + Bluez 5.39

### Repo structure

```
|-- server
|   |-- backend
|   |-- client
|       -- app
|           |-- elements
|           |-- images
|           |-- scripts
|           |-- styles
|           |-- test
|       -- mobile
|           |-- controllers
|           |-- models
|           |-- views
|-- peripheral
|-- documentation
```
