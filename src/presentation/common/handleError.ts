import { Response } from 'express';
import { CustomError } from '../../domain';

export const handleError = (error: unknown, res: Response) => {
  if (error instanceof CustomError) {
    return res.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    });
  }

  return res.status(500).json({
    status: 'fail',
    message: 'something went very wrong!! please try again later',
  });
};
