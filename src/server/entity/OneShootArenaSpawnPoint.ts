import { Model } from "objection"
import { DMArena } from "./DMArena"
import { HeavyDMArena } from "./HeavyDMArena"
import { OneShootArena } from "./OneShootArena"
import { SniperArenaEntity } from "./SniperArenaEntity"

export class OneShootArenaSpawnPoint extends Model {
  public static tableName = "one_shoot_arenas_spawns"

  public static relationMappings = {
    arena: {
      join: {
        from: "one_shoot_arenas_spawns.arenaId",
        to: "one_shoot_arenas.id",
      },
      modelClass: OneShootArena,
      relation: Model.BelongsToOneRelation,
    },

}
  public readonly id!: number
  public arenaId: number
  public x: number
  public y: number
  public z: number
}
