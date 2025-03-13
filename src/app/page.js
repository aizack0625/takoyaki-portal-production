'use client';

import { ReviewCard } from "./components/ReviewCard";
import { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  getFirestore,
  doc,
  getDoc,
  startAfter,
} from "firebase/firestore";
import { app } from './firebase/config';
import { useAuth } from "./contexts/AuthContext";

export default function Home() {
  const [reviews, setReviews] = useState([]); // レビュー取得状態の管理
  const [loading, setLoading] = useState(true); // データロード中の状態管理
  const { user } = useAuth();
  const [loadingMore, setLoadingMore] = useState(false) // 追加データロード中の状態
  const [lastVisible, setLastVisible] = useState(null) // ページネーション用の最後のドキュメント
  const [noMoreReviews, setNoMoreReviews] = useState(false) // 追加のレビューがない状態を管理

  // 非同期関数でレビューを取得する関数をより広いスコープで定義
  const fetchReviews = async () => {
    try {
      setLoading(true);
      // Firebase Firestore インスタンスを取得
      const db = getFirestore(app);
      // Firestoreのreviewsコレクションから、作成日順に最大5件を取得するクエリを作成
      const q = query(
        collection(db, 'reviews'),
        orderBy('createdAt', 'desc'),
        limit(5)
      );

      // クエリを実行しレビューを取得
      const querySnapshot = await getDocs(q);

      // 最後のドキュメントを保存（次のページネーション用）
      if (!querySnapshot.empty) {
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      } else {
        setNoMoreReviews(true);
      }

      // 書くレビューを整形し、配列にまとめる
      const reviewsData = await Promise.all(querySnapshot.docs.map(async (docSnapshot) => {
        const data = docSnapshot.data(); // ドキュメントのデータを取得

        // 店舗情報を取得
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
          userName: data.userName,
          date: data.createdAt?.toDate().toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          }).replace(/\//g, '.'), // スラッシュをドットに変換
          shopName: shopName,
          shopId: data.shopId,
          rating: data.rating,
          content: data.content,
          userId: data.userId,
          likes: data.likes || 0,
          likedBy: data.likedBy || [],
          userAvatarUrl: data.userAvatarUrl
        }
      }));

      // 整形したレビューのデータを状態にセット
      setReviews(reviewsData);
      setLoading(false);
    } catch (error) {
      // エラーハンドリング
      console.error('レビュー取得エラー：', error);
    } finally {
      // ローディング状態をfalseに設定（データ取得が完了）
      setLoading(false);
    }
  };

  // 追加のレビューを取得する関数
  const fetchMoreReviews = async () => {
    if (!lastVisible || loadingMore || noMoreReviews) return;

    try {
      setLoadingMore(true);
      const db = getFirestore(app);

      // 最後に取得したドキュメント以降から5件を取得
      const q = query(
        collection(db, 'reviews'),
        orderBy('createdAt', 'desc'),
        startAfter(lastVisible),
        limit(5)
      );

      const querySnapshot = await getDocs(q);

      // 取得結果が空ならこれ以上レビューがないとマーク
      if (querySnapshot.empty) {
        setNoMoreReviews(true);
        return;
      }

      // 新しい最後のドキュメントを保存
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);

      // 追加のレビューデータを整形
      const moreReviewsData = await Promise.all(querySnapshot.docs.map(async (docSnapshot) => {
        const data = docSnapshot.data();

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
          userName: data.userName,
          date: data.createdAt?.toDate().toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          }).replace(/\//g, '.'),
          shopName: shopName,
          shopId: data.shopId,
          rating: data.rating,
          content: data.content,
          userId: data.userId,
          userAvatarUrl: data.userAvatarUrl
        }
      }));

      // 既存のレビューに追加レビューを結合
      setReviews(prevReviews => [...prevReviews, ...moreReviewsData]);
    } catch (error) {
      console.error('追加レビュー取得エラー：', error);
    } finally {
      setLoadingMore(false);
    }
  };

  // コンポーネントがレンダリングされた後に実行される副作用処理
  useEffect(() => {
    // 初回レビューを非同期で取得
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
          reviews.map((review) => {
            // 投稿者のアイコンを使用(投稿者のアイコンがない場合はデフォルト)
            const avatarUrl = review.userAvatarUrl || '/default-user-icon.png';

            return (
              <ReviewCard
                key={review.id}
                id={review.id}
                userName={review.userName}
                date={review.date}
                shopName={review.shopName}
                shopId={review.shopId}
                rating={review.rating}
                content={review.content}
                likes={review.likes || 0}
                likedBy={review.likedBy || []}
                avatarUrl={avatarUrl}
                onLikeToggle={() => fetchMoreReviews()} // いいねが変更されたら口コミを再読み込み
              />
            );
          })
        ) : (
          <p className="text-center text-gray-500 py-4">
            まだ口コミはありません
          </p>
        )}
      </div>

      {!noMoreReviews && (
        <div className="text-center mt-8">
          <button
            className="px-8 py-2 bg-[#83BC87] text-white rounded-full disabled:opacity-50"
            onClick={fetchMoreReviews}
            disabled={loadingMore}
          >
            {loadingMore ? '読み込み中...' : 'もっと見る'}
          </button>
        </div>
      )}
    </main>
  );
}

