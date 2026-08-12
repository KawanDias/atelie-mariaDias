// src/services/favoriteService.ts
import { db } from './firebase'; // Certifique-se de que o caminho para seu arquivo de config do Firebase está correto
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

// Nome da coleção que definimos nas Regras de Segurança
const COLLECTION_NAME = 'favoritos_usuarios';

export const favoriteService = {
  /**
   * Busca a lista de IDs dos produtos favoritos de um usuário específico.
   * @param userId O UID do usuário logado (vindo do AuthContext).
   * @returns Uma Promise com array de IDs (strings).
   */
  async getUserFavorites(userId: string): Promise<string[]> {
    if (!userId) return [];

    try {
      // Referência para o documento do usuário: favoritos_usuarios/UID_DO_USUARIO
      const docRef = doc(db, COLLECTION_NAME, userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // Retorna o array que está no campo 'productIds', ou vazio se não houver o campo
        return docSnap.data().productIds || [];
      } else {
        // Se o documento ainda não existir (primeira vez do usuário),
        // criamos ele vazio para garantir que futuros updates funcionem.
        await setDoc(docRef, { productIds: [] });
        return [];
      }
    } catch (error) {
      console.error('Erro ao buscar favoritos do Firestore:', error);
      // Retorna array vazio em caso de erro para não quebrar a tela
      return [];
    }
  },

  /**
   * Adiciona um ID de produto à lista de favoritos do usuário de forma atômica (segura).
   * @param userId O UID do usuário logado.
   * @param productId O ID do produto a ser favoritado.
   */
  async addFavorite(userId: string, productId: string): Promise<void> {
    if (!userId || !productId) return;

    try {
      const docRef = doc(db, COLLECTION_NAME, userId);
      
      // 'arrayUnion' é um comando especial do Firebase.
      // Ele adiciona o ID ao array 'productIds' APENAS se ele já não estiver lá.
      // Isso evita duplicidade e é muito rápido.
      await updateDoc(docRef, {
        productIds: arrayUnion(productId)
      });
    } catch (error) {
      // Se der erro no update (por exemplo, se o documento não existir por algum motivo),
      // tentamos usar o setDoc com merge para garantir a criação.
      console.warn('Tentando fallback para setDoc no addFavorite');
      const docRef = doc(db, COLLECTION_NAME, userId);
      await setDoc(docRef, { productIds: arrayUnion(productId) }, { merge: true });
    }
  },

  /**
   * Remove um ID de produto da lista de favoritos do usuário de forma atômica.
   * @param userId O UID do usuário logado.
   * @param productId O ID do produto a ser removido.
   */
  async removeFavorite(userId: string, productId: string): Promise<void> {
    if (!userId || !productId) return;

    try {
      const docRef = doc(db, COLLECTION_NAME, userId);
      
      // 'arrayRemove' remove todas as instâncias desse ID dentro do array 'productIds'.
      await updateDoc(docRef, {
        productIds: arrayRemove(productId)
      });
    } catch (error) {
      console.error('Erro ao remover favorito do Firestore:', error);
      // Não criamos fallback aqui, pois se não conseguir remover,
      // provavelmente o documento ou o item já não existiam.
    }
  }
};