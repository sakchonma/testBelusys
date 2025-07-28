
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
    const checkDup = await studentModel.checkDuplicateName(data.firstname, data.lastname)
    console.log(checkDup)
    if (checkDup.length > 0) {
      return {
        status: false,
        message: "Student with the same firstname and lastname already exists.",
      }
    }
    const result = await studentModel.createStudent(data);
    return {
      status: true,
      data: result
    }
  } catch (error: any) {
    throw error.message ? error.message : error
  }
}
const updateStudentController = async (data: IStudentUpdate) => {
  try {
    const checkId = await studentModel.checkStudentId(data.studentid)

    if (checkId.length == 0) {
      return {
        status: false,
        message: "StudentId not found",
      }
    }
    const checkDupName = await studentModel.checkDuplicateName(data.firstname, data.lastname)
    // console.log(checkId, checkDupName, checkDupName[0].studentid, data.studentid, (checkDupName.studentid !== data.studentid))
    if (checkDupName.length > 0 && checkDupName[0].studentid !== data.studentid) {
      return {
        status: false,
        message: "Student with the same firstname and lastname already exists.",
      }
    }
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
    const checkAssigned = await studentModel.checkAssigned(studentid)
    if (checkAssigned[0].count > 0) {
      return {
        status: false,
        message: 'Cannot delete student because they are assigned to a classroom.',
      }
    }
    const result: any = await studentModel.deleteStudent(studentid);
    if (result.affectedRows > 0) {
      return {
        status: true,
        message: 'Student deleted successfully',
      };
    } else {
      return {
        status: false,
        message: 'Student not found',
      };
    }
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