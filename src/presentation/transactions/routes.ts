import { Router } from 'express';
import { TransactionsController } from './controller';
import { SendTransactionService } from './services/send-transactions.service';
import { FinderTransactionsService } from './services/find-transactions.service';
import { AddFoundsService } from './services/add-founds.service';

export class TransactionsRoutes {
  static get routes(): Router {
    const router = Router();

    const sendTransactionService = new SendTransactionService();
    const finderTransactionService = new FinderTransactionsService();
    const addFoundsService = new AddFoundsService();

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
