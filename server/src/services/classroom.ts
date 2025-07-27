
import {
  IRoomList,
  ICreateRoom,
  IUpdateRoom,
  IUpdateStudentInRoom,
  IStudentsWithoutRoomList
} from '../type/classroom'
import roomModel from '../models/classroom';

const getClassroomController = async (data: IRoomList) => {
  try {
    const rows = await roomModel.listRoomBySearch(data);
    return {
      data: rows
    }
  } catch (error: any) {
    throw error.message ? error.message : error
  }
}
const getStudentInClassroomController = async (roomid: number) => {
  try {
    const rows = await roomModel.getStudentsInClassroom(roomid);
    return {
      data: rows
    }
  } catch (error: any) {
    throw error.message ? error.message : error
  }
}
const getStudentsWithoutClassroom = async (data: IStudentsWithoutRoomList) => {
  try {
    const rows = await roomModel.getStudentsWithoutClassroom(data);
    return {
      data: rows
    };
  } catch (error: any) {
    throw error.message ? error.message : error;
  }
};
const createClassroomController = async (data: ICreateRoom) => {
  try {
    const result = await roomModel.createRoom(data);
    return {
      data: result
    }
  } catch (error: any) {
    throw error.message ? error.message : error
  }
}
const updateRoomController = async (data: IUpdateRoom) => {
  try {
    const result: any = await roomModel.updateRoom(data);
    return result
  } catch (error: any) {
    throw error.message ? error.message : error
  }
}
const deleteRoomController = async (roomid: number) => {
  try {
    const result: any = await roomModel.deleteRoom(roomid);
    return result
  } catch (error: any) {
    throw error.message ? error.message : error
  }
}
const addStudentInRoomController = async (data: IUpdateStudentInRoom) => {
  try {
    const result: any = await roomModel.addStudentInRoom(data);
    return result
  } catch (error: any) {
    throw error.message ? error.message : error
  }
}
const removeStudentInRoomController = async (data: IUpdateStudentInRoom) => {
  try {
    const result: any = await roomModel.removeStudentInRoom(data);
    if (result.affectedRows > 0) {
      return {
        status: true,
        data: { message: 'Student removed from classroom' },
      };
    } else {
      return {
        status: false,
        data: { message: 'Student in classroom not found' },
      };
    }
  } catch (error: any) {
    throw error.message ? error.message : error
  }
}
export {
  getClassroomController,
  getStudentInClassroomController,
  getStudentsWithoutClassroom,
  createClassroomController,
  updateRoomController,
  deleteRoomController,
  addStudentInRoomController,
  removeStudentInRoomController
}