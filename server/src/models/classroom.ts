import db from '../config/db';
import {
  IRoomList,
  ICreateRoom,
  IUpdateRoom,
  IUpdateStudentInRoom,
  IStudentsWithoutRoomList
} from '../type/classroom';


const listRoomBySearch = async ({
  page = 1,
  limit = 10,
  roomid = '',
  name = '',
  teacherName = '',
}: IRoomList) => {
  try {
    const offset = (page - 1) * limit;
    const pool = db.getPool();
    const [rows] = await pool.query(
      `SELECT classroomid, classname, academic_year, homeroom_teacher
      FROM classroom 
      WHERE (? = '' OR classroomid = ?) AND (? = '' OR classname LIKE ?) AND (? = '' OR homeroom_teacher LIKE ?)
      ORDER BY classroomid LIMIT ? OFFSET ?`,
      [roomid, roomid, name, `%${name}%`, teacherName, `%${teacherName}%`, +limit, +offset]
    );
    return rows;
  } catch (error) {
    console.error('DB error:', error);
    throw error;
  }


}
const getStudentsInClassroom = async (roomid: number) => {
  try {
    const pool = db.getPool();

    const [rows] = await pool.query(
      `
      SELECT
        s.studentid,
        p.prefixname,
        s.firstname,
        s.lastname,
        gl.levelname
      FROM student_classroom sc
      JOIN student s ON sc.studentid = s.studentid
      LEFT JOIN prefix p ON s.prefixid = p.prefixid
      LEFT JOIN gradelevel gl ON s.gradelevelid = gl.gradelevelid
      WHERE sc.classroomid = ?
      ORDER BY s.studentid
      `,
      [roomid]
    );

    return rows;
  } catch (error) {
    console.error('DB error:', error);
    throw error;
  }
}

const getStudentsWithoutClassroom = async ({
  name = '',
  gradelevel = '',
  page = 1,
  limit = 10
}: IStudentsWithoutRoomList) => {
  try {
    const pool = db.getPool();
    const offset = (page - 1) * limit;

    const searchName = `%${name}%`;
    const searchGrade = `%${gradelevel}%`;

    const [rows] = await pool.query(
      `
      SELECT
        s.studentid,
        p.prefixname,
        s.firstname,
        s.lastname,
        gl.levelname
      FROM student s
      LEFT JOIN student_classroom sc ON s.studentid = sc.studentid
      LEFT JOIN prefix p ON s.prefixid = p.prefixid
      LEFT JOIN gradelevel gl ON s.gradelevelid = gl.gradelevelid
      WHERE sc.classroomid IS NULL
        AND (? = '' OR CONCAT(s.firstname, ' ', s.lastname) LIKE ?)
        AND (? = '' OR gl.levelname LIKE ?)
      ORDER BY s.firstname, s.lastname
      LIMIT ? OFFSET ?
      `,
      [name, searchName, gradelevel, searchGrade, +limit, +offset]
    );

    return rows;
  } catch (error) {
    console.error('DB error:', error);
    throw error;
  }
};



const createRoom = async (data: ICreateRoom) => {
  try {
    const {
      classname,
      academic_year,
      homeroom_teacher,
    } = data;

    const pool = db.getPool();
    const [existing] = await pool.query(
      `SELECT classroomid FROM classroom WHERE classname = ? AND academic_year = ?`,
      [classname, academic_year]
    );

    if ((existing as any[]).length > 0) {
      throw new Error(`Classroom "${classname}" for academic year "${academic_year}" already exists.`);
    }

    const [result]: any = await pool.query(
      `INSERT INTO classroom (classname, academic_year, homeroom_teacher) VALUES (?, ?, ?)`,
      [classname, academic_year, homeroom_teacher]
    );

    return {
      classroomid: result.insertId,
    };
  } catch (error) {
    console.error('DB error:', error);
    throw error;
  }
};

