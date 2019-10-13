import { IPromiseFactory } from "core/PromiseFactory/IPromiseFactory"
import $ from "jquery"
import { IFileRequest } from "./IFileRequest"
export class XMLFileRequest implements IFileRequest {
   private _promiseFactory: IPromiseFactory<string> = null

   constructor(promiseFactory: IPromiseFactory<string>) {
      this._promiseFactory = promiseFactory
   }

   public loadFileAsync(filePath: string) {
      return this._promiseFactory.create((resolve) => {
         $.ajax({
            async: true,
            success: (data) => {
               resolve(data)
            },
            type: "GET",
            url: filePath,
        })
      })
   }
   public loadFileSync(filePath: string) {
      return $.ajax({
         async: false,
         type: "GET",
         url: filePath,
     }).responseText
   }
}
