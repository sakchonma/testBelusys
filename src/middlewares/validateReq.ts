
import { Request, NextFunction } from 'express';
import Joi, { Schema } from 'joi';

export default async (
  req: Request,
  next: NextFunction,
  schema: Schema
) => {
  try {
    if (req.body.data) {
      const options = {
        abortEarly: false,
        allowUnknown: true,
        stripUnknown: true,
      };
      const value = await schema.validateAsync(req.body.data, options);
      req.body = value;
      next();
    } else {
      next(`Validation error: undefined`);
    }
  } catch (error: any) {
    if (error && error.details) {
      next(`Validation error: ${error.details.map((x: { message: any; }) => x.message).join(', ')}`);
    } else {
      next(`Validation error: ${error.message || error}`);
    }
  }
};
