'use client';

import { useState } from "react";
import Link from 'next/link';
import { IoArrowBack } from "react-icons/io5";
import { ReviewCard } from "../../components/ReviewCard";

const MyComments = () => {
  // ハードコードのデータ
  // TODO: APIから実際のデータを取得する
  const [comments, setComments] = useState([
    {
      id: 1,
      userName: 'あなた',
      shopName: 'たこ焼きコロコロ',
      shopId: '1',
      rating: 2,
      content: 'ふわとろで美味しかったです！ふわとろで美味しかったです！ふわとろで美味しかったです！ふわとろで美味しかったです！ふわとろで美味しかったです！ふわとろで美味しかったです！ふわとろで美味しかったです！ふわとろで美味しかったです！ふわとろで美味しかったです！ふわとろで美味しかったです！ふわとろで美味しかったです！ふわとろで美味しかったです！ふわとろで美味しかったです！ふわとろで美味しかったです！ふわとろで美味しかったです！',
      date: '2024.03.15',
      likes: 5,
      image: '/sample-korokoro.jpg'
    },
    {
      id: 2,
      userName: 'あなた',
      shopName: 'たこ焼きたこ丸',
      shopId: '2',
      rating: 2,
      content: 'ふわとろで美味しかったです！',
      date: '2024.03.15',
      likes: 5,
      image: '/sample-korokoro.jpg'
    },
    {
      id: 3,
      userName: 'あなた',
      shopName: 'たこ焼きたこや',
      shopId: '3',
      rating: 2,
      content: 'ふわとろで美味しかったです！ふわとろで美味しかったです！ふわとろで美味しかったです！ふわとろで美味しかったです！ふわとろで美味しかったです！ふわとろで美味しかったです！ふわとろで美味しかったです！ふわとろで美味しかったです！ふわとろで美味しかったです！ふわとろで美味しかったです！ふわとろで美味しかったです！ふわとろで美味しかったです！ふわとろで美味しかったです！ふわとろで美味しかったです！ふわとろで美味しかったです！',
      date: '2024.03.15',
      likes: 5,
      image: '/sample-korokoro.jpg'
    },
    {
      id: 4,
      userName: 'あなた',
      shopName: 'たこ焼きコロコロ',
      shopId: '4',
      rating: 2,
      content: 'ふわとろで美味しかったです！',
      date: '2024.03.15',
      likes: 5,
      image: '/sample-korokoro.jpg'
    },
    {
      id: 5,
      userName: 'あなた',
      shopName: 'たこ焼きコロコロ',
      shopId: '5',
      rating: 2,
      content: 'ふわとろで美味しかったです！',
      date: '2024.03.15',
      likes: 5,
      image: '/sample-korokoro.jpg'
    },
  ]);

  // 削除処理の関数
  const handleDelete = (commentId) => {
    if (confirm('この口コミを削除してもよろしいですか？')) {
      setComments(comments.filter(comment => comment.id !== commentId)); //comment.idがcommentIdと一致した場合、配列から一致したcommentIdを削除
    }
  };

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

      {/* 口コミ一覧 */}
      <div className="space-y-6">
        {comments.map((comment) => (
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
          />
        ))}
      </div>
    </div>
  );
};

export default MyComments;
