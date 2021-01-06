import { IObjectFactory } from "./IObjectFactory"

export class ObjectFactory implements IObjectFactory {
    public create(
        model: number,
        position: Vector3Mp,
        rotation?: Vector3Mp,
        alpha?: number,
        dimension?: number,
    ) {
        return mp.objects.new(model, position, {
            alpha, dimension, rotation,
        })
    }
}
