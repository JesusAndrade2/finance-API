import { encryptAdapter, envs, JwtAdapter } from '../../../config';
import { User } from '../../../data';
import { CustomError, LoginUserDto } from '../../../domain';
import { FinderUserService } from './finder-user.service';

export class LoginUserService {
  constructor(private readonly finderUserService: FinderUserService) {}

  async execute(credentials: LoginUserDto) {
    const user = await this.ensureUserExist(credentials);

    this.ensurePasswordIsCorrect(credentials, user);

    const token = await this.generateToken(
      { id: user.id },
      envs.JWET_EXPIRE_IN
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        balance: user.balance,
        account_number: user.account_number,
      },
    };
  }

  private ensurePasswordIsCorrect(credentials: LoginUserDto, user: User) {
    const isMatch = encryptAdapter.compare(credentials.password, user.password);

    if (!isMatch) {
      throw CustomError.unAuthorized('invalid credentials');
    }
  }

  private async ensureUserExist(credentials: LoginUserDto) {
    const user = await User.findOne({
      where: { email: credentials.email, status: true },
    });

    if (!user) {
      throw CustomError.unAuthorized('invalid credentials');
    }

    return user;
  }

  private async generateToken(payload: any, duration: any) {
    const token = await JwtAdapter.generateToken(payload, duration);

    if (!token) {
      throw CustomError.internalServerError('something went very wrong!');
    }

    return token;
  }
}
