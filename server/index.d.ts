declare global {
  namespace Express {
<<<<<<< HEAD
    interface Request {
      userId?: number;
      sessionId?: number;
=======
    interface User {
      email: string;
      name: string;
      provider: string;
    }

    interface Request {
      userId?: number;
      sessionId?: number;
      user?: User;
>>>>>>> dev
    }
  }
}

export {};
