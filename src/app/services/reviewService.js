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
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  orderBy,
  limit,
  getDoc,
  increment,
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
      likedBy: [], // いいねしたユーザーのIDリスト
      userAvatarUrl: currentUser.photoURL || '/default-user-icon.png' // ユーザーのアイコンURLを保存
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
    );

    const reviewsSnapshot = await getDocs(q);

    // レビューデータと店舗名を取得
    const reviews = await Promise.all(reviewsSnapshot.docs.map(async (docSnapshot) => {
      const data = docSnapshot.data();

      // 店舗情報を取得して店舗名を追加
      let shopName = '不明な店舗';
      if (data.shopId) {
        try {
          const shopDocRef = doc(db, 'shops', data.shopId);
          const shopDoc = await getDoc(shopDocRef);
          if (shopDoc.exists()) {
            shopName = shopDoc.data().name;
          }
        } catch (error) {
          console.error('店舗情報取得エラー：', error);
        }
      }

      return {
        id: docSnapshot.id,
        ...data,
        shopName,
        date: data.createdAt?.toDate().toLocaleDateString('ja-JP')
      };
    }));

    // クライアント側でソート（新しい順）
    reviews.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt.seconds * 1000) : new Date(0);
      const dateB = b.createdAt ? new Date(b.createdAt.seconds * 1000) : new Date(0);
      return dateB - dateA; // 降順（新しい順）
    })

    return reviews;
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
    // 認証状態の確認
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error ('統計情報を更新するにはログインが必要です。');
    }

    const q = query(
      collection(db, 'reviews'),
      where('shopId', '==', shopId)
    );

    const reviewsSnapshot = await getDocs(q);

    // レビューデータと店舗名を取得
    const reviews = reviewsSnapshot.docs.map(doc => doc.data());

    // レビュー数
    const reviewCount = reviews.length;

    // 平均評価（レビューがない場合は0）
    const averageRating = reviewCount > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount
      : 0;

    // 一時的な対応として、ドキュメントがなければ作成する
    try {
      // 更新を試みる
      const shopRef = doc(db, 'shops', shopId);
      await updateDoc(shopRef, {
        reviewCount,
        rating: parseFloat(averageRating.toFixed(1)) // 小数点第一位まで
      });
    } catch (error) {
      // ドキュメントが存在しない場合のエラー処理　
      console.warn('店舗ドキュメントの更新に失敗しました。ドキュメントが存在しない可能性があります。');
      // 本来はここでドキュメントを作成するロジックを入れるべきだが、
      // 今回はエラーを無視して処理を実行する
    }
  } catch (error) {
    console.error('店舗レビュー統計更新エラー：', error);
    throw error;
  }
};

/**
 * レビューにいいねを追加する
 * @param {string} reviewId - レビューID
 * @returns {Promise<void>}
 */
export const addLikeToReview = async (reviewId) => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('いいねするにはログインが必要です。');
    }

    const userId = currentUser.uid;
    const reviewRef = doc(db, 'reviews', reviewId);
    const reviewDoc = await getDoc(reviewRef);

    if (!reviewDoc.exists()) {
      throw new Error('レビューが見つかりません。');
    }

    const reviewData = reviewDoc.data();

    // すでにいいねしている場合は何もしない
    if (reviewData.likedBy && reviewData.likedBy.includes(userId)) {
      return;
    }

    // いいねユーザー配列を準備
    const likedBy = [...(reviewData.likedBy || []), userId];

    // いいねを計算
    const likes = (reviewData.likes || 0) + 1;

    // likedByとlikesだけを更新
    await updateDoc(reviewRef, {
      likes: likes,
      likedBy: likedBy
    });
  } catch (error) {
    console.error('いいね追加エラー：', error);
    throw error;
  }
};

/**
 * レビューのいいねを削除する
 * @param {string} reviewId - レビューID
 * @returns {Promise<void>}
 */
