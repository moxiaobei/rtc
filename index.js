/**
 * @file retina screen to common screen
 * @author donghualei(1164622039@qq.com)
 */

var fs = require('fs');
var path = require('path');
var underscore = require('underscore');
var minimatch = require('minimatch');
var util = require('./lib/util');
var gm = require('gm');
var imageMagick = gm.subClass({ imageMagick : true });

var defaultOpt = {
    //match
    matchRules: [
        '*.png',
        '*.jpg',
        '*.jpeg',
        '*.gif'
    ],
    input: [],
    output: '',
    count: 0,
    onComplete: function () {}
}


function Retina2Common(opt) {
    this.init(opt);
}

/**
 * 过滤不匹配的文件
 *
 * @param {array} 匹配规则
 * @param {array} 匹配规则
 *
 * @return {array} 根据匹配规则匹配后的数组
 */
function matchFile(matchRules, filePath) {
    return matchRules.some(function (matchRule) {
        if(minimatch(filePath, matchRule, {matchBase: true})) {
            return true;
        }
    });
}


/**
 * 过滤不匹配的文件
 *
 * @param {array} 待处理的全部文件
 * @param {array} 匹配规则
 *
 * @return {array} 根据匹配规则匹配后的数组
 */
function getFiles(input, matchRules) {
    var fileList = [];
    input.forEach(function (path) {
        if (!fs.existsSync(path)) {
            console.warn(path + ' does not exists');
            return;
        }

        var res = util.readFiles(path);
        fileList = fileList.concat(res);
    });

    // 过滤文件
    fileList = fileList.filter(function (fileInfo) {
        // 不符合匹配规则，直接过滤掉
        if(!matchFile(matchRules, fileInfo.path)) {
            return false;
        }
        return true;
    });
    return fileList;
}


/**
 * 初始化
 *
 * @param {opt} 初始化参数
 *
 * @return {}
 */

Retina2Common.prototype.init = function (opt) {
    underscore.extend(this, defaultOpt, opt);

    this.fileList = getFiles(this.input, this.matchRules);

    // console.log(this.output && !fs.existsSync(this.output));
    // 目录不存在则创建目录
    if (this.output && !fs.existsSync(this.output)) {
        fs.mkdirSync(this.output);
    }
};

/**
 * 处理入口
 *
 * @param
 *
 * @return {}
 */

Retina2Common.prototype.process = function () {
    var me = this;

    this.count = 0;
    this.fileList.forEach(function (fileInfo) {
        console.log(fileInfo);
        me.processSingle(fileInfo);
    });
};

/**
 * 分别处理每个文件
 *
 * @param {obj} fileInfo 一个图片信息
 *
 * @return 
 */

Retina2Common.prototype.processSingle = function (fileInfo) {
    var me = this;
    var imageWidth;
    var imageHeight;
    gm(fileInfo.path).identify(function(err, data) {
        if(err) {
            console.log(err);
        }
        imageWidth = data.size.width;
        imageHeight = data.size.height;

        var outputPath = "";
        if (me.output) {
            outputPath = me.output + '/' + fileInfo.name + '@1x.' + fileInfo.ext;
        } else {
            outputPath = fileInfo.dir + '/' + fileInfo.name + '@1x.' + fileInfo.ext;
        }

        gm(fileInfo.path).resizeExact(imageWidth / 2, imageHeight / 2).write(outputPath, function (err) {
            me.count++;
            if(me.count === me.fileList.length) {
                if (!err) {
                    console.log('All images are successful');
                }
                me.onComplete && me.onComplete();
            }
        });
        console.log('test');
    });
}

module.exports = Retina2Common;
