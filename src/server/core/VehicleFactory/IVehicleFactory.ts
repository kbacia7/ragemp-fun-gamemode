export interface IVehicleFactory {
    create: (
        model: number,
        position: Vector3Mp,
        heading: number,
        numberPlate: string,
        alpha: number,
        color: [[number, number, number], [number, number, number]],
        locked: boolean,
        engine: boolean,
        dimension: number,
    ) => VehicleMp
}
