<<<<<<< HEAD
import { prisma } from "../config/db";
import { NOT_FOUND, OK } from "../constants/http";
=======
import { z } from "zod";
import { prisma } from "../config/db";
import { CONFLICT, NOT_FOUND, OK } from "../constants/http";
>>>>>>> dev
import { safeUserSelect } from "../constants/userType";
import appAssert from "../utils/appAssert";
import catchErrors from "../utils/catchErrors";

export const getUserHandler = catchErrors(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.userId,
    },
  });
  appAssert(user, NOT_FOUND, "user not found");
<<<<<<< HEAD

=======
>>>>>>> dev
  const safeUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: safeUserSelect,
  });
  return res.status(OK).json(safeUser);
});
<<<<<<< HEAD
=======

const updateUserSchema = z.object({
  name: z.string().trim().min(1).max(255).optional(),
  email: z.string().trim().email().optional().or(z.literal("")),
  mobile: z.string().trim().min(10).max(15).optional(),
});

export const updateUserHandler = catchErrors(async (req, res) => {
  const request = updateUserSchema.parse(req.body);

  try {
    const updatedUser = await prisma.user.update({
      where: { id: req.userId },
      data: {
        ...(request.name !== undefined && { name: request.name }),
        ...(request.email !== undefined && { email: request.email || null }),
        ...(request.mobile !== undefined && { mobile: request.mobile }),
      },
      select: safeUserSelect,
    });
    return res.status(OK).json({ message: "user updated", user: updatedUser });
  } catch (error: any) {
    if (error.code === "P2002") {
      const target = error.meta?.target?.[0] || "field";
      appAssert(false, CONFLICT, `The ${target} is already in use by another account.`);
    }
    throw error;
  }
});

>>>>>>> dev