const updateRoom = async (data: IUpdateRoom) => {
  try {
    const {
      classroomid,
      classname,
      academic_year,
      homeroom_teacher,
    } = data;
    const pool = db.getPool();
    const [existing] = await pool.query(
      `SELECT classroomid FROM classroom WHERE classname = ? AND academic_year = ?`,
      [classname, academic_year]
    );

    if ((existing as any[]).length > 0) {
      return {
        status: false,
        message: `Classroom "${classname}" for academic year "${academic_year}" already exists.`,
      };
    }
    const updates: string[] = [];
    const values: any[] = [];

    if (classname !== undefined) {
      updates.push("classname = ?");
      values.push(classname);
    }

    if (academic_year !== undefined) {
      updates.push("academic_year = ?");
      values.push(academic_year);
    }

    if (homeroom_teacher !== undefined) {
      updates.push("homeroom_teacher = ?");
      values.push(homeroom_teacher);
    }

    if (updates.length === 0) {
      throw new Error("No fields provided to update.");
    }

    values.push(classroomid);

    const sql = `UPDATE classroom SET ${updates.join(", ")} WHERE classroomid = ?`;

    const [result]: any = await pool.query(sql, values);
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
  } catch (error) {
    console.error('DB error:', error);
    throw error;
  }


}
const deleteRoom = async (roomid: number) => {
  try {
    const pool = db.getPool();

    const [studentsInRoom]: any = await pool.query(
      `SELECT COUNT(*) AS count FROM student_classroom WHERE classroomid = ?`,
      [roomid]
    );

    if (studentsInRoom[0].count > 0) {
      return {
        status: false,
        message: 'Cannot delete classroom because it has students assigned.',
      };
    }
    const [result]: any = await pool.query(
      `DELETE FROM classroom WHERE classroomid = ?`,
      [roomid]
    );
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
    throw {
      status: false,
      message: error.message || 'Error deleting classroom',
    };
  }
};

const addStudentInRoom = async (data: IUpdateStudentInRoom) => {
  try {
    const {
      classroomid,
      studentid,
    } = data;

    const pool = db.getPool();
    const [studentRows]: any = await pool.query(
      `SELECT gl.levelname FROM student s JOIN gradelevel gl ON s.gradelevelid = gl.gradelevelid WHERE s.studentid = ?`,
      [studentid]
    );

    if (studentRows.length === 0) {
      return {
        status: false,
        data: { message: 'Student not found.' }
      };
    }
    const studentGradelevel = studentRows[0].levelname; // เช่น "ป.1"

    // 2. ดึง classname ของ classroom
    const [classroomRows]: any = await pool.query(
      `SELECT classname FROM classroom WHERE classroomid = ?`,
      [classroomid]
    );

    if (classroomRows.length === 0) {
      return {
        status: false,
        data: { message: 'Classroom not found.' }
      };
    }
    const classname = classroomRows[0].classname;

    const classroomGradelevel = classname.substring(0, 3);

    if (studentGradelevel !== classroomGradelevel) {
      return {
        status: false,
        data: { message: 'Student grade level does not match classroom grade level.' }
      };
    }

    const [existing] = await pool.query(
      `SELECT * FROM student_classroom WHERE studentid = ? AND classroomid = ?`,
      [studentid, classroomid]
    );
    if ((existing as any[]).length > 0) {
      return {
        status: false,
        data: { message: 'Student is already in the classroom.' },
      };
    }

    await pool.query(
      `INSERT INTO student_classroom (studentid, classroomid) VALUES (?, ?)`,
      [studentid, classroomid]
    );

    return {
      status: true,
      data: { message: 'Student added to classroom.' }
    };

  } catch (error) {
    console.error('DB error:', error);
    throw {
      message: error
    };
  }
};

const removeStudentInRoom = async (data: IUpdateStudentInRoom) => {
  try {
    const {
      classroomid,
      studentid,
    } = data;

    const pool = db.getPool();

    const [result] = await pool.query(
      `DELETE FROM student_classroom WHERE studentid = ? AND classroomid = ?`,
      [studentid, classroomid]
    );

    return result

  } catch (error) {
    console.error('DB error:', error);
    throw error;
  }


}
export default {
  listRoomBySearch,
  getStudentsInClassroom,
  getStudentsWithoutClassroom,
  createRoom,
  updateRoom,
  deleteRoom,
  addStudentInRoom,
  removeStudentInRoom
};