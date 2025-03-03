// Firebase関連のインポート
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  updateDoc,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  orderBy,
  limit
} from "firebase/firestore";
import { app } from '../firebase/config';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Firestoreインスタンスの初期化
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

/**
 * レビューを投稿する
 * @param {Object} reviewData - レビューデーター
 * @param {string} reviewData.shopId - 店舗ID
 * @param {number} reviewData.rating - 評価 (1-5)
 * @param {string} reviewData.content - レビュー内容
 * @param {File} reviewData.imageFile - 画像ファイル（オプション)
 * @param {string} userId - ユーザーID
 * @param {string} userName - ユーザー名
 * @returns {Promise<string>} - 作成されたレビューのID
 */
export const submitReview = async (reviewData, userId, userName) => {
  try {
    // 認証状態の確認
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('レビューを投稿するにはログインが必要です。')
    }

    let imageUrl = null;

    // 画像がある場合はStorageにアップロード
    if (reviewData.imageFile) {
      const storageRef = ref(storage, `reviews/${userId}_${Date.now()}`);
      await uploadBytes(storageRef, reviewData.imageFile);
      imageUrl = await getDownloadURL(storageRef);
    }

    // Firestoreに投稿データを保存
    const reviewToSave = {
      shopId: reviewData.shopId,
      userId,
      userName,
      rating: reviewData.rating,
      content: reviewData.content,
      imageUrl,
      createdAt: serverTimestamp(),
      likes: 0,
      likedBy: [] // いいねしたユーザーのIDリスト
    };

    const docRef = await addDoc(collection(db, 'reviews'), reviewToSave);

    // 店舗のレビュー数と平均評価を更新
    await updateShopReviewStats(reviewData.shopId);

    return docRef.id;
  } catch (error) {
    console.error('レビュー投稿エラー：', error);
    throw error;
  }
};

/**
 * 店舗に紐づくレビューを取得する
 * @param {string} shopId - 店舗ID
 * @returns {Promise<Array>} - レビューデータの配列
 */
export const getReviewsByShopId = async (shopId) => {
  try {
    // クエリを作成
    const reviewsRef = collection(db, 'reviews');
    const q = query(
      reviewsRef,
      collection(db, 'reviews'),
      where('shopId', '==', shopId),
      orderBy('createdAt', 'desc')
    );

    // レビューを取得
    const reviewsSnapshot = await getDocs(q);

    // ドキュメントデータの変換処理
    return reviewsSnapshot.docs.map(doc => {
      const data = doc.data();
      // サーバータイムスタンプをJSのDateに変換してフォーマット
      const date = data.createdAt ?
        new Date(data.createdAt.seconds * 1000).toLocaleDateString('ja-Jp') :
        new Date().toLocaleDateString('ja-JP');

        return {
          id: doc.id,
          ...data,
          date
        };
    });
  } catch (error) {
    console.error('レビュー取得エラー：', error);
    throw error;
  }
};

/**
 * ユーザーが投稿したレビューを取得する
 * @param {string} userId - ユーザーID
 * @returns {Promise<Array>} - レビューデータの配列
 */
export const getReviewsByUserId = async (userId) => {
  try {
    const q = query(
      collection(db, 'reviews'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const reviewsSnapshot = await getDocs(q);
    return reviewsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().createdAt?.toDate().toLocaleDateString('ja-JP')
    }));
  } catch (error) {
    console.error('ユーザーレビュー取得エラー：', error);
    throw error;
  }
};

/**
 * レビューを削除する
 * @param {string} reviewId - レビューID
 * @param {string} shopId - 店舗ID
 * @returns {Promise<void>}
 */
export const deleteReview = async (reviewId, shopId) => {
  try {
    await deleteDoc(doc(db, 'reviews', reviewId));

    // 店舗のレビュー数と平均評価を更新
    await updateShopReviewStats(shopId);
  } catch (error) {
    console.error('レビュー削除エラー：', error);
    throw error;
  }
};

/**
 * 店舗のレビュー統計情報を更新する
 * @param {string} shopId - 店舗ID
 * @returns {Promise<void>}
 */
export const updateShopReviewStats = async (shopId) => {
  try {
    const q = query(
      collection(db, 'reviews'),
      where('shopId', '==', shopId)
    );

    const reviewsSnapshot = await getDocs(q);
    const reviews = reviewsSnapshot.docs.map(doc => doc.data());

    // レビュー数
    const reviewCount = reviews.length;

    // 平均評価（レビューがない場合は0）
    const averageRating = reviewCount > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount
      : 0;

    // 店舗情報を更新
    await updateDoc(doc(db, 'shops', shopId), {
      reviewCount,
      rating: parseFloat(averageRating.toFixed(1)) // 小数点第一いまで
    });
  } catch (error) {
    console.error('店舗レビュー統計更新エラー：', error);
    throw error;
  }
};
