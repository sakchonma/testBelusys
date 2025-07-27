import db from '../config/db';
import {
  ISudentList,
  ISudentCreate,
  IStudentUpdate
} from '../type/student';


const listStudentBySearch = async ({
  page = 1,
  limit = 10,
  studentid = '',
  name = '',
  gradelevelid = '',
}: ISudentList) => {
  try {
    const offset = (page - 1) * limit;

    const pool = db.getPool();
    const [rows] = await pool.query(
      `SELECT 
      s.*,
      g.levelname,
      p.prefixname,
      gd.gendername
   FROM student s
   LEFT JOIN gradelevel g ON s.gradelevelid = g.gradelevelid
   LEFT JOIN prefix p ON s.prefixid = p.prefixid
   LEFT JOIN gender gd ON s.genderid = gd.genderid
   WHERE 
     (? = '' OR s.studentid = ?) AND
     (? = '' OR s.gradelevelid = ?) AND
     (? = '' OR s.firstname LIKE ? OR s.lastname LIKE ?)
   LIMIT ? OFFSET ?`,
      [
        studentid, studentid,
        gradelevelid, gradelevelid,
        name, `%${name}%`, `%${name}%`,
        +limit, +offset
      ]
    );

    return rows;
  } catch (error) {
    console.error('DB error:', error);
    throw error;
  }


};
const createStudent = async (data: ISudentCreate) => {
  try {
    const {
      prefixid,
      firstname,
      lastname,
      genderid,
      birthdate,
      gradelevelid,
    } = data;

    const pool = db.getPool();
    const [result]: any = await pool.query(
      `INSERT INTO student (prefixid, firstname, lastname, genderid, birthdate, gradelevelid) VALUES (?, ?, ?, ?, ?, ?)`,
      [prefixid, firstname, lastname, genderid, birthdate, gradelevelid]
    );

    return {
      studentid: result.insertId,
    };
  } catch (error) {
    console.error('DB error:', error);
    throw error;
  }


}
const updateStudent = async (data: IStudentUpdate) => {
  try {
    const {
      studentid,
      prefixid,
      firstname,
      lastname,
      genderid,
      birthdate,
      gradelevelid,
    } = data;

    const updates: string[] = [];
    const values: any[] = [];

    if (prefixid !== undefined) {
      updates.push("prefixid = ?");
      values.push(prefixid);
    }

    if (firstname !== undefined) {
      updates.push("firstname = ?");
      values.push(firstname);
    }

    if (lastname !== undefined) {
      updates.push("lastname = ?");
      values.push(lastname);
    }

    if (genderid !== undefined) {
      updates.push("genderid = ?");
      values.push(genderid);
    }

    if (birthdate !== undefined) {
      updates.push("birthdate = ?");
      values.push(birthdate);
    }

    if (gradelevelid !== undefined) {
      updates.push("gradelevelid = ?");
      values.push(gradelevelid);
    }

    if (updates.length === 0) {
      throw new Error("No fields provided to update.");
    }

    values.push(studentid);

    const sql = `UPDATE student SET ${updates.join(", ")} WHERE studentid = ?`;

    const pool = db.getPool();
    const [result]: any = await pool.query(sql, values);
    return result

  } catch (error) {
    console.error('DB error:', error);
    throw error;
  }


}
const deleteStudent = async (studentid: number) => {
  try {
    const pool = db.getPool();

    const [exists]: any = await pool.query(
      `SELECT COUNT(*) AS count FROM student_classroom WHERE studentid = ?`,
      [studentid]
    );

    if (exists[0].count > 0) {
      return {
        status: false,
        message: 'Cannot delete student because they are assigned to a classroom.',
      };
    }

    const [result]: any = await pool.query(
      `DELETE FROM student WHERE studentid = ?`,
      [studentid]
    );

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
    throw {
      status: false,
      message: error.message || 'Error deleting student',
    };
  }
}

const getGenders = async () => {
  try {
    const pool = db.getPool();
    const [rows] = await pool.query(`SELECT * FROM gender`,);
    return rows;
  } catch (error) {
    console.error('DB error:', error);
    throw error;
  }
}
const getRooms = async () => {
  try {
    const pool = db.getPool();
    const [rows] = await pool.query(`SELECT * FROM classroom`,);
    return rows;
  } catch (error) {
    console.error('DB error:', error);
    throw error;
  }
}
const getGradelevels = async () => {
  try {
    const pool = db.getPool();
    const [rows] = await pool.query(`SELECT * FROM gradelevel`,);
    return rows;
  } catch (error) {
    console.error('DB error:', error);
    throw error;
  }
}
const prefixs = async () => {
  try {
    const pool = db.getPool();
    const [rows] = await pool.query(`SELECT * FROM prefix`,);
    return rows;
  } catch (error) {
    console.error('DB error:', error);
    throw error;
  }
}
export default {
  listStudentBySearch,
  createStudent,
  updateStudent,
  deleteStudent,
  getGenders,
  getRooms,
  getGradelevels,
  prefixs,
}
