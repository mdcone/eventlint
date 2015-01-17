#  [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-url]][daviddm-image]

> Checks to see that events which are listened for are emitted.


## Install

```sh
$ npm install --save eventlint
```


## Usage

```js
var eventlint = require('eventlint');

eventlint.lint('./lib', callback);
```

```sh
$ npm install --global eventlint
$ eventlint --help
```


## License

MIT © [Michael Dylan Cone](http://dotapply.net)


[npm-url]: https://npmjs.org/package/eventlint
[npm-image]: https://badge.fury.io/js/eventlint.svg
[travis-url]: https://travis-ci.org/mdcone/eventlint
[travis-image]: https://travis-ci.org/mdcone/eventlint.svg?branch=master
[daviddm-url]: https://david-dm.org/mdcone/eventlint.svg?theme=shields.io
[daviddm-image]: https://david-dm.org/mdcone/eventlint
