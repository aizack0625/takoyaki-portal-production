'use client';

import { ReviewCard } from "./components/ReviewCard";
import { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  getFirestore
} from "firebase/firestore";
import { app } from './firebase/config';

export default function Home() {
  const [reviews, setReviews] = useState([]); // レビュー取得状態の管理
  const [loading, setLoading] = useState(true); // データロード中の状態管理

  // コンポーネントがレンダリングされた後に実行される副作用処理
  useEffect(() => {
    // 非同期関数でレビューを取得
    const fetchReviews = async () => {
      try {
        // Firebase Firestore インスタンスを取得
        const db = getFirestore(app);
        // Firestoreのreviewsコレクションから、作成日順に最大５件を取得するクエリを作成
        const q = query(
          collection(db, 'reviews'),
          orderBy('createdAt', 'desc'),
          limit(5)
        );

        // クエリを実行しレビューを取得
        const querySnapshot = await getDocs(q);
        // 各レビューを整形し、配列にまとめる
        const reviewsData = await Promise.all(querySnapshot.docs.map(async (doc) => {
          const data = doc.data(); // ドキュメントのデータを取得
          return {
            id: doc.id,
            userName: data.userName,
            date: data.createdAt?.toDate().toLocaleDateString('ja-JP', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit'
            }).replace(/\//g, '.'), // スラッシュをドットに変換
            shopName: data.shopName,
            shopId: data.shopId,
            rating: data.rating,
            content: data.content
          }
        }));

        // 整形したレビューのデータを状態にセット
        setReviews(reviewsData);
      } catch (error){
        // エラーハンドリング
        console.error('レビュー取得エラー：', error);
      } finally {
        // ローディング状態をfalseに設定（データ取得が完了）
        setLoading(false);
      }
    };

    // レビューを非同期で取得
    fetchReviews();
  }, []); // 空の依存配列なので、最初のレンダリング時に１度だけ実行

  // ロード中の画面表示
  if (loading) {
    return (
      <main className="container mx-auto px-4 pb-20">
        <h2 className="text-xl font-bold my-6">新着たこ活</h2>
        <div className="text-center py-8">
          読み込み中...
        </div>
      </main>
    )
  }

return (
    <main className="container mx-auto px-4 pb-20">
      <h2 className="text-xl font-bold my-6">新着たこ活</h2>
      <div className="space-y-4">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <ReviewCard key={review.id} {...review} />
          ))
        ) : (
          <p className="text-center text-gray-500 py-4">
            まだ口コミはありません
          </p>
        )}
      </div>
      <div className="text-center mt-8">
        <button className="px-8 py-2 bg-[#83BC87] text-white rounded-full">
          もっと見る
        </button>
      </div>
    </main>
  );
}

