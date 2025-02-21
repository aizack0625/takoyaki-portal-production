'use client';

import Image from 'next/image';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { FaRegThumbsUp, FaRegComment } from "react-icons/fa";
import Link from "next/link";
import { useState } from 'react';

export const ReviewCard = ({ userName, date, shopName, shopId, rating, content }) => {
  const [isExpanded, setIsExpanded] = useState(false); // レビュー文字数を管理
  const maxLength = 100; // 表示する最大文字数
  const shouldTruncate = content. length > maxLength; // 最大文字数を超えてる場合はtrue
  const displayText = shouldTruncate && !isExpanded ? content.slice(0, maxLength) + '...' : content; // 最大文字数より多い場合は「...」を表示

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      index < rating
        ? <StarIcon key={index} sx={{ color: '#FFD700', fontSize: '1rem' }} />
        : <StarBorderIcon key={index} sx={{ color: '#FFD700', fontSize: '1rem' }} />
    ));
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 relative">
          <Image
            src="/default-user-icon.png"
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
        <button className="flex items-center gap-1 text-gray-500">
          <FaRegComment sx={{ fontSize: '1.2rem' }} />
          <span className="text-sm">20</span>
        </button>
        <button className="flex items-center gap-1 text-gray-500">
          <FaRegThumbsUp sx={{ fontSize: '1.2rem' }} />
          <span className="text-sm">30</span>
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
