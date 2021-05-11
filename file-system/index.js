const json = require('./json')
const fileSeek = require('./file-seek')

module.exports = {
    ...json,
    ...fileSeek

}