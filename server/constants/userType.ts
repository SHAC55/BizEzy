export const safeUserSelect = {
  id: true,
<<<<<<< HEAD
  email: true,
  verified: true,
  createdAt: true,
  updatedAt: true,
=======
  name: true, // username
  mobile: true, // mobile number
  email: true,
  provider: true,
  verified: true,
  createdAt: true,
  updatedAt: true,

  business: {
    select: {
      id: true,
      name: true,
      gstNumber: true,
      address: true,
      createdAt: true,
    },
  },
>>>>>>> dev
} as const;
