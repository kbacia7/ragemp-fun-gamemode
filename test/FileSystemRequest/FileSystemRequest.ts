import {assert} from "chai"
import {FileSystemRequest} from "core/FileRequest/FileSystemRequest"
import {describe, it} from "mocha"
import path from "path"
import { PromiseFactory } from "core/PromiseFactory/PromiseFactory";
describe("FileSystemRequest", () => {
   describe("#loadFileAsync()", () => {
     it("should return loaded async file", () => {
       const promiseFactory = new PromiseFactory<string>()
       const fsr = new FileSystemRequest(promiseFactory)
       fsr.loadFileAsync(path.join(__dirname, "simple.txt"), true).then((data) => {
         assert.equal(data, "Hello World")
       })
     })
   })
   describe("#loadFileSync()", () => {
      it("should return loaded file", () => {
        const promiseFactory = new PromiseFactory<string>()
        const fsr = new FileSystemRequest(promiseFactory)
        const data = fsr.loadFileSync(path.join(__dirname, "simple.txt"), true)
        assert.equal(data, "Hello World")
      })
    })
   describe("#scanDirectory()", () => {
      it("should return files in directiry", () => {
        const promiseFactory = new PromiseFactory<string>()
        const fsr = new FileSystemRequest(promiseFactory)
        const data = fsr.scanDirectory(path.join(__dirname, "dir"), true)
        assert.deepEqual(data, ["test.txt"])
      })
    })
 })
