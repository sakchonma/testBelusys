import { Request, Response, NextFunction, } from 'express';
import { ICreateRoom, IRoomList, IUpdateRoom, IUpdateStudentInRoom } from '../type/classroom';
import {
  getClassroomController,
  createClassroomController,
  updateRoomController,
  deleteRoomController,
  addStudentInRoomController,
  removeStudentInRoomController
} from '../services/classroom';
import validateRequest from "../middlewares/validateReq"
import Joi, { number } from 'joi';

const getRoomList = async (req: Request, res: Response) => {
  try {
    const { page, limit, roomid, name, gradelevelid } = req.query as unknown as IRoomList;
    const result = await getClassroomController({ page, limit, roomid, name, gradelevelid });
    return res.status(200).json({ status: true, ...result });
  } catch (error: any) {
    return res.status(500).json({
      status: false,
      message: error.message || error,
    });
  }
}

const createRoomSchema = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema = Joi.object({
    // prefixid: Joi.number().required(),
    name: Joi.string().required(),
    // lastname: Joi.string().required(),
    // genderid: Joi.number().required(),
    // birthdate: Joi.date().required(),
    // gradelevelid: Joi.number().required(),
  })

  validateRequest(req, next, schema)
}
const updateRoomSchema = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema = Joi.object({
    roomid: Joi.number().required(),
    name: Joi.string().required(),
    // firstname: Joi.string().required(),
    // lastname: Joi.string().required(),
    // genderid: Joi.number().required(),
    // birthdate: Joi.date().required(),
    // gradelevelid: Joi.number().required(),
  })

  validateRequest(req, next, schema)
}
const studentInRoomSchema = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema = Joi.object({
    roomid: Joi.number().required(),
    studentid: Joi.number().required(),
    // firstname: Joi.string().required(),
    // lastname: Joi.string().required(),
    // genderid: Joi.number().required(),
    // birthdate: Joi.date().required(),
    // gradelevelid: Joi.number().required(),
  })

  validateRequest(req, next, schema)
}
const createRoom = async (req: Request, res: Response) => {
  try {
    const data: ICreateRoom = req.body;
    const result = await createClassroomController(data);
    return res.status(200).json({ status: true, ...result });
  } catch (error: any) {
    return res.status(500).json({
      status: false,
      message: error.message || error,
    });
  }
}
const updateRoom = async (req: Request, res: Response) => {
  try {
    const data: IUpdateRoom = req.body;
    const result = await updateRoomController(data);
    return res.status(200).json({ ...result });
  } catch (error: any) {
    return res.status(500).json({
      status: false,
      message: error.message || error,
    });
  }
}
const deleteRoom = async (req: Request, res: Response) => {
  try {
    const { roomid } = req.params;
    const result = await deleteRoomController(+roomid);
    return res.status(200).json({ ...result });
  } catch (error: any) {
    return res.status(500).json({
      status: false,
      message: error.message || error,
    });
  }
}
const addStudentInRoom = async (req: Request, res: Response) => {
  try {
    const data: IUpdateStudentInRoom = req.body;
    const result = await addStudentInRoomController(data);
    return res.status(200).json({ status: true, ...result });
  } catch (error: any) {
    return res.status(500).json({
      status: false,
      message: error.message || error,
    });
  }
}
const removeStudentInRoom = async (req: Request, res: Response) => {
  try {
    const data: IUpdateStudentInRoom = req.body;
    const result = await removeStudentInRoomController(data);
    return res.status(200).json({ status: true, ...result });
  } catch (error: any) {
    return res.status(500).json({
      status: false,
      message: error.message || error,
    });
  }
}
export {
  getRoomList,
  createRoom,
  updateRoom,
  deleteRoom,
  addStudentInRoom,
  removeStudentInRoom,
  createRoomSchema,
  updateRoomSchema,
  studentInRoomSchema,
}