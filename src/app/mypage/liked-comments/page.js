'use client';

import { ReviewCard } from "../../components/ReviewCard";
import { useState } from "react";

const LikedComments = () => {
  // TODO: 実際のAPIから取得したデータに置き換える
  const [likedReviews, setLikedReviews] = useState([
    {
      userName: "田中さん",
      date: "2024.03.15",
      shopName: "たこ焼きコロコロ",
      shopId: "1",
      rating: 5,
      content: "とても美味しかったです！とても美味しかったです！とても美味しかったです！とても美味しかったです！とても美味しかったです！とても美味しかったです！とても美味しかったです！とても美味しかったです！とても美味しかったです！とても美味しかったです！とても美味しかったです！とても美味しかったです！とても美味しかったです！とても美味しかったです！とても美味しかったです！とても美味しかったです！とても美味しかったです！",
    },
    {
      userName: "佐藤さん",
      date: "2024.03.14",
      shopName: "たこ焼きたこや",
      shopId: "2",
      rating: 3,
      content: "最高の味です。",
    },
    {
      userName: "山田さん",
      date: "2024.03.13",
      shopName: "たこ焼きコロコロ",
      shopId: "3",
      rating: 4,
      content: "とても美味しかったです！とても美味しかったです！とても美味しかったです！とても美味しかったです！とても美味しかったです！とても美味しかったです！とても美味しかったです！とても美味しかったです！とても美味しかったです！とても美味しかったです！とても美味しかったです！とても美味しかったです！とても美味しかったです！とても美味しかったです！とても美味しかったです！とても美味しかったです！とても美味しかったです！",
    },
  ]);

  // いいねを取り消す処理
  const handleUnlike = (index) => {
    // 確認ダイアログを表示
    if (window.confirm('この口コミへのいいねを取り消しますか？')) {
      // TODO:APIでいいねを取り消す処理を実装
      setLikedReviews(prevReviews =>
        prevReviews.filter((_, i) => i !== index)
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">いいねした口コミ</h1>
      {likedReviews.length > 0 ? (
        <div className="space-y-4">
          {likedReviews.map((review, index) => (
            <ReviewCard
              key={index}
              userName={review.userName}
              date={review.date}
              shopName={review.shopName}
              shopId={review.shopId}
              rating={review.rating}
              content={review.content}
              showUnlikeButton={true}
              onUnlike={() => handleUnlike(index)}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">いいねした口コミはありません。</p>
      )}
    </div>
  );
};

export default LikedComments;
