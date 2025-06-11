import {
  email,
  minLength,
  nonEmpty,
  object,
  pipe,
  safeParse,
  string,
} from 'valibot';

export const LoginUserSchema = object({
  email: pipe(
    string('email is not format required '),
    nonEmpty('please enter your email'),
    email('the email addres is badly formatted')
  ),
  password: pipe(
    string('password is not format required'),
    nonEmpty('please enter your password'),
    minLength(8, 'password must be at least 8 characters long')
  ),
});

export class LoginUserDto {
  constructor(
    public readonly email: string,
    public readonly password: string
  ) {}

  static execute(input: { [key: string]: any }): [string?, LoginUserDto?] {
    if (!('email' in input)) {
      return ['email is required'];
    }
    if (!('password' in input)) {
      return ['password is required'];
    }

    const result = safeParse(LoginUserSchema, input);

    if (!result.success) {
      const error = result.issues[0]?.message ?? 'validation failed';
      return [error];
    }

    const { email, password } = result.output as {
      email: string;
      password: string;
    };

    return [undefined, new LoginUserDto(email, password)];
  }
}
