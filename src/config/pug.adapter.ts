import pug from 'pug';
import path from 'path';

export const compilatedRegisterUser = pug.compileFile(
  path.join(
    __dirname.replace('config', 'public'),
    'templates',
    'register-user.pug'
  )
);

export const compilatedTransaction = pug.compileFile(
  path.join(
    __dirname.replace('config', 'public'),
    'templates',
    'transaction.pug'
  )
);

export const compilatedAddFounds = pug.compileFile(
  path.join(
    __dirname.replace('config', 'public'),
    'templates',
    'add-founds.pug'
  )
);
