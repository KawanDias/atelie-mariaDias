import { auth } from './firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from "firebase/auth";

// Função para registrar novo usuário
export const registerUser = async (email: string, pass: string) => {
  return await createUserWithEmailAndPassword(auth, email, pass);
};

// Função para fazer login
export const loginUser = async (email: string, pass: string) => {
  return await signInWithEmailAndPassword(auth, email, pass);
};

// Função para deslogar
export const logoutUser = async () => {
  return await signOut(auth);
};