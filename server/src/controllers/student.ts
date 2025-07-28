import { Request, Response, NextFunction, } from 'express';
import { ISudentList, ISudentCreate, IStudentUpdate } from '../type/student';
import {
  getStudentController,
  createStudentController,
  updateStudentController,
  deleteStudentController,
  getDetailForInsertStudentController,
} from '../services/student';
import validateRequest from "../middlewares/validateReq"
import Joi, { number } from 'joi';

const getStudentList = async (req: Request, res: Response) => {
  try {
    const { page, limit, studentid, name, gradelevelid } = req.query as unknown as ISudentList;
    const result = await getStudentController({ page, limit, studentid, name, gradelevelid });
    return res.status(200).json({ status: true, ...result });
  } catch (error: any) {
    return res.status(500).json({
      status: false,
      message: error.message || error,
    });
  }
}
const getDetailForInsertStudent = async (req: Request, res: Response) => {
  try {
    const result = await getDetailForInsertStudentController();
    return res.status(200).json({ status: true, ...result });
  } catch (error: any) {
    return res.status(500).json({
      status: false,
      message: error.message || error,
    });
  }
}
const createStudentSchema = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema = Joi.object({
    prefixid: Joi.number().required(),
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    genderid: Joi.number().required(),
    birthdate: Joi.date().required(),
    gradelevelid: Joi.number().required(),
  })

  validateRequest(req, next, schema)
}
const updateStudentSchema = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema = Joi.object({
    studentid: Joi.number().required(),
    prefixid: Joi.number().required(),
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    genderid: Joi.number().required(),
    birthdate: Joi.date().required(),
    gradelevelid: Joi.number().required(),
  })

  validateRequest(req, next, schema)
}

const createStudent = async (req: Request, res: Response) => {
  try {
    const data: ISudentCreate = req.body;
    const result = await createStudentController(data);
    return res.status(200).json({ ...result });
  } catch (error: any) {
    return res.status(500).json({
      status: false,
      message: error.message || error,
    });
  }
}
const updateStudent = async (req: Request, res: Response) => {
  try {
    const data: IStudentUpdate = req.body;
    const result = await updateStudentController(data);
    return res.status(200).json({ ...result });
  } catch (error: any) {
    return res.status(500).json({
      status: false,
      message: error.message || error,
    });
  }
}
const deleteStudent = async (req: Request, res: Response) => {
  try {
    const { studentid } = req.params;
    const result = await deleteStudentController(+studentid);
    return res.status(200).json({ ...result });
  } catch (error: any) {
    return res.status(500).json({
      status: false,
      message: error.message || error,
    });
  }
}

export {
  getStudentList,
  createStudentSchema,
  createStudent,
  updateStudentSchema,
  updateStudent,
  deleteStudent,
  getDetailForInsertStudent,
}