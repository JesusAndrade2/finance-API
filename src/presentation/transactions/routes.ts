import { Router } from 'express';
import { TransactionsController } from './controller';
import { SendTransactionService } from './services/send-transactions.service';
import { FinderTransactionsService } from './services/find-transactions.service';
import { AddFoundsService } from './services/add-founds.service';
import { envs } from '../../config';
import { EmailService } from '../common/services/email.service';

export class TransactionsRoutes {
  static get routes(): Router {
    const router = Router();

    const emailService = new EmailService(
      envs.MAYLER_SERVICE,
      envs.MAYLER_EMAIL,
      envs.MAYLER_SECRET_KEY,
      envs.SEND_MAIL
    );

    const sendTransactionService = new SendTransactionService(emailService);
    const finderTransactionService = new FinderTransactionsService();
    const addFoundsService = new AddFoundsService(emailService);

    const controller = new TransactionsController(
      sendTransactionService,
      finderTransactionService,
      addFoundsService
    );

    router.patch('/', controller.addFounds);
    router.post('/', controller.sendTransaction);
    router.get('/', controller.findAllTransactions);
    router.get('/:id', controller.findOneTransaction);

    return router;
  }
}
