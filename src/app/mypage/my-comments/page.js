'use client';

import { useState, useEffect } from "react";
import Link from 'next/link';
import { IoArrowBack } from "react-icons/io5";
import { ReviewCard } from "../../components/ReviewCard";
import { useAuth } from '../../contexts/AuthContext';
import { getReviewByUserId, deleteReview, getReviewsByUserId } from "../../services/reviewService";

const MyComments = () => {
  const { user } = useAuth(); // ログインユーザー情報を取得
  const [userAvatarUrl, setUserAvatarUrl] = useState('/default-user-icon.png');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ユーザーアイコンを設定
  useEffect(() => {
    if (user && user.photoURL) {
      setUserAvatarUrl(user.photoURL);
    }
  }, [user]);

  // ユーザーの投稿したレビューをFirestoreから取得
  useEffect(() => {
    const fetchUserReviews = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const userReviews = await getReviewsByUserId(user.uid);
        setComments(userReviews);
        setError('');
      } catch (err) {
        console.error('レビュー取得エラー：', err);
        setError('レビューの取得に失敗しました。');
        setComments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserReviews();
  }, [user]);

  // 削除処理の関数
  const handleDelete = async (commentId) => {
    if (!confirm('この口コミを削除してもよろしいですか？')) {
      return; // キャンセルされた場合は処理終了
    }

    try {
      const commentToDelete = comments.find(comment => comment.id === commentId);
      if (!commentToDelete) return;

      // Firestoreからレビューを削除
      await deleteReview(commentId, commentToDelete.shopId);

      // ローカルの状態も更新
      setComments(comments.filter(comment => comment.id !== commentId));
    } catch (err) {
      console.error('レビュー削除エラー：', err);
      alert('レビューの削除に失敗しました。');
    }
  };

  // ロード中の表示
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl mb-14">
        <div className="flex items-center mb-6">
          <Link href="/mypage" className="flex items-center text-gray-600 hover:text-gray-800">
            <IoArrowBack className="mr-2" />
            マイページに戻る
          </Link>
        </div>
        <h1 className="text-2xl font-bold mb-6">投稿した口コミ一覧</h1>
        <div className="text-center py-8">
          口コミを読み込み中...
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl mb-14">
      {/* ヘッダー部分 */}
      <div className="flex items-center mb-6">
        <Link href="/mypage" className="flex items-center text-gray-600 hover:text-gray-800">
          <IoArrowBack className="mr-2" />
          マイページに戻る
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6">投稿した口コミ一覧</h1>

      {/* エラーメッセージがある場合は表示 */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* 口コミ一覧 */}
      <div className="space-y-6">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <ReviewCard
              key={comment.id}
              userName={comment.userName}
              date={comment.date}
              shopName={comment.shopName}
              shopId={comment.shopId}
              rating={comment.rating}
              content={comment.content}
              showDeleteButton={true}
              onDelete={() => handleDelete(comment.id)}
              avatarUrl={userAvatarUrl}
            />
          ))
        ) : (
          <p className="text-gray-500 text-center py-8">投稿した口コミはありません</p>
        )}
      </div>
    </div>
  );
};

export default MyComments;
