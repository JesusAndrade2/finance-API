import { Router } from 'express';
import { UserRoutes } from './users/routes';
import { AuthMiddleware } from './common/middlewares/auth.middleware';
import { TransactionsRoutes } from './transactions/routes';

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    router.use('/api/v1/auth', UserRoutes.routes);
    router.use('/api/v1/users', UserRoutes.routes);
    router.use(
      '/api/v1/transactions',
      AuthMiddleware.protect,
      TransactionsRoutes.routes
    );

    return router;
  }
}
