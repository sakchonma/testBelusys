
import {
  ISudentList,
  ISudentCreate,
  IStudentUpdate,
} from '../type/student'
import studentModel from '../models/student';

const getStudentController = async (data: ISudentList) => {
  try {
    const rows = await studentModel.listStudentBySearch(data);
    return {
      data: rows
    }
  } catch (error: any) {
    throw error.message ? error.message : error
  }
}
const createStudentController = async (data: ISudentCreate) => {
  try {
    const result = await studentModel.createStudent(data);
    return {
      data: result
    }
  } catch (error: any) {
    throw error.message ? error.message : error
  }
}
const updateStudentController = async (data: IStudentUpdate) => {
  try {
    const result: any = await studentModel.updateStudent(data);
    if (result.affectedRows > 0) {
      return {
        status: true,
        message: 'Update successful',
      };
    } else {
      return {
        status: false,
        message: 'No record updated or student not found',
      };
    }
  } catch (error: any) {
    throw error.message ? error.message : error
  }
}
const deleteStudentController = async (studentid: number) => {
  try {
    const result: any = await studentModel.deleteStudent(studentid);
    return result
  } catch (error: any) {
    throw error.message ? error.message : error
  }
}
const getDetailForInsertStudentController = async () => {
  try {
    const rowsGender = await studentModel.getGenders();
    const rowsRoom = await studentModel.getRooms();
    const rowsGradeLevel = await studentModel.getGradelevels();
    const rowsPrefix = await studentModel.prefixs();
    return {
      data: {
        genders: rowsGender,
        rooms: rowsRoom,
        gradelevels: rowsGradeLevel,
        prefixs: rowsPrefix,
      }
    }
  } catch (error: any) {
    throw error.message ? error.message : error
  }
}
export {
  getStudentController,
  createStudentController,
  updateStudentController,
  deleteStudentController,
  getDetailForInsertStudentController
}