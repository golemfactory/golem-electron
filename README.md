# Golem Electron Application
![Image of Yaktocat](https://pbs.twimg.com/profile_images/659017061704822784/nRM6iJCS_400x400.png)

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
<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>D</kbd>
<br/>
Mac: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<kbd>⌘ cmd</kbd> + <kbd>Shift</kbd> + <kbd>D</kbd>
<br/>
Linux: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>D</kbd>
<br/>
<br/>
Debug mode will be activated. 
<br/>
Now you can close and reopen the application to catch all critical informations from beginning.
<br/>
<br/>
You'll find debug logs in;
<br/>
<br/>
Windows &nbsp;&nbsp;`%USERPROFILE%\.golem\logs\gui.log` & `gui-error.log`
<br/>
Mac &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`~/.golem/logs/gui.log` & `gui-error.log`
<br/>
Linux &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`~/.golem/logs/gui.log` & `gui-error.log`
<br/>

### :umbrella: Testing
Run tests
``` js
npm run test
npm run test:watch //live
npm run test:coverage //live
```
