const {resolve, join} = require('path')
const {writeFileSync, readFileSync} = require('fs')
const {expect} = require('chai')
const {isFsRoot, fileSeek} = require('../../file-system/file-seek')
const {registerWsMap} = require('../../file-system/register-pakages')


describe('file-system unit test', () => {

    describe('isFsRoot', () => {

        it('should recognize a windows fs root', () => {
            const testPth = 'C:/'
            expect(isFsRoot(testPth)).to.be.true
        })

        it('should recognize a nix fs root', () => {
            const testPth = '/'
            expect(isFsRoot(testPth)).to.be.true
        })

        it('should reject a windows non fs root', () => {
            const testPth = 'C:/whatever'
            expect(isFsRoot(testPth)).to.be.false
        })

        it('should recognize a nix non fs root', () => {
            const testPth = '/whatever'
            expect(isFsRoot(testPth)).to.be.false
        })
    })

    describe('fileSeek', () => {

        const testFn = 'test.json'
        const testKey = 'test-key'
        const testObj = {
            "dummy-key": "whatever",
            [testKey]: "present"
        }

        const cwd = process.cwd()

        afterEach(() => {
            process.chdir(cwd)
        })

        it('should find a file up-tree', () => {
            process.chdir(resolve(__dirname, '../__fixtures__/file-system/packages/package1/dummy-dir1'))

            const [obj, root] = fileSeek(testFn)
            expect(obj).deep.equal(testObj)
            expect(root).to.equal(resolve(__dirname, '../__fixtures__/file-system'))
        })

        it('should find a file in same dir', () => {
            process.chdir(resolve(__dirname, '../__fixtures__/file-system/packages/package1/dummy-dir2'))

            const [obj, root] = fileSeek(testFn)
            expect(obj).deep.equal(testObj)
            expect(root).to.equal(resolve(__dirname, '../__fixtures__/file-system/packages/package1/dummy-dir2'))
        })

        it('should find a file with a specific key', () => {
            process.chdir(resolve(__dirname, '../__fixtures__/file-system/packages/package1/dummy-dir1'))

            const [obj, root] = fileSeek(testFn, testKey)
            expect(obj).deep.equal(testObj)
            expect(root).to.equal(resolve(__dirname, '../__fixtures__/file-system'))
        })

        it('should find if root specified', () => {
            const pth = resolve(__dirname, '../__fixtures__/file-system/packages/package1/dummy-dir1')
            const [obj, root] = fileSeek(testFn, testKey, pth)
            expect(obj).deep.equal(testObj)
            expect(root).to.equal(resolve(__dirname, '../__fixtures__/file-system'))
        })

        it('should throw for key not found', () => {
            process.chdir(resolve(__dirname, '../__fixtures__/file-system/packages/package1/dummy-dir1'))

            expect(() => fileSeek(testFn, 'wrong-kwy')).to.throw
        })

        it('should throw for file not found', () => {
            process.chdir(resolve(__dirname))

            expect(() => fileSeek(testFn)).to.throw
        })
    })

    describe('registerPackages', () => {

        const cfgFile = 'test.config.json'
        const testRoot = resolve(__dirname, '../__fixtures__/file-system')
        const cfgPth = join(testRoot, cfgFile)
        const wsMapKey = 'wsMap'
        const wsIgnoreKey = 'wsIgnore'

        beforeEach(() => {
            writeFileSync(cfgPth, '{}')
            process.chdir(resolve(__dirname, '../__fixtures__/file-system/packages/package1/dummy-dir1'))
        })

        it('should correctly map the packages', () => {
            registerWsMap(cfgFile, wsMapKey, wsIgnoreKey)
            const cfg = JSON.parse(readFileSync(cfgPth, 'utf8'))
            expect(cfg[wsMapKey]).to.deep.equal({
                package1: 'packages/package1',
                package2: 'packages/package2'
            })
        })
    })
})
