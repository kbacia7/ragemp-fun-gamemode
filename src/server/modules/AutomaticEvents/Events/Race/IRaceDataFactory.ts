import { IRaceData } from "./IRaceData"

export interface IRaceDataFactory {
    create: (timeInMs: number, checkpoints: number, name: string) => IRaceData
}
