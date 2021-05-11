const {basename, join} = require('path')
const {existsSync, readFileSync, writeFileSync} = require('fs')
const {throwErr} = require('../console')
const {DEVERR, JSON_EXT, PKG} = require('../constants')

/**
 * @name readJson
 * @description safely reads a json file
 * @param {String} pth
 * @param {String?} target
 * @return {Object}
 */
const readJson = (pth, target = 'target') => {
    if (!existsSync(pth))
        throwErr(`Couldn't locate the ${target} file in ${pth}.`)
    let raw = ''
    try {
        raw = readFileSync(pth, 'utf8')
    } catch (err) {
        throwErr(`Couldn't read the ${target} file in ${pth}.Reason: ${err.message}`, DEVERR)
    }
    try {
        return JSON.parse(raw)
    } catch (err) {
        throwErr(`Invalid JSON format in the ${target} file located in ${pth}.`, DEVERR)
    }
}

/**
 * @name writeJson
 * @description safely writes a json file
 * @param {String} pth
 * @param {Object} data
 * @param {String?} target
 */
const writeJson = (pth, data, target = 'target') => {
    let raw = ''
    try {
        raw = JSON.stringify(data, null, 2)
    } catch (err) {
        throwErr(`Unable to stringify ${target} to JSON. Reason: ${err.message}`, DEVERR)
    }
    if (!pth.endsWith(JSON_EXT)) pth += JSON_EXT
    try {
        writeFileSync(pth, raw)
    } catch (err) {
        throwErr(`Unable to write ${target} file in ${pth}. Reason: ${err.message}`, DEVERR)
    }
}

/**
 * @name getPackage
 * @description gets a package.json
 * @param {String?} root
 * @return {object}
 */
const getPackage = root => {
    if (basename(root) !== PKG) root = join(root, PKG)
    try {
        return JSON.parse(readFileSync(root, 'utf8'))
    } catch (err) {
        throwErr(`Couldn't read/find any valid ${PKG} in ${root}. Reason: ${err.message}`)
    }
}

/**
 * @name putPackages
 * @description writes a package.json file
 * @param {Object} pkg
 * @param {String} root
 */
const putPackage = (pkg, root) => {
    if (basename(root) !== PKG) root = join(root, PKG)
    try {
        writeFileSync(root, JSON.stringify(pkg, null, 2))
    } catch (err) {
        throwErr(`Couldn't save ${PKG} in ${root}. reason: ${err.message}`)
    }
}

module.exports = {
    readJson,
    writeJson,
    getPackage,
    putPackage
}