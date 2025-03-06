import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  deleteDoc
} from "firebase/firestore";
import { app } from '../firebase/config';

// Firestoreインスタンスの初期化
const db = getFirestore(app);

/**
 * ユーザーのお気に入り店舗を追加する
 * @param {string} userId - ユーザーID
 * @param {string} shopId - 店舗ID
 * @returns {Promise<string>} - 作成されたお気に入りのID
 */
export const addFavorite = async (userId, shopId) => {
  try {
    // すでにお気に入りに追加されているか確認
    const existingQuery = query(
      collection(db, 'favorites'),
      where('userId', '==', userId),
      where('shopId', '==', shopId)
    );
    const existingSnapshot = await getDocs(existingQuery);

    // すでに存在する場合は追加しない
    if (!existingSnapshot.empty) {
      return existingSnapshot.docs[0].id;
    }

    // お気に入りを追加
    const favoriteData = {
      userId,
      shopId,
      createdAt: new Date()
    };

    const docRef = await addDoc(collection(db, 'favorites'), favoriteData);
    return docRef.id;
  } catch (error) {
    console.error('お気に入り追加エラー：', error);
    throw error;
  }
};

/**
 * ユーザーのお気に入り店舗を削除する
 * @param {string} userId - ユーザーID
 * @param {string} shopId - 店舗ID
 * @returns {Promise<void>}
 */
export const removeFavorite = async (userId, shopId) => {
  try {
    // お気に入りを検索
    const favoriteQuery = query(
      collection(db, 'favorites'),
      where('userId', '==', userId),
      where('shopId', '==', shopId)
    );
    const favoriteSnapshot = await getDocs(favoriteQuery);

    // 該当するお気に入りがない場合
    if (favoriteSnapshot.empty) {
      return;
    }

    // お気に入りを削除
    const favoritedId = favoriteSnapshot.docs[0].id;
    await deleteDoc(doc(db, 'favorites', favoritedId));
  } catch (error) {
    console.error('お気に入り削除エラー：', error);
    throw error;
  }
};

/**
 * ユーザーの全お気に入り店舗を取得する
 * @param {string} userId - ユーザーID
 * @returns {Promise<Array>} - お気に入り店舗の配列
 */
export const getUserFavorites = async (userId) => {
  try {
    // ユーザーのお気に入りを取得
    const favoritesQuery = query(
      collection(db, 'favorites'),
      where('userId', '==', userId)
    );
    const favoritesSnapshot = await getDocs(favoritesQuery);

    // データが空の場合、空の配列を返す
    if (favoritesSnapshot.empty) {
      return [];
    }

    // お気に入りの店舗データを取得
    const favorites = await Promise.all(
      favoritesSnapshot.docs.map(async (favoriteDoc) => {
        const favoriteData = favoriteDoc.data();
        const shopDoc = await getDoc(doc(db, 'shops', favoriteData.shopId));

        if (shopDoc.exists()) {
          return {
            id: favoriteDoc.id,
            shopId: favoriteData.shopId,
            shop: {
              id: shopDoc.id,
              ...shopDoc.data()
            },
            createdAt: favoriteData.createdAt
          };
        }
        return null;
      })
    );

    // nullを除外して返す
    return favorites.filter(favorite => favorite !== null);
  } catch (error) {
    console.error('お気に入り取得エラー：', error);
    throw error;
  }
};

/**
 * ユーザーが特定の店舗をお気に入り登録しているか確認する
 * @param {string} userId - ユーザーID
 * @param {string} shopId - 店舗ID
 * @returns {Promise<boolean>} - お気に入り登録しているか
 */
export const isFavorite = async (userId, shopId) => {
  try {
    // お気に入りを検索
    const favoriteQuery = query(
      collection(db, 'favorites'),
      where('userId', '==', userId),
      where('shopId', '==', shopId)
    );
    const favoriteSnapshot = await getDocs(favoriteQuery);

    // お気に入りに登録されているかどうかを返す
    return !favoriteSnapshot.empty;
  } catch (error) {
    console.error('お気に入り確認エラー：', error);
    throw error;
  }
};
