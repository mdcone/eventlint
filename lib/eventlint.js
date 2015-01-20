/*
 * eventlint
 * https://github.com/mdcone/eventlint
 *
 * Copyright (c) 2015 Michael Dylan Cone
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs'),
    path = require('path'),

    // Storage for the list of emitters and listeners that were not found.
    emitters = [],
    listeners = [],

    // List of excluded directories and/or files.
    exclusionList = [];

// Resets internals back to a default state.
var reset = function () {
    emitters = [];
    listeners = [];
};

// searchDirectories
//
// Searches directories for files with the supplied extension. For each file
// that matches, call the proviced callback. If the file being evaluated is a
// directory, recurse and process the files in that directory.
var searchDirectories = function (root, extension, callback) {
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
};

// parseFiles
//
// Parses a single file for emits and then ons.
var parseFile = function (path) {
    var contents = fs.readFileSync(path, {encoding: 'utf8'}),
        handlePattern = /([A-Za-z0-9_\-$@]+)/,

        // parseForKeyword
        //
        // With a given keyword, parse all the event handles out of the
        // file contents.
        parseForKeyword = function(keyword, resultArray) {
            contents.split('.' + keyword + '(').forEach(function (tok, i) {
                var handle;

                // The first run through just return, the tok variable will not
                // have the handle in it.
                if (i === 0) {
                    return;
                }

                handle = handlePattern.exec(tok)[1];

                resultArray.push({
                    name: handle,
                    file: path
                });
            });
        };

    if (contents) {
        parseForKeyword('emit', emitters);
        parseForKeyword('on', listeners);
    }
};

// analyze
//
// Expects a reporter function which is called when a lint finding occurs.
var analyze = function (reporter) {

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

    process('listen', listeners, emitters);
    process('emit', emitters, listeners);
};


// Public Interfaces

// lint
//
// The lint function. It expects a root directory to analyse and then a reporter
// callback function which gets called with any lint findings. The reporter will
// be passed an object that contains the properties type, handle and file.
exports.lint = function (root, reporter, extension) {
    var files = [];

    // Default the extension regular expression to all .js and .jsx files.
    extension = extension || '\.js(x?)$';

    reset();

    // Find all the JavaScript files so we can the parse them.
    searchDirectories(root, new RegExp(extension), function (filePath) {
        files.push(filePath);
    });

    // Parse each file which populates the emitters and listeners.
    files.forEach(function (file) {
        parseFile(file);
    });

    return analyze(reporter);
};

// init
//
// The initialization interface which expects an object array to be passed in.
exports.init = function (options) {

    // The exclusion list is a list of the event handles which will be ignored
    // by the linter.
    if (options.exclude) {
        exclusionList = options.exclude.split(',');
    }
};

