/*
 * eventlint
 * https://github.com/mdcone/eventlint
 *
 * Copyright (c) 2015 Michael Dylan Cone
 * Licensed under the MIT license.
 */

var fs = require('fs'),
    path = require('path'),
    emitters = [],
    listeners = [],
    exclusionList = [],
    searchDirectories = function (root, extension, callback) {
        var files;

        if (!fs.existsSync(root)) {
            console.log('File doesn\'t exists: ', root);
            return;
        } else if (!fs.lstatSync(root).isDirectory()) {
            console.log('Path is not a directory: ', root);
            return;
        }

        files = fs.readdirSync(root);

        files.forEach(function (file) {
            var filename = path.join(root, file),
                fstat = fs.lstatSync(filename);

            if (fstat.isDirectory()) {
                searchDirectories(filename, extension, callback);
            } else if (extension.test(filename)) {
                callback(filename);
            }
        });
    },
    parseFiles = function (path) {
        var contents = fs.readFileSync(path, { encoding: 'utf8'}),
            patt = /([A-Za-z0-9_\-$@]+)/;

        console.log('Parsing ' + path);
        if (contents) {
            contents.split('.emit(').forEach(function (emitTok, i) {
                var emit;
                // Always skip the first split
                if (i === 0) {
                    return;
                }

                emit = patt.exec(emitTok)[1];
                emitters.push({
                    name: emit,
                    file: path
                });
            });

            contents.split('.on(').forEach(function (listenTok, i) {
                var listen;
                // Always skip the first split
                if (i === 0) {
                    return;
                }

                listen = patt.exec(listenTok)[1];
                listeners.push({
                    name: listen,
                    file: path
                });
            });
        }
    },
    analyze = function (reporter) {

        var process = function (type, listOne, listTwo) {
            listOne.forEach(function (obj) {
                var found = listTwo.some(function (item) {
                   return obj.name === item.name;
                });

                if (!found && exclusionList.indexOf(obj.name) < 0) {
                    reporter({
                        type: type,
                        handle: obj.name,
                        file: obj.file
                    });
                }
            });
        };

        process('listen' ,listeners, emitters);
        process('emit', emitters, listeners);
    };


exports.lint = function (root, extension, reporter) {
    var files = [];

    // Find all the JavaScript files so we can the parse them.
    searchDirectories(root, new RegExp(extension), function (filePath) {
        files.push(filePath);
    });

    // Parse each file which populates the emitters and listeners.
    files.forEach(function (file) {
        parseFiles(file);
    });

    return analyze(reporter);
};

exports.init = function (options) {
    if (options.exclude) {
        exclusionList = options.exclude.split(',');
    }
};

