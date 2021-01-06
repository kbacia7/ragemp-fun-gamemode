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
            // tslint:disable-next-line: no-bitwise
            const firstColorDec = (color[0][0] << 16) + (color[0][1] << 8) + (color[0][2])
            // tslint:disable-next-line: no-bitwise
            const secondColorDec = (color[1][0] << 16) + (color[1][1] << 8) + (color[1][2])
            v.setColor(firstColorDec, secondColorDec)
            return v
        }
    }
}
