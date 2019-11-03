import { IVector3Factory } from "./IVector3Factory"

export class Vector3Factory implements IVector3Factory {
    public create(
        x: number,
        y: number,
        z: number,

    ) {
        return new mp.Vector3(x, y, z)
    }
}
