# progress-bar

[![license](https://img.shields.io/github/license/alabeduarte/progress-bars.svg)](https://spdx.org/licenses/MIT)
[![travis build](https://img.shields.io/travis/alabeduarte/progress-bars.svg)](https://travis-ci.org/alabeduarte/progress-bars)

Code challenge to practice React.

## Requirements

* One set of controls that can control each bar on the fly.
* Can't go under 0.
* Can go over 100%, but limit the bar itself and change its colour.
* Display usage amount as a percentage, centered on each bar.

### Example structure from the endpoint:

```
{
  "buttons": [
    // The amount of buttons to display and what value they increment or
    // decrement the selected bar. Randomly generates between 4 and 6 buttons.
    10,
    38,
    -13,
    -18
  ],
  "bars": [
    // The number of progress bars to display and their default values.
    // Randomly generates between 2 and 5 progress bars.
    62,
    45,
    62
  ]
}
```

## Install

PS: Before you begin, make sure you're using the right node version.
If you use nvm, just run the command `nvm use` or take a look at .nvmrc file to
check what is the node version for this particular project.

```
$ npm install
```

## Running the tests

```
$ npm test
```

## Start the application

The application will be available at http://localhost:3030

```
$ npm start
```

### License

MIT
