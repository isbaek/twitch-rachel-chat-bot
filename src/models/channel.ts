import { IsNotEmpty, IsString } from "class-validator";

export interface IChannel {
  channel_id: string;
  channel_name: string;
  refresh_token: string;
}

export default class Channel implements IChannel {
  @IsNotEmpty()
  @IsString()
  public channel_id: string;

  @IsNotEmpty()
  @IsString()
  public channel_name: string;

  @IsNotEmpty()
  @IsString()
  public refresh_token: string;
}