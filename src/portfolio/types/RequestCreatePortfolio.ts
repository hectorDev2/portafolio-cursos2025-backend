import { UserRole } from '../enum/UserRole';

export interface RequestCreatePortfolio extends Request {
  user: {
    userId: string;
    email: string;
    role: UserRole;
    name?: string;
  };
}
