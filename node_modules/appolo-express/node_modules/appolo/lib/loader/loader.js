"use strict";

var fs = require('fs'),
    path = require('path'),
    _ = require('lodash');


var loadFiles = function (filePath, callback) {

    if (fs.existsSync(filePath)) {

        fs.readdirSync(filePath).forEach(function (file) {
            var newPath = path.join(filePath, file);
            var stat = fs.statSync(newPath);
            if (stat.isFile() && /(.*)\.(js)$/.test(file)) {
                callback(newPath);
            } else if (stat.isDirectory()) {
                loadFiles(newPath, callback);
            }
        });
    }
};

module.exports = function (root, filesPath, callback) {

    if (!_.isArray(filesPath)) {
        filesPath = [filesPath];
    }

    _.forEach(filesPath, function (filePath) {
        loadFiles(path.join(root, filePath), callback);
    })
}
//module.exports.loadFiles = function loadFiles(paths,root,cachedRequire) {
//
//    if(!paths){
//        return;
//    }
//
//    for (var i = 0, length = paths.length; i < length; i++) {
//
//        var location = paths[i],
//
//            files = fs.readdirSync(path.join(root, location)),
//            filePath,
//            file;
//
//        for (var j = 0, lengthFiles = files.length; j < lengthFiles; j++) {
//
//            file = files[j];
//            filePath = location + '/' + file;
//
//            if (fs.statSync(path.join(root,filePath)).isDirectory()) {
//
//                if (file.match(/^\.(git|svn)$/)) {
//                    return;
//                }
//
//                loadFiles([filePath],root,cachedRequire);
//
//            } else {
//                if (file.match(/\.js$/)) {
//                    var tempPath = path.join(root, filePath);
//
//                    if(cachedRequire && _.isArray(cachedRequire)){
//                        cachedRequire.push(tempPath);
//                    }
//
//                    require(tempPath);
//
//                }
//            }
//        }
//    }
//};