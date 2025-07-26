import db from '../config/db';
import {
  IRoomList,
  ICreateRoom,
  IUpdateRoom,
  IUpdateStudentInRoom
} from '../type/classroom';


const listRoomBySearch = async ({
  page = 1,
  limit = 10,
  roomid = '',
  name = '',
  gradelevelid = '',
}: IRoomList) => {
  try {
    const offset = (page - 1) * limit;

    const pool = db.getPool();
    const searchName = `%${name}%`;
    const [rows] = [{}]
    //   await pool.query(
    //       `SELECT * FROM quizdev_cc.student
    //  WHERE 
    //    (? = '' OR studentid = ?) AND
    //    (? = '' OR gradelevelid = ?) AND
    //    (? = '' OR firstname LIKE ? OR lastname LIKE ?)
    //  LIMIT ? OFFSET ?`,
    //       [
    //           roomid, roomid,
    //           gradelevelid, gradelevelid,
    //           name, searchName, searchName,
    //           +limit, +offset
    //       ]
    //   );
    return rows;
  } catch (error) {
    console.error('DB error:', error);
    throw error;
  }


}
const createRoom = async (data: ICreateRoom) => {
  try {
    const {
      name,
    } = data;

    const pool = db.getPool();
    // const [result]: any = await pool.query(
    //     `INSERT INTO student (prefixid, firstname, lastname, genderid, birthdate, gradelevelid) VALUES (?, ?, ?, ?, ?, ?)`,
    //     [prefixid, firstname, lastname, genderid, birthdate, gradelevelid]
    // );

    return {
      roomid: 1,
    };
  } catch (error) {
    console.error('DB error:', error);
    throw error;
  }
}
const updateRoom = async (data: IUpdateRoom) => {
  try {


    // const sql = `UPDATE quizdev_cc.student SET ${updates.join(", ")} WHERE studentid = ?`;

    const pool = db.getPool();
    // const [result]: any = await pool.query(sql, values);
    return {}

  } catch (error) {
    console.error('DB error:', error);
    throw error;
  }


}
const deleteRoom = async (roomidid: number) => {
  try {
    const pool = db.getPool();
    const [result]: any = await pool.query(
      `DELETE FROM student WHERE studentid = ?`,
      [roomidid]
    );
    return result
  } catch (error: any) {
    throw {
      status: false,
      message: error.message || 'Error deleting student',
    };
  }
}
const addStudentInRoom = async (data: IUpdateStudentInRoom) => {
  try {


    // const sql = `UPDATE quizdev_cc.student SET ${updates.join(", ")} WHERE studentid = ?`;

    const pool = db.getPool();
    // const [result]: any = await pool.query(sql, values);
    return {}

  } catch (error) {
    console.error('DB error:', error);
    throw error;
  }


}
const removeStudentInRoom = async (data: IUpdateStudentInRoom) => {
  try {


    // const sql = `UPDATE quizdev_cc.student SET ${updates.join(", ")} WHERE studentid = ?`;

    const pool = db.getPool();
    // const [result]: any = await pool.query(sql, values);
    return {}

  } catch (error) {
    console.error('DB error:', error);
    throw error;
  }


}
export default {
  listRoomBySearch,
  createRoom,
  updateRoom,
  deleteRoom,
  addStudentInRoom,
  removeStudentInRoom
};