import { NextFunction, Request, Response } from 'express';
import { JwtAdapter } from '../../../config';
import { User } from '../../../data';

declare global {
  namespace Express {
    interface Request {
      sessionUser?: User;
    }
  }
}

export class AuthMiddleware {
  static async protect(req: Request, res: Response, next: NextFunction) {
    let token = req.cookies.token;

    try {
      const payload = (await JwtAdapter.validateToken(token)) as { id: string };
      if (!payload) return res.status(401).json({ message: 'invalid Token ' });

      const user = await User.findOne({
        where: {
          id: payload.id,
        },
      });

      if (!user) return res.status(401).json({ message: 'invalid user' });

      req.sessionUser = user;

      next();
    } catch (error) {
      return res.status(500).json({ message: 'something went very wrong ' });
    }
  }
}
