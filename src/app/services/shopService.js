// Firebase関連のインポート
import {
  getFirestore, // インスタンスを取得
  collection, // コレクション（データのグループ）を取得
  getDocs, // コレクション内のすべてのドキュメントを取得
  addDoc, // コレクションに新しいドキュメントを追加
  doc, // 特定のドキュメントを参照
  getDoc, // 特定のドキュメントを取得
  query, // クエリを作成
  orderBy, // クエリの結果を特定のフィールド順に並べ替え
  limit, // クエリの取得数を制限
  where, // Firestoreからデータを検索
  getCountFromServer, // ドキュメント数を取得
} from "firebase/firestore";
import { app } from '../firebase/config';

// Firestoreインスタンスの初期化
const db = getFirestore(app);

/**
 * 新しい店舗を取得する
 *  @param {Object} shopData - 店舗データ
 *  @returns {Promise<string>} - 作成された店舗のID
 */
export const registerShop = async (shopData) => {
  try {
    // ビジネスロジックを追加（例：営業時間の文字列変換）
    const processedData = {
      ...shopData,
      // 営業時間を文字列に変換（例：12:00~18:00)
      businessHours: shopData.businessHours
        .filter(hour => hour.start && hour.end) // 空の営業時間をフィルタリング
        .map(hour => `${hour.start}~${hour.end}`)
        .join(', '),
      // レビュー数とお気に入り数の初期値を設定
      reviews: 0,
      likes: 0,
      // エリア情報を作成（都道府県＋市区町村）
      area: `${shopData.prefecture}${shopData.city}`,
      // 登録日時を追加
      createdAt: new Date(),
      rating: 0, // 初期値はゼロ
    };

    // Firestoreに登録
    const docRef = await addDoc(collection(db, 'shops'), processedData);
    return docRef.id;
  } catch (error) {
    console.error('店舗登録エラー：', error);
    throw error;
  }
};

/**
 * すべての店舗を取得する
 * @returns {Promise<Array>} - 店舗データの配列
 */
export const getAllShops = async () => {
  try {
    const shopsSnapshot = await getDocs(collection(db, 'shops'));
    const shops = [];

    for (const doc of shopsSnapshot.docs) {
      const shopData = doc.data();
      // レビュー数を取得
      const reviewsQuery = query(collection(db, 'reviews'), where('shopId', '==', doc.id));
      const reviewsSnapshot = await getCountFromServer(reviewsQuery);
      const reviewCount = reviewsSnapshot.data().count;

      shops.push({
        id: doc.id,
        ...shopData,
        reviews: reviewCount
      });
    }

    return shops;
  } catch (error) {
    console.error('店舗取得エラー：', error);
    throw error;
  }
};

/**
 * 店舗IDから店舗情報を取得する
 * @param {string} shopId - 店舗ID
 * @returns {Promise<Object>} - 店舗データ
 */
export const getShopById = async (shopId) => {
  try {
    const shopDoc = await getDoc(doc(db, 'shops', shopId));
    if (shopDoc.exists()){
      const shopData = shopDoc.data();

      // レビュー数を取得
      const reviewsQuery = query(collection(db, 'reviews'), where('shopId', '==', shopId));
      const reviewsSnapshot = await getCountFromServer(reviewsQuery);
      const reviewCount = reviewsSnapshot.data().count;

      // businessHoursがマップ型の場合は処理する
      let processedShop = {
        id: shopDoc.id,
        ...shopData,
        reviews: reviewCount
      };

      return processedShop;
    } else {
      throw new Error('店舗が見つかりません');
    }
  } catch (error) {
    console.error('店舗取得エラー：', error);
    throw error;
  }
};

/**
 * おすすめ店舗を取得する（最新の登録店舗）
 * @param {number} limitCount - 取得する店舗数
 * @returns {Promise<Array>} - おすすめ店舗の配列
 */
export const getRecommendedShops = async (limitCount = 5) => {
  try {
    const q = query(
      collection(db, 'shops'),
      orderBy('createdAt', 'desc'), // 最新の登録順
      limit(limitCount)
    );

    const shopsSnapshot = await getDocs(q);
    const shops = [];

    for (const doc of shopsSnapshot.docs) {
      const shopData = doc.data();
      // レビュー数を取得
      const reviewsQuery = query(collection(db, 'reviews'), where('shopId', '==', doc.id));
      const reviewsSnapshot = await getCountFromServer(reviewsQuery);
      const reviewCount = reviewsSnapshot.data().count;

      // お気に入り数を取得
      const favoritesQuery = query(collection(db, 'favorites'), where('shopId', '==', doc.id));
      const favoritesSnapshot = await getCountFromServer(favoritesQuery);
      const likesCount = favoritesSnapshot.data().count;

      shops.push({
        id: doc.id,
        ...shopData,
        reviews: reviewCount,
        likes: likesCount // 実際のお気に入り数で上書き
      });
    }

    return shops;
  } catch (error) {
    console.error('おすすめ店舗取得エラー：', error);
    throw error;
  }
};
