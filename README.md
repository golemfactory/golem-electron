# Golem Electron Application
![Minimum Node Requirement](https://img.shields.io/badge/node-%3E%3D6.12.0-brightgreen.svg)
[![CircleCI](https://circleci.com/gh/golemfactory/golem-electron.svg?style=shield)](https://circleci.com/gh/golemfactory/golem-electron)
[![Build Status](https://travis-ci.org/golemfactory/golem-electron.svg?branch=dev)](https://travis-ci.org/golemfactory/golem-electron)
<br/>
![Image of Golem](https://pbs.twimg.com/profile_images/983446440654630912/Byzk9eIL_400x400.jpg)

The desktop application using Electron, React and Redux.

## Development
### :wrench: Installation
Go to project main folder and hit;
```
npm install
```
or if you wish;
```
yarn 
```
That's it!


### :computer: Usage
Start dev server
```
npm run start:app
```

Start electron application (development mode)
```
npm run start
```
### :bug: Debug mode
While using application, you can choose `Debug mode` from the `View` menu or press;

Windows: &nbsp;
<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>L</kbd>
<br/>
Mac: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<kbd>⌘ cmd</kbd> + <kbd>Shift</kbd> + <kbd>L</kbd>
<br/>
Linux: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>L</kbd>
<br/>
<br/>
Debug mode will be activated. 
<br/>
Now you can restart the application to catch all critical informations from beginning.
<br/>
<br/>
You'll find debug logs in;
<br/>
<br/>

|OS|Path|General Log|Error Log|
|---|---|---|---|
|Windows|`%LOCALAPPDATA%\golem\golem\default\{CURRENT_CHAIN}\logs\`|`gui.log`|`gui-error.log`|
|Mac|`~/Library/Application\ Support/golem/default/{CURRENT_CHAIN}/logs/`|`gui.log`|`gui-error.log`|
|Linux|`~/.local/share/golem/default/{CURRENT_CHAIN}/logs/gui.log/`|`gui.log`|`gui-error.log`|

<br/><br/>
Note: `{CURRENT_CHAIN}` parameter will be `mainnet` if you running golem on mainnet, if you're on testnet it will be `rinkeby` in this case.
<br/>

### :control_knobs: Developer mode
While using application, you can choose `Developer mode` from the `View` menu or press;

Windows: &nbsp;
<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>D</kbd>
<br/>
Mac: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<kbd>⌘ cmd</kbd> + <kbd>Shift</kbd> + <kbd>D</kbd>
<br/>
Linux: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>D</kbd>
<br/>
<br/>
Developer mode will be activated. 
<br/>
<br/>

You'll find additional information about;
- subtask node list in task details page
- peer list in settings tab
- stats about the application in settings tab
- more detailed tooltip information while hovering subtask borders in preview window 


### :umbrella: Testing
Run tests
``` js
npm run test
npm run test:watch //live
npm run test:coverage //live
```
