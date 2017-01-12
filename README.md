GroupSafe Chat @ CS 4704 
========================

GroupSafe Chat is a full stack application for people who needs a secret chatting in a small group.
The front-end is written in **Android** and **HTML** for different users.
The back-end (Main servers) is powered by **Node.js**, **Express** and **Socket.io** and **MongoDB** :floppy_disk: is implemented in the project to do data management work.

| ![CreateGroup](http://i.imgur.com/h3sbBGk.gif) | ![CreateGroup2](http://i.imgur.com/42CSisG.gif) |
| --- | --- |

## Motivation :egg:

In many situations it is useful to be able to detect when a group member has wandered off from the rest of the group. In a college scene, a friend may drink too much and pass out in a wrong place. Our app will send notifications to members in a group when it detects a member has wandered too far from the rest of the group and will provide other useful information or ways to communicate amongst group members, so this way groups can **stick together** and help **prevent  dangerous or awkward situations**. Our app was actually inspired by such a situation and as such will be targeting college students as the user base. The primary target users will be young adults are who often form a small groups to explore the city, go out to bars, and/or other form of group activity where staying in a group is important. 

## Features :confetti_ball:
- Safe group chatting :football:
- Emoji supported :basketball:
- Ability to kick users (for group holder) :tennis:
- See group members on a map show :soccer:
- Quick phone call/text message supported :8ball:
- Other awesome features yet to be implemented :baseball:

#### There are 3 user levels:

**Normal user:** :strawberry:
- Join/Create group 
- Send/Receive group chat messages
- Check group member location on map view
- Give phone call/text to group members directly

**Group leader:** :lemon:
- The above plus the ability to kick users and transfer priority to other 
- users(change group leader)

**Administrator:** :green_apple:
- All the above plus promote/demote users

## Setup :key:

Clone the whole repo to your desktop/server and run `npm install` to install all the dependencies.

## Usage :pushpin:
Once the dependencies are installed:
You can run  `node app.js` in the server folder to start the main server. You will then be able to access it at localhost:8080

You can run  `node app3.js` in the socket.io folder to start the chatting server. The chatting server will take the port - localhost:3000

If you want to start the server forever, please use the forever comamnds to do the manipulation:

Forever start the server: `forever start app.js`

Check the forever-started server: `forever list` - You will get index of forever-started servers.

Forever stop the server: `forever stop INDEX`

You can test the GroupSafe Chat App by running app on an Android simulator or testing on your Android cellphone in the GroupSafe folder

## GroupSafe Chat Demo :package:
This is our Demo server link: http://54.158.251.62:8080/. 
You can create or change personal information on this website.

The GroupSafe Chat application demo is ready for you. 
The Android app is built using this default address: http://54.158.251.62:3000/ for the chatting function. 

If you want to copy the whole project and use your own server, please change the server port to yours. 

## Code Example :page_facing_up:

Example for using express and socket.io to create the chatting server

```javascript
var express = require('express'),
	
	app = express(),
	
	server = require('http').createServer(app),
	
	io = require('socket.io').listen(server),
	
	mongoose = require('mongoose'),
	
	users = {};

var rooms = {};

var sockets = {};

var groups = {};


server.listen(3000);

var Schema = mongoose.Schema;
```

## Resource Dependency && API Reference :books:

The main manipulation server dependencies:
![Dependencies](http://i.imgur.com/Cws142V.png)

The chatting server dependencies:
![Dependencies](http://i.imgur.com/YyzEC0z.png)

Using the Socket.io API: http://socket.io/docs/

Using the NodeJS server Documentation: https://nodejs.org/api/

## Tests :hammer:

All the codes are tested and passed to guarantee the system operation.
The server Node.js codes are tested by Sungha, Taiwen and Zhizheng.
The Android client codes are tested by Steffen, Taiwen.
The HTHML5 web client codes are tested by Zhizheng.

## Team :mortar_board:

| [![Sungha Song](http://i.imgur.com/nVnyzZr.png)](https://github.com/ssong716) | [![Taiwen Jin](http://i.imgur.com/ahLfmsW.png)](https://github.com/kimdaxterkid) | [![Zhizheng Chen](http://i.imgur.com/kC01UlS.png)](https://github.com/andychen23) | [![Steffen Moseley](http://i.imgur.com/iI43Htw.png)](https://github.com/scm16) | [![Arman Bahraini](http://i.imgur.com/hdqRSVB.png)](https://github.com/MegaArman) |
| --- | --- | --- | --- | --- |
| Sungha Song | Taiwen Jin | Zhichen Chen | Steffen Moseley | Arman Bahraini |

## License :pencil:

Copyright (c) 2016 Team GroupSafe@CS4704

This project is licensed under the terms of the **MIT** license.


