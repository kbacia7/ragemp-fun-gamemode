import { Rank } from "./Rank"

export class Player {
  public readonly login: string
  public readonly password: string
  public readonly email: string
  public readonly rank: Rank
  public readonly kills: number
  public readonly deaths: number
  public readonly ped: number
}
