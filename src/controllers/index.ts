import { DocumentReference } from "@google-cloud/firestore";

import { IUser } from '../models/user';
import { IChannel } from '../models/channel';
import { readOrCreateWithId } from './firestore';
import { LAST_ATTENDANCE_THRESHOLD } from '../constants';


function addHoursToDate(objDate, intHours) {
    const numberOfMlSeconds = objDate.getTime();
    const addMlSeconds = (intHours * 60) * 60 * 1000;
    const newDateObj = new Date(numberOfMlSeconds + addMlSeconds);
    return newDateObj.getTime();
}

async function attendanceValidator (attendance: DocumentReference) {
  const { lastAttendance } = (await attendance.get()).data();
  const now = Date.now();
  const lastAttendanceDate = lastAttendance.toDate();
  const attendanceThreshold = addHoursToDate(lastAttendanceDate, LAST_ATTENDANCE_THRESHOLD)
  if (now < attendanceThreshold) return false;
  return true;
}


async function trackAttendance(channelObject: IChannel, userObject: IUser): Promise<number> {
  // First lookup or create user
  const { channel_id } = channelObject;
  const { twitch_user_id } = userObject;
  await readOrCreateWithId('users', twitch_user_id, userObject);
  const attendance = await readOrCreateWithId('attendance', `${twitch_user_id}_${channel_id}`, {
    frequency: 0,
    lastAttendance: new Date()
  });
  if (!(await attendanceValidator(attendance))) return 0;
  const newAttendanceFrequency = (await attendance.get()).data().frequency ?? 0;
  await attendance.update({
    frequency: newAttendanceFrequency + 1,
    lastAttendance: new Date(),
  })
  return newAttendanceFrequency + 1;
}

export default trackAttendance;