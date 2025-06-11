import { Transaction, User } from '../../../data';
import { CustomError, SendTransactionDto } from '../../../domain';

export class SendTransactionService {
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
      // this.sendLinktoEmailFromValidationAcoount(data.email);
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
}

// import { encryptAdapter, JwtAdapter } from '../../../config';
// import { User } from '../../../data';
// import { CustomError, RegisterUserDto } from '../../../domain';
// import { EmailService } from '../../common/services/email.service';

// export class RegisterUserService {
//   constructor(private readonly emailService: EmailService) {}

//   public validateAccount = async (token: string) => {
//     const payload = await this.validateToken(token);

//     const { email } = payload as { email: string };

//     if (!email) {
//       throw CustomError.internalServerError('email is not found in token');
//     }

//     const user = await this.ensureUserExistWithEmail(email);

//     user.status = true;

//     try {
//       await user.save();
//       return {
//         user: {
//           id: user.id,
//           name: user.name,
//           email: user.email,
//           balance: user.balance,
//           number_account: user.account_number,
//           status: user.status,
//           created_at: user.created_at,
//         },
//       };
//     } catch (error) {
//       throw CustomError.internalServerError('something went very wrong');
//     }
//   };

//   private sendLinktoEmailFromValidationAcoount = async (email: string) => {
//     const token = await JwtAdapter.generateToken({ email }, '600s');
//     if (!token) throw CustomError.internalServerError('error getting token');

//     const link = `http://www.localhost:3000/api/v1/auth/validate-account/${token}`;
//     console.log(link);

//     const html = `
//     <h1>validate your email</h1>
//     <p>Clic on the following link to validate your email </p>
//     <a href="${link}" > Validate your email : ${email} </a>`;

//     const isSent = await this.emailService.sendEmail({
//       to: email,
//       subject: 'validate your account',
//       htmlBody: html,
//     });

//     if (!isSent) throw CustomError.internalServerError('error sending email');

//     return true;
//   };

//   private async ensureUserExistWithEmail(email: string) {
//     const user = await User.findOne({
//       where: {
//         email,
//       },
//     });

//     if (!user) {
//       throw CustomError.internalServerError('email no registered in db');
//     }
//     return user;
//   }

//   private async ensureUserHaveAnEmail(email: string) {
//     const user = await User.findOne({
//       where: {
//         email,
//       },
//     });

//     if (user) {
//       return true;
//     } else {
//       return false;
//     }
//   }

//   private async validateToken(token: string) {
//     const payload = await JwtAdapter.validateToken(token);
//     if (!payload) throw CustomError.badRequest('invalid email token');
//     return payload;
//   }

//   async execute(data: RegisterUserDto) {
//     const userExist = await this.ensureUserHaveAnEmail(data.email);

//     if (userExist) {
//       throw CustomError.conflict('Email is already registered');
//     }

//     const user = new User();
//     user.name = data.name;
//     user.email = data.email;
//     user.password = encryptAdapter.hash(data.password);
//     user.account_number = this.generateAccountNumber();

//     try {
//       await user.save();
//       this.sendLinktoEmailFromValidationAcoount(data.email);
//       return {
//         message: 'user create succesfully 👌',
//       };
//     } catch (error) {
//       throw CustomError.internalServerError('failed to register user');
//     }
//   }

//   private generateAccountNumber = () => {
//     const timestamp = Date.now().toString().slice(-8);
//     const randomDigits = Math.floor(100000 + Math.random() * 900000).toString();
//     return timestamp + randomDigits;
//   };
// }
