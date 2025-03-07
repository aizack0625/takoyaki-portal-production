'use client';

import { ReviewCard } from "../../components/ReviewCard";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";
import { getLikedReviewsByUserId, removeLikeFromReview } from "../../services/reviewService";

const LikedComments = () => {
  const { user } = useAuth(); // ログインユーザー情報を取得
  const [userAvatarUrl, setUserAvatarUrl] = useState('/default-user-icon.png');
  const [likedReviews, setLikedReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ユーザーアイコンを設定
  useEffect(() => {
    if (user && user.photoURL) {
      setUserAvatarUrl(user.photoURL);
    }
  }, [user]);

  // いいねした口コミをFirestoreから取得
  useEffect(() => {
    // Firestoreからいいねしたレビューを取得する非同期関数
    const fetchLikedReviews = async () => {
      // ユーザーがログインしていない場合、ローディングを終了し処理を中断
      if(!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true); // データ取得開始、ローディング状態にする

        // Firestoreからユーザーがいいねした口コミを取得
        const reviews = await getLikedReviewsByUserId(user.uid);

        // 取得した口コミを'likedReviews'ステートに保存
        setLikedReviews(reviews);

        // エラーをリセット（前回エラーが発生していた場合に備える）
        setError('');
      } catch (err) {
        console.error('いいねした口コミ取得エラー：', err);
        setError('いいねした口コミの取得に失敗しました。');

        // エラー発生時はlikedReviewsを空の配列にする（UIが壊れないようにする）
        setLikedReviews([]);
      } finally {
        // データ取得が完了したのでローディングを終了
        setLoading(false);
      }
    };

    // userが変更されるたびにfetchLikedReviewsを実行
    fetchLikedReviews();
  }, [user]); // 依存配列にuserを指定、userの変更時に実行される

  // いいねを取り消す処理
  const handleUnlike = async (reviewId) => {
    // 確認ダイアログを表示し、キャンセルした場合は処理を中断
    if (!confirm('この口コミへのいいねを取り消しますか？')) {
      return;
    }

    try {
      // FirestoreでreviewIdに紐づくいいねを取り消す
      await removeLikeFromReview(reviewId);

      // UIからも即座に削除（データの再取得をせずに、現在のリストを更新）
      setLikedReviews(prevReviews =>
        prevReviews.filter(review => review.id !== reviewId)
      );
    } catch (err) {
      console.error('いいね取り消しエラー：', err);

      // エラー発生時にアラートを表示
      alert('いいねの取り消しに失敗しました。');
    }
  };

  // ローディング表示
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl mb-14">
        <div className="flex items-center mb-6">
          <Link href="/mypage" className="flex items-center text-gray-600 hover:text-gray-800">
            <IoArrowBack className="mr-2" />
            マイページに戻る
          </Link>
        </div>
        <h1 className="text-2xl font-bold mb-6">いいねした口コミ一覧</h1>
        <div className="text-center py-8">
          口コミを読み込み中...
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* ヘッダー部分 */}
      <div className="flex items-centermb-6">
        <Link href="/mypage" className="flex items-center text-gray-600 hover:text-gray-800">
          <IoArrowBack className="mr-2" />
          マイページに戻る
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6 text-gray-800">いいねした口コミ一覧</h1>

      {/* エラーメッセージがある場合は表示 */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* 口コミ一覧 */}
      <div className="space-y-6">
        {likedReviews.length > 0 ? (
          likedReviews.map((review) => (
            <ReviewCard
              key={review.id}
              id={review.id}
              userName={review.userName}
              date={review.date}
              shopName={review.shopName}
              shopId={review.shopId}
              rating={review.rating}
              content={review.content}
              likes={review.likes}
              likedBy={review.likedBy}
              showUnlikeButton={true}
              onUnlike={() => handleUnlike(review.id)}
              avatarUrl={userAvatarUrl}
            />
          ))
        ) : (
          <p className="text-center text-gray-500 py-8">いいねした口コミはありません。</p>
        )}
      </div>
    </div>
  );
};

export default LikedComments;
