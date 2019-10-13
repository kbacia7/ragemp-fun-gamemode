import { IPromiseFactory } from "core/PromiseFactory/IPromiseFactory"
import * as fs from "fs"
import path from "path"
import { IFileRequest } from "./IFileRequest"
export class FileSystemRequest implements IFileRequest {
   private _promiseFactory: IPromiseFactory<string> = null

   constructor(promiseFactory: IPromiseFactory<string>) {
      this._promiseFactory = promiseFactory
   }

   public loadFileAsync(filePath: string, ignoreFixedPath: boolean = false) {
      filePath = this.preparePath(filePath, ignoreFixedPath)
      return this._promiseFactory.create((resolve) => {
         fs.readFile(filePath, "utf-8", (err, data) => {
            // TODO: Support errors
            resolve(data)
         })
      })
   }

   public loadFileSync(filePath: string, ignoreFixedPath: boolean = false) {
      filePath = this.preparePath(filePath, ignoreFixedPath)
      return fs.readFileSync(filePath, "utf-8")
   }

   public scanDirectory(directoryPath: string, ignoreFixedPath: boolean = false) {
      directoryPath = this.preparePath(directoryPath, ignoreFixedPath)
      const directoryContent: string[] = []
      fs.readdirSync(directoryPath, {
         withFileTypes: true,
      }).forEach((file) => {
         directoryContent.push(file.name)
      })
      return directoryContent
   }

   private preparePath(filePath: string, ignoreFixedPath: boolean) {
      let fixedPath = ""
      if (!ignoreFixedPath) {
         fixedPath = path.join(__dirname, "..", "..")
      }
      filePath = fixedPath + "/" + filePath
      return filePath
   }
}
