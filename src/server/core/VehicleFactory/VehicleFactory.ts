import { IVehicleFactory } from "./IVehicleFactory"

export class VehicleFactory implements IVehicleFactory {
    public create(
        model: number,
        position: Vector3Mp,
        heading?: number,
        numberPlate?: string,
        alpha?: number,
        color?: [[number, number, number], [number, number, number]],
        locked?: boolean,
        engine?: boolean,
        dimension?: number,
    ) {
        return mp.vehicles.new(model, position, {
            alpha, color, dimension, engine, heading, locked, numberPlate,
        })
    }
}
