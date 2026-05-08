import bcrypt from "bcrypt";
import type { User } from "../generated/prisma/client";

export async function comparePassword(
  user: User,
  plain: string,
): Promise<boolean> {
<<<<<<< HEAD
=======
  if (!user.password) {
    return false;
  }

>>>>>>> dev
  return bcrypt.compare(plain, user.password);
}
