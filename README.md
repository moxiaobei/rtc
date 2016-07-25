retina2common
===============
retina2common is a tool for reduce retina screen image by half.

### Installation

```
    $ [sudo] npm install retina2common -g
```
### Usage
```
    retina2common [file | directory]
```

### Options

    1. -o, --output    the path to save
    2. -h, --help  print the help page
    3. -v, --version  print program version

### Api

```
var Retina2Common = require('retina2common');
var opt = {
    input: [],
    output: '',
    matchRules: [
        '*.jpeg',
        '*.jpg',
        '*.png',
        '*.gif'
    ],
    onComplete: function () {}
};

var r2c = new Retina2Common();
r2c.process(opt);
```

