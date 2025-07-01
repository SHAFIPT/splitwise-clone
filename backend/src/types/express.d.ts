interface User {
  userId: string;
  email: string;
}

declare global {
  namespace Express {
    interface User {
      userId: string;
      email: string;
    }

    interface Request {
      user?: User;
    }
  }
}
