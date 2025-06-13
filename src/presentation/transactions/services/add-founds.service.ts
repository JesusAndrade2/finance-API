import { compilatedAddFounds } from '../../../config';
import { User } from '../../../data';
import { AddFoundsDto, CustomError } from '../../../domain';
import { EmailService } from '../../common/services/email.service';

export class AddFoundsService {
  constructor(private readonly emailService: EmailService) {}
  async execute(user: User, data: AddFoundsDto) {
    const newBalance = +user.balance + data.balance;

    user.balance = newBalance;

    try {
      await user.save();
      await this.sendAddFoundsConfirmation(
        user.email,
        user.name,
        data.balance,
        newBalance
      );
      return {
        message: 'Deposit succesfully',
        balance: user.balance,
      };
    } catch (error) {
      throw CustomError.internalServerError('something went very wrong!');
    }
  }

  private sendAddFoundsConfirmation = async (
    email: string,
    name: string,
    balance: number,
    newBalance: number
  ) => {
    const html = compilatedAddFounds({ name, balance, newBalance });

    const isSent = await this.emailService.sendEmail({
      to: email,
      subject: 'Finance App',
      htmlBody: html,
    });

    if (!isSent) throw CustomError.internalServerError('error sending email');

    return true;
  };
}
