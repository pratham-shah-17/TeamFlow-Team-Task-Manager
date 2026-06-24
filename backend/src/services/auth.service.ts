import prisma from '../config/db';
import { hashPassword, comparePassword } from '../utils/password.utils';
import { signToken } from '../utils/jwt.utils';
import { SignupInput, LoginInput } from '../validators/auth.validator';

const USER_SELECT = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
};

export async function signup(data: SignupInput) {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    const error = new Error('An account with this email already exists.');
    error.name = 'ValidationError';
    throw error;
  }

  const passwordHash = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      passwordHash,
    },
    select: USER_SELECT,
  });

  const token = signToken(user.id, user.role);

  return { user, token };
}

export async function login(data: LoginInput) {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    const error = new Error('Invalid email or password.');
    error.name = 'ValidationError';
    throw error;
  }

  const isValid = await comparePassword(data.password, user.passwordHash);

  if (!isValid) {
    const error = new Error('Invalid email or password.');
    error.name = 'ValidationError';
    throw error;
  }

  const token = signToken(user.id, user.role);

  const { passwordHash: _, ...safeUser } = user;

  return { user: safeUser, token };
}

export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: USER_SELECT,
  });

  if (!user) {
    const error = new Error('User not found.');
    error.name = 'ValidationError';
    throw error;
  }

  return user;
}
