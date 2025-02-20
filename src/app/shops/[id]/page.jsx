'use client';

import Image from "next/image";
import { Star, Favorite, AccessTime } from "@mui/icons-material";
import { FaRegComment } from "react-icons/fa";
import { FaRegPenToSquare } from "react-icons/fa6";
import { IoBookOutline } from "react-icons/io5";
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { ReviewCard } from "../../components/ReviewCard";
import { useState, use } from "react";
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined';

const ShopDetailPage = ({ params }) => {
  // params を use() で解決する
  const unwrappedParams = use(params); // Promise を解決

  // TODO: 実際のAPIから店舗のデータを取得する
  const [shop] = useState({
    id: unwrappedParams.id, // 解決された params.id を使用
    name: "たこ焼きコロコロ",
    address: "大阪府大阪市都島区都島1-1-10",
    rating: 4.5,
    likes: 80,
    reviews: 70,
    businessHours: "9:00~18:00",
    closedDays: "水曜日、第１月曜日",
    reviews: [
      {
        userName: "相澤",
        date: "2025.1.30",
        rating: 5,
        content: "ふわとろで美味しかったです！"
      },
      {
        userName: "テストユーザー1",
        date: "2025.1.30",
        rating: 4,
        content: "かなり美味しいです。"
      },
      {
        userName: "テストユーザー2",
        date: "2025.1.30",
        rating: 3,
        content: "あつあつでした。"
      }
    ]
  });

  return (
    <div className="pb-20">


      {/* 店舗情報 */}
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-2">{shop.name}</h1>
        {/* 店舗画像 */}
        <div className="w-full h-64 relative">
          <Image
            src="/shop-placeholder.png"
            alt={shop.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex items-center gap-4 my-2">
          <div className="flex items-center">
            <Star sx={{ color: '#FFD700', fontSize: '1rem' }} />
            <span className="text-sm ml-1">{shop.rating}</span>
          </div>
          <div className="flex items-center text-[#FF8E8E]">
            <Favorite sx={{ fontSize: '1rem' }} />
            <span className="text-sm ml-1">{shop.likes}件</span>
          </div>
          <div className="flex items-center text-gray-600">
            <FaRegComment />
            <span className="text-sm ml-1">{shop.reviews.length}レビュー</span>
          </div>
        </div>

        <div className="space-y-2 mb-3">

          <div className="flex items-center text-gray-600">
            <LocationOnOutlinedIcon sx={{ fontSize: '1rem' }} className="mr-1" />
            <span className="text-sm">住所：{shop.address}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <AccessTime sx={{ fontSize: '1rem' }} className="mr-1" />
            <span className="text-sm">営業時間：{shop.businessHours}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <EventBusyOutlinedIcon sx={{ fontSize: '1rem' }} className="mr-1" />
            <span className="text-sm">定休日：{shop.closedDays}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
        <button className="w-[48%] bg-[#83BC87] text-[#41372F] border-2 border-[#41372F] py-2 rounded-full flex items-center justify-center gap-1">
            <IoBookOutline sx={{ fontSize: '1rem', color: '#FF7474' }} />
            メニュー情報
          </button>
          <button className="w-[48%] bg-[#FFCACA] text-[#41372F] border-2 border-[#41372F] py-2 rounded-full flex items-center justify-center gap-1">
            <Favorite sx={{ fontSize: '1rem', color: '#FF7474' }} />
            お気に入り登録
          </button>
          <button className="w-[48%] bg-[#B0E6FF] text-[#41372F] border-2 border-[#41372F] py-2 rounded-full flex items-center justify-center gap-1">
            <LocationOnOutlinedIcon />
            マップを見る
          </button>
          <button className="w-[48%] bg-[#ececec] text-[#41372F] border-2 border-[#41372F] py-2 rounded-full flex items-center justify-center gap-1">
            <FaRegPenToSquare />
            口コミを投稿
          </button>
        </div>

        {/* レビュー一覧 */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">口コミ一覧</h2>
          <div className="space-y-4">
            {shop.reviews.map((review, index) => (
              <ReviewCard
                key={index}
                {...review}
                shopName={shop.name}
                shopId={shop.id}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopDetailPage;
