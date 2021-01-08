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
        const v = mp.vehicles.new(model, position, {
            alpha, color, dimension, engine, heading, locked, numberPlate,
        })
        if (color) {
            v.setColorRGB(color[0][0], color[0][1], color[0][2], color[0][0], color[0][1], color[0][2])
            return v
        }
    }
}
