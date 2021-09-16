const fs = require("fs");
const path = require("path");

const galleriesFolder = path.resolve(__dirname, "galleries");

const galleries = fs
    .readdirSync(galleriesFolder)
    .filter(name => path.extname(name) === ".json")
    .map(name => ({
        key: path.parse(name).name,
        ...require(path.join(galleriesFolder, name)),
    }));

module.exports = galleries;