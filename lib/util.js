/**
 * @file retina screen to common screen
 * @author donghualei(1164622039@qq.com)
 */

var fs = require('fs');
var path = require('path');


/**
 * 判断path是否是目录
 *
 * @param {string} 文件路径或者目录
 *
 * @return {boolean} 递归读取目录获取该目录下的所有文件
 */
exports.isDir = function (p) {
    var stat = fs.statSync(p);
    return stat.isDirectory();
}


/**
 * 递归调用目录获取所有图片文件
 *
 * @param {string} 文件路径或者目录
 *
 * @return {array} 递归读取目录获取该目录下的所有文件
 */
exports.readFiles = function (dir) {
    var fileList = [];
    // 该路径是目录，则需要递归调用
    if (exports.isDir(dir)) {
        fs.readdirSync(dir).forEach(function (fileName) {
            var filePath = path.resolve(dir, fileName);
            fileList = fileList.concat(exports.readFiles(filePath));
        });
    }
    else {
        fileList.push(exports.readFileInfo(dir));
    }
    return fileList;
};

/**
 * 读取文件相关信息
 *
 * @param {string} 文件路径
 *
 * @return {object} 保存文件的相关信息
 */
exports.readFileInfo = function (file) {
    var stat = fs.statSync(file);

    var obj = {};
    obj.size = stat.size;
    obj.path = file;
    obj.dir = path.dirname(file);

    var ext = path.extname(file);
    obj.ext = ext.substring(1);
    obj.name = path.basename(file, ext);
    return obj;
}