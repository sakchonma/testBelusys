import express from "express"
import {
  getStudentList,
  createStudentSchema,
  createStudent,
  updateStudentSchema,
  updateStudent,
  deleteStudent,
  getDetailForInsertStudent,
} from '../controllers/student';
const router = express.Router()

router.get('/list', getStudentList)
router.post('/create', createStudentSchema, createStudent)
router.put('/update', updateStudentSchema, updateStudent)
router.delete('/delete/:studentid', deleteStudent)
router.get('/datainsert', getDetailForInsertStudent)
export default router