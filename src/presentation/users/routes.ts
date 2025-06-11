import { Router } from 'express';
import { UserController } from './controller';
import { RegisterUserService } from './services/register-user.service';
import { EmailService } from '../common/services/email.service';
import { envs } from '../../config';
import { FinderUserService } from './services/finder-user.service';
import { LoginUserService } from './services/login-user.service';
import { AuthMiddleware } from '../common/middlewares/auth.middleware';

export class UserRoutes {
  static get routes(): Router {
    const router = Router();

    const emailService = new EmailService(
      envs.MAYLER_SERVICE,
      envs.MAYLER_EMAIL,
      envs.MAYLER_SECRET_KEY,
      envs.SEND_MAIL
    );
    const registerUserService = new RegisterUserService(emailService);
    const finderUserService = new FinderUserService();
    const loginUserService = new LoginUserService(finderUserService);

    const userController = new UserController(
      registerUserService,
      loginUserService,
      finderUserService
    );

    router.get('/validate-account/:token', userController.validateAccount);
    router.post('/register', userController.registerUser);
    router.post('/login', userController.loginUser);
    router.use(AuthMiddleware.protect);
    router.get('/me', userController.findUserAuth);

    return router;
  }
}
