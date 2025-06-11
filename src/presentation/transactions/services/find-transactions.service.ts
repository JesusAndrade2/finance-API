import { Transaction, User } from '../../../data';
import { CustomError } from '../../../domain';

export class FinderTransactionsService {
  async executeByFindAll() {
    const transactions = await Transaction.find({
      relations: {
        receiver: true,
        sender: true,
      },
      select: {
        receiver: {
          id: true,
          name: true,
          email: true,
          status: true,
          created_at: true,
          account_number: true,
        },
        sender: {
          id: true,
          name: true,
          email: true,
          status: true,
          created_at: true,
          account_number: true,
        },
      },
    });
    return transactions;
  }

  async executeByFindOne(id: string) {
    const transaction = await Transaction.findOne({
      where: {
        id: id,
      },
      relations: {
        receiver: true,
        sender: true,
      },
      select: {
        receiver: {
          id: true,
          name: true,
          email: true,
          status: true,
          created_at: true,
          account_number: true,
        },
        sender: {
          id: true,
          name: true,
          email: true,
          status: true,
          created_at: true,
          account_number: true,
        },
      },
    });

    if (!transaction) {
      throw CustomError.notFound('transaction not found');
    }
    return transaction;
  }
}
