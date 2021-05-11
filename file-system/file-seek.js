const {join, resolve} = require('path')
const {existsSync} = require('fs')
const {readJson} = require('./json')
const {throwErr} = require('../console')
const {PKG} = require('../constants')

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
        const pth = join(root, fileName || PKG)
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

module.exports = {
    isFsRoot,
    fileSeek
}
//Users/vlad/Documents/zecode/@lib/handy-man/test/__fixtures__/file-system/test.json
//Users/vlad/Documents/zecode/@lib/handy-man/test/__fixtures__/file-system/test.json