import { IsNotEmpty, IsString } from "class-validator";
export interface IAttendance {
  channel_id: string;
  user_id: string;
  frequency: number;
  lastAttendance: Date;
}
export default class Attendance implements IAttendance {
  @IsNotEmpty()
  @IsString()
  public channel_id: string;

  @IsNotEmpty()
  @IsString()
  public user_id: string;

  @IsNotEmpty()
  public frequency: number;

  @IsNotEmpty()
  public lastAttendance: Date;
}