import express from "express"
import {
  getRoomList,
  createRoom,
  updateRoom,
  deleteRoom,
  addStudentInRoom,
  removeStudentInRoom,
  createRoomSchema,
  updateRoomSchema,
  studentInRoomSchema,
} from '../controllers/classroom';
const router = express.Router()

router.get('/list', getRoomList)
router.post('/create', createRoomSchema, createRoom)
router.put('/update', updateRoomSchema, updateRoom)
router.delete('/delete/:studentid', deleteRoom)
router.put('/add', studentInRoomSchema, addStudentInRoom)
router.put('/add', studentInRoomSchema, addStudentInRoom)

export default router