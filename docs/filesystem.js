'use strict';

const fs = require('fs');
const path = require('path');
const child_process = require('child_process');

const TYPE_DIRECTORY = module.exports.TYPE_DIRECTORY = 'directory';
const TYPE_FILE = module.exports.TYPE_FILE = 'file';
const TYPE_LINK = module.exports.TYPE_LINK = 'link';
const TYPE_SOCKET = module.exports.TYPE_SOCKET = 'socket';

const exists = module.exports.exists = (filename, type) => {
    filename = path.resolve(filename);
    if (filename.indexOf('/*') === filename.length -2) {
        filename = filename.slice(0, -2);
    }
    if (!fs.existsSync(filename)) {
        return false;
    }

    const stat = fs.lstatSync(filename);
    switch (type) {
        case TYPE_DIRECTORY:
            return stat.isDirectory();
        case TYPE_FILE:
            return stat.isFile();
        case TYPE_LINK:
            return stat.isSymbolicLink();
        case TYPE_SOCKET:
            return stat.isSocket();
        default:
            return stat.isFile() || stat.isDirectory() || stat.isSymbolicLink() || stat.isSocket();
    }
};

const mkdir = module.exports.mkdir = source => {
    source = path.resolve(source);
    const directory = path.dirname(source);
    return child_process.execSync(`mkdir -p ${directory}`);
};

const copy = module.exports.copy = (source, target) => {
    if (!exists(source)) {
        throw new Error(`Source ${source} doesn't exist`);
    }
    if (!exists(target)) {
        mkdir(target);
    }
    return child_process.execSync(`cp -R ${source} ${target}`);
};

const link = module.exports.link = (source, target) => {
    source = path.resolve(source);
    if (exists(source)) {
        throw new Error(`Source ${source} doesn't exist`);
    }
    target = path.resolve(target);
    if (!exists(target)) {
        throw new Error(`Destination ${target} already exists`);
    }
    return child_process.execSync(`ln -s ${source} ${target}`);
};

const read = module.exports.read = source => {
    source = path.resolve(source);
    if (!exists(source)) return;
    if (exists(source) && !fs.lstatSync(source).isFile()) {
        throw new Error(`Source ${source} doesn't exist`);
    }
    const content = fs.readFileSync(source).toString();
    switch (path.extname(source)) {
        case '.json': return JSON.parse(content);
        default: return content;
    }
};

const remove = module.exports.remove = source => {
    source = path.resolve(source);
    if (!exists(source)) {
        throw new Error(`Source ${source} doesn't exist`);
    }
    return child_process.execSync(`rm -rf ${source}`);
};

const touch = module.exports.touch = source => {
    source = path.resolve(source);
    if (exists(source)) {
        throw new Error(`Source ${source} already exists`);
    }
    mkdir(source);
    return child_process.execSync(`touch ${source}`);
};

const write = module.exports.write = (source, content) => {
    source = path.resolve(source);
    if (!exists(source)) {
        touch(source);
    }
    if (typeof content === 'object') {
        content = JSON.stringify(content, null, 4);
    }
    return fs.writeFileSync(source, content, source.match(/(\.jpg|\.jpeg|\.png|\.bmp)$/) ? 'binary' : undefined);
};
