const {join, basename} = require('path')
const {existsSync} = require('fs')
const glob = require('glob')
const {readJson, writeJson} = require('./json')
const {findWsPkg} = require('./file-seek')
const {throwErr} = require('../console')
const {PKG, WORKSPACES_KEY} = require('../constants')

/**
 * @description creates a map of [package-dirs(names)]: package relative path for mono-repos
 * @param {Object} pkg
 * @param {String} root
 * @param {String} wsIgnoreKey
 */
const mapPackages = (pkg, root, wsIgnoreKey) => pkg[WORKSPACES_KEY].reduce((acc, ws) => {
    if (ws[ws.length - 1] === '*') {
        ws = ws.slice(0, -1)
        glob.sync('*/', {cwd: join(root, ws), root})
            .forEach(d => {
                d = d.replace(/\/$/, '')
                const pth = join(root, ws, d, PKG)
                if (existsSync(pth)) {
                    const _pkg = readJson(pth)
                    if (!_pkg[wsIgnoreKey]) acc[basename(d)] = join(ws, d)
                }
            })
    } else acc[ws] = join(root, ws)
    return acc
}, {})

/**
 * @description add a key to the monorepo root package json containing all the
 * packages and their respective absolute paths
 * @param {string} cfgFile - Configuration file name (ex: clipper.config.json)
 * @param {string} mapKey - Key under which to store the package map data
 * @param {String} wsIgnoreKey - if this key is present/truthy the package is ignored
 */
const registerWsMap = (cfgFile, mapKey, wsIgnoreKey) => {
    const [wsPkg, wsRoot] = findWsPkg()
    const cfgPth = join(wsRoot, cfgFile)
    if (existsSync(join(wsRoot, cfgPth)))
        throwErr(`No ${cfgFile} found in ${wsRoot}. Can't register packages`)
    const cfg = readJson(cfgPth)
    cfg[mapKey] = mapPackages(wsPkg, wsRoot, wsIgnoreKey)
    writeJson(cfgPth, cfg)
}

module.exports = {
    registerWsMap
}