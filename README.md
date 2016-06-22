# Physical Web Smart Coffee Machine project

<img align="left" src="https://raw.githubusercontent.com/google/physical-web/master/documentation/images/logo/logo-black.png" hspace="15" width="70px" style="float: left">

### Projet overview

This project aims to demonstrate how fun can be Physical Web and how it can make our life better, making a Physical Web enabled smart coffee machine.

This coffee maker can guess your coffee preferences and brew for you a coffee as soon as you are in proximity, without you have to do anything, thanks to your personal Physical Web beacon.
It can be an own machine, at home, or a shared one, at work.

A progresive web application lets you by sign-in with your Google account, selecting your coffee preferences, and generates a short URL that resolves to these settings.
Then, you just have to set this short URL to your personal Physical Web beacon and let you coffee machine do the job for you!

[Physical Web Coffee Maker demo web application](https://physical-web-coffee.firebaseapp.com/)

### Technical Stack
#### Web
- Web Components and Polymer
- Firebase backend

#### Peripheral
- Intel Edison (+ Breackout board)
- Physical Web  beacon
- Node JS + Bluez 5.39

### Documentation
[Hardware modification](documentation/hardware.md)

### Repo organization

```
|-- web          # the web app
|   |-- public
|   
|-- hardware     # hardware modification of the coffee maker
|   |-- picture
|   
|-- edison
|   |-- coffee-ble-central
|   |-- coffee-ble-peripheral
|   
|-- beacon      # firmware of EddystoneURL beacon implementation on nrf51822
|   
|-- tools       # some tools (not used yet)
```
