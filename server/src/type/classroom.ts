export interface IRoomList {
  page?: number,
  limit?: number,
  roomid?: String,
  name?: String,
  teacherName?: String,
}
export interface IStudentsWithoutRoomList {
  gradelevel?: string;
  name?: String,
  page?: number,
  limit?: number,
}

export interface ICreateRoom {
  classname?: String,
  academic_year?: Number,
  homeroom_teacher?: String,
}

export interface IUpdateRoom {
  classroomid?: Number,
  classname?: String,
  academic_year?: Number,
  homeroom_teacher?: String,
}

export interface IUpdateStudentInRoom {
  classroomid?: number,
  studentid?: number,
}
