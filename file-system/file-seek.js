const {join, resolve} = require('path')
const {existsSync} = require('fs')
const {readJson, getPackage} = require('./json')
const {throwErr} = require('../console')
const {PKG, WORKSPACES_KEY} = require('../constants')

/**
 * @description determines if a path is the file system root on both nix and windows systems
 * @param {string} root
 * @returns {boolean}
 */
const isFsRoot = root => root === '/'|| /^[A-Z]:\/$/.test(root)

/**
 * @description find a package json uproot, if ws find the root monorepo package
 * @param {string?} fileName
 * @param {string?} key
 * @param {string?} root
 * @returns {[Object, string]}
 */
const fileSeek = ( fileName, key, root) => {
    root = root || process.cwd()
    while (!isFsRoot(root)) {
        const pth = join(root, fileName)
        if (existsSync(pth)) {
            const obj = readJson(pth)
            if (!key || obj[key]) return [obj, root]
        }
        root = resolve(root, '../')
    }
    throwErr(
        `No ${fileName} found while scanning the whole dir tree from ${root} to the file system root` +
        key ? ` or no searched ${key} key present.` : '.'
    )
}

const findWsPkg = root => {
    return fileSeek(PKG, WORKSPACES_KEY, root)
}

/**
 *
 * @param {string} pkgName
 * @param {object} opts
 * @param {string} opts.cfgFile
 * @param {string} opts.wsMapKey
 * @param {string} opts.wsIgnoreKey
 */
const findPkg = (pkgName, opts = {}) => {
    if(!pkgName) return fileSeek(PKG)
    const [, wsRoot]  = fileSeek(PKG, WORKSPACES_KEY)
    const cfg = readJson(join(wsRoot, opts.cfgFile), 'utf8')
    if(!cfg[opts.wsMapKey])
        throwErr(`No ${opts.cfgFile} found in ${wsRoot}.`)
    const pkgPth = join(wsRoot,cfg[opts.wsMapKey][pkgName])
    return [getPackage(pkgPth), cfg[opts.wsMapKey][pkgName]]
}

module.exports = {
    isFsRoot,
    fileSeek,
    findWsPkg,
    findPkg
}