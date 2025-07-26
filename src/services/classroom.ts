
import {
  IRoomList,
  ICreateRoom,
  IUpdateRoom,
  IUpdateStudentInRoom,
} from '../type/classroom'
import roomModel from '../models/classroom';

const getClassroomController = async (data: IRoomList) => {
  try {
    const rows = await roomModel.listRoomBySearch(data);
    return {
      data: {
        user: rows
      }
    }
  } catch (error: any) {
    throw error.message ? error.message : error
  }
}
const createClassroomController = async (data: ICreateRoom) => {
  try {
    const rows = await roomModel.createRoom(data);
    return {
      data: {
        user: rows
      }
    }
  } catch (error: any) {
    throw error.message ? error.message : error
  }
}
const updateRoomController = async (data: IUpdateRoom) => {
  try {
    const result: any = await roomModel.updateRoom(data);
    if (result.affectedRows > 0) {
      return {
        status: true,
        message: 'Update successful',
      };
    } else {
      return {
        status: false,
        message: 'No record updated or Room not found',
      };
    }
  } catch (error: any) {
    throw error.message ? error.message : error
  }
}
const deleteRoomController = async (roomid: number) => {
  try {
    const result: any = await roomModel.deleteRoom(roomid);
    if (result.affectedRows > 0) {
      return {
        status: true,
        message: 'Room deleted successfully',
      };
    } else {
      return {
        status: false,
        message: 'Room not found',
      };
    }
  } catch (error: any) {
    throw error.message ? error.message : error
  }
}
const addStudentInRoomController = async (data: IUpdateStudentInRoom) => {
  try {
    const result: any = await roomModel.updateRoom(data);
    if (result.affectedRows > 0) {
      return {
        status: true,
        message: 'Update successful',
      };
    } else {
      return {
        status: false,
        message: 'No record updated or Room not found',
      };
    }
  } catch (error: any) {
    throw error.message ? error.message : error
  }
}
const removeStudentInRoomController = async (data: IUpdateStudentInRoom) => {
  try {
    const result: any = await roomModel.updateRoom(data);
    if (result.affectedRows > 0) {
      return {
        status: true,
        message: 'Update successful',
      };
    } else {
      return {
        status: false,
        message: 'No record updated or Room not found',
      };
    }
  } catch (error: any) {
    throw error.message ? error.message : error
  }
}
export {
  getClassroomController,
  createClassroomController,
  updateRoomController,
  deleteRoomController,
  addStudentInRoomController,
  removeStudentInRoomController
}