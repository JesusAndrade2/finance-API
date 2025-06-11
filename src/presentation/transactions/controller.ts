import { Request, Response } from 'express';
import { handleError } from '../common/handleError';
import { SendTransactionService } from './services/send-transactions.service';
import { FinderTransactionsService } from './services/find-transactions.service';
import { AddFoundsService } from './services/add-founds.service';
import { AddFoundsDto, SendTransactionDto } from '../../domain';

export class TransactionsController {
  constructor(
    private readonly sendTransactionService: SendTransactionService,
    private readonly finderTransactionService: FinderTransactionsService,
    private readonly addFoundsService: AddFoundsService
  ) {}

  addFounds = (req: Request, res: Response) => {
    const [error, data] = AddFoundsDto.execute(req.body);

    if (error) {
      return res.status(422).json({
        status: 'validate error',
        message: error,
      });
    }
    this.addFoundsService
      .execute(req.sessionUser!, data!)
      .then((result) => res.status(200).json(result))
      .catch((error) => handleError(error, res));
  };

  sendTransaction = (req: Request, res: Response) => {
    const [error, data] = SendTransactionDto.execute(req.body);

    if (error) {
      return res.status(422).json({
        status: 'validate error',
        message: error,
      });
    }
    this.sendTransactionService
      .execute(req.sessionUser!, data!)
      .then((result) => res.status(201).json(result))
      .catch((error) => handleError(error, res));
  };

  findAllTransactions = (req: Request, res: Response) => {
    this.finderTransactionService
      .executeByFindAll()
      .then((result) => res.status(200).json(result))
      .catch((error) => handleError(error, res));
  };

  findOneTransaction = (req: Request, res: Response) => {
    const { id } = req.params;
    this.finderTransactionService
      .executeByFindOne(id)
      .then((result) => res.status(200).json(result))
      .catch((error) => handleError(error, res));
  };
}
