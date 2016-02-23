# git-my-stats
[![Build Status](https://travis-ci.org/Joeoh/GitMyStats.svg?branch=master)](https://travis-ci.org/Joeoh/GitMyStats)
[![devDependency Status](https://david-dm.org/Joeoh/GitMyStats/dev-status.svg)](https://david-dm.org/Joeoh/GitMyStats#info=devDependencies)


## Setup
### Prerequisites
#### 1. Install Node.js
Download a suitable package from the [official page](https://nodejs.org/en/) and follow the instructions.
#### 2. Open a Node-enabled console
**Windows**: Node.js command prompt

**OSX/Linux**: Terminal
#### 3. Install Global Dependencies
In your console, enter the following command:
```
npm install -g bower gulp yo generator-office
```
This will install the global project dependencies [Bower](http://bower.io/), [Gulp](http://gulpjs.com/), [Yeoman](http://yeoman.io/), and [generator-office](https://github.com/officedev/generator-office).

### Install Project Dependencies
In your console, change the current working directory to the `office-addin-base` project folder, and enter the following commands in your console:
```
npm install
bower install
```
This will install all local project dependencies as configured in `package.json` (npm) and `bower.json` (bower).

_Add-in start URL_
```
https://localhost:8443/
```
This will create a manifest that can be loaded in all supported Office products.

## Gulp Tasks
### gulp mocha
Runs test files matching `test/test-*.js` with mocha.

### `gulp build`
Runs the `test` task and creates a debug build in `/debug`.

### `gulp serve`
Runs the `build` task, and serves the debug build at `https://localhost:8443/`.

### `gulp ship-build`
Creates a production build in `/ship`.

### `gulp ship`
Runs the `ship-build` task, and uploads the contents of `/ship` to an FTP server (default directory: `/site/wwwroot`).

For this to work, you need to create a file called `ftp.json` in the root directory:
```javascript
{
  "host": "...",
  "user": "...",
  "pass": "..."
}
```

## Run Your Add-In
TODO
