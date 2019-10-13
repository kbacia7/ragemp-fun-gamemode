export interface IFileRequest {
   loadFileAsync(filePath: string): Promise<string>,
   loadFileSync(filePath: string): string
}
