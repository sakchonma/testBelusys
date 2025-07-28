
import {
  IRoomList,
  ICreateRoom,
  IUpdateRoom,
  IUpdateStudentInRoom,
  IStudentsWithoutRoomList,
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
    const checkRoom = await roomModel.checkCreateRoomAlready(data);
    if ((checkRoom as any[]).length > 0) {
      return {
        status: false,
        message: `Classroom "${data.classname}" for academic year "$data.{academic_year}" already exists.`,
      };
    }
    const result = await roomModel.createRoom(data);
    return {
      status: true,
      data: result
    }
  } catch (error: any) {
    throw error.message ? error.message : error
  }
}
const updateRoomController = async (data: IUpdateRoom) => {
  try {
    const checkRoom = await roomModel.checkCreateRoomAlready(data);
    if ((checkRoom as any[]).length > 0) {
      return {
        status: false,
        message: `Classroom "${data.classname}" for academic year "$data.{academic_year}" already exists.`,
      };
    }
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
    return result
  } catch (error: any) {
    throw error.message ? error.message : error
  }
}
const addStudentInRoomController = async (data: IUpdateStudentInRoom) => {
  try {
    const studentRows: any = await roomModel.findLevelnameByIdStudent(data.studentid)
    if (studentRows.length === 0) {
      return {
        status: false,
        data: { message: 'Student not found.' }
      }
    }
    const classroomRows: any = await roomModel.findClassnameById(data.classroomid)
    if (classroomRows.length === 0) {
      return {
        status: false,
        data: { message: 'Classroom not found.' }
      };
    }
    const studentGradelevel = studentRows[0].levelname;
    const classname = classroomRows[0].classname;
    const classroomGradelevel = classname.substring(0, 3);
    if (studentGradelevel !== classroomGradelevel) {
      return {
        status: false,
        data: { message: 'Student grade level does not match classroom grade level.' }
      };
    }
    const checkStudentInRoom: any = await roomModel.checkStudentInRoom(data)
    if ((checkStudentInRoom as any[]).length > 0) {
      return {
        status: false,
        data: { message: 'Student is already in the classroom.' },
      };
    }
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