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

export const AddFoundsSchema = object({
  balance: pipe(
    number('Invalid balance: must be a number'),
    minValue(0, 'balance cannot be negative')
  ),
});

export class AddFoundsDto {
  constructor(public readonly balance: number) {}

  static execute(input: { [key: string]: any }): [string?, AddFoundsDto?] {
    if (!('balance' in input)) {
      return ['balance is required'];
    }
    const result = safeParse(AddFoundsSchema, input);

    if (!result.success) {
      const error = result.issues[0]?.message ?? 'validation failed';
      return [error];
    }

    const { balance } = result.output as {
      balance: number;
    };

    return [undefined, new AddFoundsDto(balance)];
  }
}
