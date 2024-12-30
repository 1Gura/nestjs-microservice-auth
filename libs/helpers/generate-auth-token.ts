import * as jwt from 'jsonwebtoken';

export async function generateAuthToken(userId: string): Promise<string> {
  const secret = process.env.JWT_SECRET || 'your_jwt_secret';
  return jwt.sign({ userId }, secret, { expiresIn: '1h' });
}
