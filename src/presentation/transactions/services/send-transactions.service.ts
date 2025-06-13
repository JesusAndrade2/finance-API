import { compilatedTransaction } from '../../../config';
import { Transaction, User } from '../../../data';
import { CustomError, SendTransactionDto } from '../../../domain';
import { EmailService } from '../../common/services/email.service';

export class SendTransactionService {
  constructor(private readonly emailService: EmailService) {}
  async execute(user: User, data: SendTransactionDto) {
    const userReceiver = await this.ensureUserExistWithAccount_number(
      data.account_number
    );
    if (data.balance > +user.balance) {
      throw CustomError.badRequest('insufficient founds');
    }

    const newBalance = +userReceiver.balance + data.balance;
    const BalanceSender = +user.balance - data.balance;
    const transaction = new Transaction();

    transaction.balance = data.balance;
    transaction.sender = user;
    transaction.receiver = userReceiver;
    userReceiver.balance = newBalance;
    user.balance = BalanceSender;

    try {
      await transaction.save();
      await userReceiver.save();
      await user.save();
      await this.sendTransferConfirmation(
        userReceiver,
        'receiver',
        data.balance,
        userReceiver.account_number,
        user.id
      );
      await this.sendTransferConfirmation(
        user,
        'sender',
        data.balance,
        userReceiver.account_number,
        user.id
      );
      return {
        message: 'transaction sent succesffuly',
        balance: transaction.balance,
        sent_by: user.id,
        account_number_receiver: userReceiver.account_number,
      };
    } catch (error) {
      throw CustomError.internalServerError('something went very wrong!');
    }
  }

  private async ensureUserExistWithAccount_number(account_number: string) {
    const user = await User.findOne({
      where: {
        account_number,
        status: true,
      },
    });

    if (!user) {
      throw CustomError.notFound('user no registered in db');
    }
    return user;
  }

  private sendTransferConfirmation = async (
    user: User,
    status: string,
    balance: number,
    accountReceiver: string,
    idsender: string
  ) => {
    const html = compilatedTransaction({
      name: user.name,
      id: idsender,
      balance,
      accountNumber: accountReceiver,
      status,
    });

    const isSent = await this.emailService.sendEmail({
      to: user.email,
      subject: 'Finance App',
      htmlBody: html,
    });

    if (!isSent) throw CustomError.internalServerError('error sending email');

    return true;
  };
}
