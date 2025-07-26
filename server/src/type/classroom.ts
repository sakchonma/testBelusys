export interface IRoomList {
  page?: number,
  limit?: number,
  roomid?: String,
  name?: String,
  gradelevelid?: String,
}

export interface ICreateRoom {
  name?: String,
}

export interface IUpdateRoom {
  roomid?: number,
  name?: String,
}

export interface IUpdateStudentInRoom {
  roomid?: number,
  studentid?: number,
}
