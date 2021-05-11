const {resolve} = require('path')
const {expect} = require('chai')
const {isFsRoot, fileSeek} = require('../../file-system/file-seek')


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
        const testObj = {
            "dummy-key": "whatever",
            "test-key": "present"
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

        it('should find a file in same dir)', () => {
            process.chdir(resolve(__dirname, '../__fixtures__/file-system/packages/package1/dummy-dir2'))

            const [obj, root] = fileSeek(testFn)
            expect(obj).deep.equal(testObj)
            expect(root).to.equal(resolve(__dirname, '../__fixtures__/file-system/packages/package1/dummy-dir2'))
        })

        it('should find a file in same dir)', () => {
            process.chdir(resolve(__dirname, '../__fixtures__/file-system/packages/package1/dummy-dir2'))

            const [obj, root] = fileSeek(testFn)
            expect(obj).deep.equal(testObj)
            expect(root).to.equal(resolve(__dirname, '../__fixtures__/file-system/packages/package1/dummy-dir2'))
        })
    })
})
