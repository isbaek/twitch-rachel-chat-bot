import {IsNotEmpty, IsString} from "class-validator";

export interface IUser {
  username: string;
  twitch_user_id: string;
  twitch_uuid: string; // Twitch returned UUID
}
export default class User implements IUser {
  @IsNotEmpty()
  @IsString()
  public username: string;

  @IsNotEmpty()
  @IsString()
  public twitch_user_id: string;

  @IsNotEmpty()
  @IsString()
  public twitch_uuid: string;
}