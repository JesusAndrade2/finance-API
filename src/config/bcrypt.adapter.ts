import { compareSync, genSaltSync, hashSync } from 'bcryptjs';

export const encryptAdapter = {
  hash: (password: string) => {
    const salt = genSaltSync(12);
    return hashSync(password, salt);
  },

  compare: (unHushedPassword: string, hashedPassword: string) => {
    return compareSync(unHushedPassword, hashedPassword);
  },
};
