import { doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import type { User } from '../types';
import type { User as FirebaseUser } from 'firebase/auth';

interface CreateUserDocumentData {
  name: string;
  dateOfBirth: Date;
  totalPoints: number;
  createdAt: Date;
  avatar?: string;
}

export async function createUserDocument(
  firebaseUser: FirebaseUser,
  userData?: Partial<User>
): Promise<User> {
  const user: User = {
    id: firebaseUser.uid,
    email: firebaseUser.email!,
    name: userData?.name || firebaseUser.displayName || firebaseUser.email!.split('@')[0],
    avatar: userData?.avatar,
    dateOfBirth: userData?.dateOfBirth || new Date(),
    totalPoints: userData?.totalPoints || 0,
    createdAt: userData?.createdAt || new Date(),
  };

  const userDocData: CreateUserDocumentData = {
    name: user.name,
    dateOfBirth: user.dateOfBirth,
    totalPoints: user.totalPoints,
    createdAt: user.createdAt,
  };

  if (user.avatar) {
    userDocData.avatar = user.avatar;
  }

  await setDoc(doc(db, 'users', firebaseUser.uid), userDocData);

  return user;
}