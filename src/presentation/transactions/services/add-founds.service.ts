import { User } from '../../../data';
import { AddFoundsDto, CustomError } from '../../../domain';

export class AddFoundsService {
  async execute(user: User, data: AddFoundsDto) {
    const newBalance = +user.balance + data.balance;

    user.balance = newBalance;

    try {
      await user.save();
      // this.sendLinktoEmailFromValidationAcoount(data.email);
      return {
        message: 'Deposit succesfully',
        balance: user.balance,
      };
    } catch (error) {
      throw CustomError.internalServerError('something went very wrong!');
    }
  }
}