export const removeLikeFromReview = async (reviewId) => {
  try {
    // 現在ログイン中のユーザーを取得
    const currentUser = auth.currentUser;

    // ユーザーがログインしていない場合はエラーをスロー
    if (!currentUser) {
      throw new Error('いいねを取り消すにはログインが必要です。');
    }

    // ユーザーの一意のID（UID）を取得
    const userId = currentUser.uid;

    // Firestoreの"reviews"コレクションから対象のレビューを取得
    const reviewRef = doc(db, 'reviews', reviewId);
    const reviewDoc = await getDoc(reviewRef);

    // レビューが存在しない場合はエラーをスロー
    if (!reviewDoc.exists()) {
      throw new Error('レビューが見つかりません。');
    }

    // レビューデータを取得
    const reviewData = reviewDoc.data();

    // いいねしていない場合は何もしない
    if (!reviewData.likedBy || !reviewData.likedBy.includes(userId)) {
      return;
    }

    // いいねユーザー配列からユーザーIDを削除
    const likedBy = reviewData.likedBy.filter(id => id !== userId);

    // いいね数を計算（最小値は０）
    const likes = Math.max((reviewData.likes || 1) - 1, 0);

    // 既存のデータを保持しつつ、likedByとlikesだけを更新
    await updateDoc(reviewRef, {
      likes: likes,
      likedBy: likedBy
    });
  } catch (error) {
    console.error('いいね削除エラー：', error);
    throw error;
  }
};

/**
 * ユーザーがいいねしたレビューを取得する
 * @param {string} userId - いいねしたレビューを取得する対象のユーザーID
 * @returns {Promise<Array>} - いいねしたレビューデータの配列を返す
 */
export const getLikedReviewsByUserId = async (userId) => {
  try {
    // ユーザーIDが指定されていない場合はエラーをスロー
    if(!userId) {
      throw new Error('ユーザーIDが指定されていません。');
    }

    // Firestoreのreviewsコレクションから、likedBy配列にuserIdが含まれるものを検索
    const q = query(
      collection(db, 'reviews'),
      where('likedBy', 'array-contains', userId) // likedByにuserIdが含まれるものを検索
    );

    // クエリを実行し、該当するドキュメント（レビュー）を取得
    const reviewsSnapshot = await getDocs(q);

    // 取得したレビューのデータを変換し、店舗名を取得する処理を並列実行
    const reviews = await Promise.all(reviewsSnapshot.docs.map(async (docSnapshot) => {
      const data = docSnapshot.data(); // レビューのデータを取得

      // デフォルトの店舗名(店舗情報が取得できなかった場合の初期値)
      let shopName = '不明な店舗';

      // レビューにshopId(店舗ID)が存在する場合は、店舗情報を取得
      if (data.shopId) {
        try {
          const shopDocRef = doc(db, 'shops', data.shopId); // 店舗ドキュメントの参照を取得
          const shopDoc = await getDoc(shopDocRef); // 店舗情報を取得

          // 店舗情報が存在する場合は、店舗名を設定
          if (shopDoc.exists()) {
            shopName = shopDoc.data().name;
          }
        } catch (error) {
          console.error('店舗情報取得エラー：', error); // 店舗情報取得時のエラーログ
        }
      }

      // 取得したデータに店舗名とフォーマットした日付を追加して返す
      return {
        id: docSnapshot.id, // レビューのドキュメントID
        ...data, // その他のレビューのデータの展開
        shopName, // 店舗名を追加
        date: data.createdAt?.toDate().toLocaleDateString('ja-JP') // 日付を日本語の形式に変換
      };
    }));

    // クライアント側でレビューを作成日時(createdAt)の降順（新しい順）にソート
    reviews.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt.seconds * 1000) : new Date(0); // createdAtがない場合はエポック時間
      const dateB = b.createdAt ? new Date(b.createdAt.seconds * 1000) : new Date(0);
      return dateB - dateA; // 降順（新しい順）
    })

    return reviews; // 取得したレビューのリストを返す
  } catch (error) {
    console.error('いいねレビュー取得エラー：', error);
    throw error;
  }
};
