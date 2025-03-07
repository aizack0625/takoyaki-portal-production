'use client';

import Image from 'next/image';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { FaRegThumbsUp, FaRegComment, FaThumbsUp } from "react-icons/fa";
import Link from "next/link";
import { useState, useEffect } from 'react';
import { IoTrashOutline } from 'react-icons/io5';
import { useAuth } from '../contexts/AuthContext';
import { addLikeToReview, removeLikeFromReview } from '../services/reviewService';

export const ReviewCard = ({
  id,
  userName,
  date,
  shopName,
  shopId,
  rating,
  content,
  likes = 0,
  likedBy = [],
  showDeleteButton,
  onDelete,
  showUnlikeButton,
  onUnlike,
  avatarUrl = '/default-user-icon.png', // ユーザーアイコンのパスをpropsとして受け取る
  onLikeToggle,
}) => {
  const { user } = useAuth()
  const [isExpanded, setIsExpanded] = useState(false); // レビュー文字数を管理
  const [likeCount, setLikeCount] = useState(likes); // いいね数
  const [isLiked, setIsLiked] = useState(false); // ユーザーがいいねしたか
  const [isLiking, setIsLiking] = useState(false); // いいね処理中の状態

  const maxLength = 100; // 表示する最大文字数
  const shouldTruncate = content.length > maxLength; // 最大文字数を超えてる場合はtrue
  const displayText = shouldTruncate && !isExpanded ? content.slice(0, maxLength) + '...' : content; // 最大文字数より多い場合は「...」を表示

  // ユーザーがいいね済みかチェック
  useEffect(() => {
    if (user && likedBy) {
      setIsLiked(likedBy.includes(user.uid));
    }
  }, [user,likedBy])

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      index < rating
        ? <StarIcon key={index} sx={{ color: '#FFD700', fontSize: '1rem' }} />
        : <StarBorderIcon key={index} sx={{ color: '#FFD700', fontSize: '1rem' }} />
    ));
  };

  // いいねボタンのハンドラー
  const handleLikeToggle = async () => {
    // ユーザーがログインしていない場合は、アラートを表示して処理を中止
    if (!user) {
      alert('いいねするにはログインしてください');
      return;
    }

    // すでにいいね処理中の場合は、二重クリックを防ぐために何もしない
    if (isLiking) return;

    try {
      // いいね処理中であることを示すフラグをセット（連打防止）
      setIsLiking(true);

      if (isLiked) {
        // すでに「いいね」している場合、いいねを取り消す
        await removeLikeFromReview(id); // Firestoreから「いいね」を削除
        setLikeCount((prev) => Math.max(prev - 1, 0)); // カウントを1減らす（最小値は0）
        setIsLiked(false); // UIの状態を「いいねしていない」に更新
      } else {
        // まだ「いいね」していない場合、いいねを追加
        await addLikeToReview(id); // Firestoreに「いいね」を追加
        setLikeCount((prev) => prev + 1); // カウントを1増やす
        setIsLiked(true); // UIの状態を「いいね済み」に更新
      }

      // 親コンポーネントに「いいね状態が変更された」ことを通知（オプション）
      if (onLikeToggle) {
        onLikeToggle(id, !isLiked);
      }
    } catch (error) {
      // いいね処理中にエラーが発生したらコンソールに表示
      console.error('いいね処理エラー：', error);
    } finally {
      // いいね処理が完了したので、処理中フラグを解除
      setIsLiking(false);
    }
  };

  return (
    <div className="bg-white rounded-lg py-8 px-16 shadow-sm mb-4 relative">

      {/* マイページの投稿した口コミ一覧でのみ、投稿を削除ボタンを表示 */}
      {showDeleteButton && (
        <button
          onClick={onDelete}
          className='absolute top-4 right-4 text-gray-500 hover:text-red-500 flex items-center gap-1 text-sm'
        >
          <IoTrashOutline className='w-4 h-4' />
          <span>投稿を削除</span>
        </button>
      )}

      {/* マイページのいいねした口コミ一覧でのみ、いいねを取り消すボタンを表示 */}
      {showUnlikeButton && (
        <button
          onClick={onUnlike}
          className='absolute top-4 right-4 text-gray-500 hover:text-red-500 flex items-center gap-1 text-sm'
        >
          <FaRegThumbsUp className='w-4 h-4' />
          <span>いいねを取り消す</span>
        </button>
      )}

      <div className="flex items-center gap-3 mb-2">
        <div className="w-16 h-16 relative">
          <Image
            src={avatarUrl}
            alt="ユーザーアイコン"
            fill
            className="rounded-full border-2 border-[#83BC87] "
          />
        </div>
        <div>
          <p className="font-bold">{userName}</p>
          <p className="text-sm text-gray-500">{date}</p>
          <Link href={`/shops/${shopId}`} >
          <p className='text-[#83BC87] font-bold cursor-pointer'>{shopName}</p>
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-1 mb-2">
        {renderStars(rating)}
      </div>
      <p className="text-sm mb-3">{displayText}</p>
      <div className="flex items-center gap-6">
        {/* <button className="flex items-center gap-1 text-gray-500">
          <FaRegComment className="w-4 h-4" />
          <span className="text-sm">20</span>
        </button> */}
        <button
          onClick={handleLikeToggle}
          disabled={isLiking}
          className={`flex items-center gap-1 ${isLiked ? 'text-[#FF6B6B]' : 'text-gray-500'} ${isLiking ? 'opacity-50' : 'hover:text-[#FF6B6B]'}`}
        >
          {isLiked ? <FaThumbsUp className="w-4 h-4" /> : <FaRegThumbsUp className='w-4 h-4' />}

          <span className="text-sm">{likeCount}</span>
        </button>
        {shouldTruncate && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-auto px-4 py-1 text-sm text-white bg-[#83BC87] rounded-full"
          >
            {isExpanded ? '閉じる' : '続きを読む'}
          </button>
        )}
      </div>
    </div>
  );
};
