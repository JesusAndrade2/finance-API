import {
  maxLength,
  minLength,
  minValue,
  number,
  object,
  pipe,
  safeParse,
  string,
} from 'valibot';

export const SendTransactionSchema = object({
  account_number: pipe(
    string(' account_number must be a string'),
    minLength(14, 'account_number must be at 14 characters long'),
    maxLength(14, 'account_number must be at 14 characters long')
  ),

  balance: pipe(
    number('Invalid balance: must be a number'),
    minValue(0, 'balance cannot be negative')
  ),
});

export class SendTransactionDto {
  constructor(
    public readonly account_number: string,
    public readonly balance: number
  ) {}

  static execute(input: {
    [key: string]: any;
  }): [string?, SendTransactionDto?] {
    if (!('account_number' in input)) {
      return ['account_number is required'];
    }
    if (!('balance' in input)) {
      return ['balance is required'];
    }
    const result = safeParse(SendTransactionSchema, input);

    if (!result.success) {
      const error = result.issues[0]?.message ?? 'validation failed';
      return [error];
    }

    const { account_number, balance } = result.output as {
      account_number: string;
      balance: number;
    };

    return [undefined, new SendTransactionDto(account_number, balance)];
  }
}
