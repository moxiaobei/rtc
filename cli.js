/**
 * @file retina screen to common screen
 * @author donghualei(1164622039@qq.com)
 */

var fs = require('fs');
var path = require('path');
var parseArgvs = require('minimist');
var Retina2Common = require('./');

var argv = parseArgvs(process.argv.slice(2), {
    // 'boolean': ['r', 'recursive', 'f', 'force'],
    'alias': {
        h: 'help',
        v: 'version',
        f: 'force'
    }
});


var commond = {
    help: function () {
        console.log(
            [
                'Usage: retina2common [options] files|directory',
                '',
                'Description: reduce your image by half',
                '    the image will be save as   XXX@1x.XXX, the old image also exits',
                'Options:',
                '   -o, --output     the path to save',
                '   -h, --help       print this help page',
                '   -v, --version    print program version',
                '',
                'Examples:',
                '  Single File',
                '  eg: retina2common image.png',
                '',
                '  Sing Directory',
                '  eg: retina2common ../test',
                '',
                '  Multiple Files',
                '  eg: retina2common foo.png bar.png  baz.png  quex.png',
                ''
            ].join('\n')
        );
    },
    version: function () {
        var pkg = require('./package.json');
        console.log(pkg.version);
    }
}


var app = {
    exec: function() {
        console.log(argv);
        if (argv.help) {
            commond.help();
            return;
        }
        if (argv.version) {
            commond.version();
        }

        var opt = {};
        if(argv.output || argv.o) {
            opt.output = argv.output || argv.o;
        }

        var files = argv._;
        if(files.length === 0) {
            console.warn('There is no file');
        }

        files = files.map(function (f) {
            return path.resolve(process.env.PWD, f);
        });

        opt.input = files;

        var rtc = new Retina2Common(opt);
        rtc.process();
    }
};


module.exports = app;