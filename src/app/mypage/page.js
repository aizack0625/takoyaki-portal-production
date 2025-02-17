'use client';

import { GoPencil } from "react-icons/go";
import { MdInsertPhoto, MdPersonOff } from "react-icons/md";
import { FaRegComment, FaRegThumbsUp } from "react-icons/fa";
import { RiLogoutBoxLine } from "react-icons/ri";
import { IoKey } from "react-icons/io5";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const MyPage = () => {
  // TODO: 認証から取得した実際のユーザーデータに置き換える
  const [userData, setUserData] = useState({
    username: '相澤',
    avatarUrl: '/default-user-icon.png'
  });

  // 各種設定メニュー
  const menuItems = [
    { icon: <GoPencil />, text: 'ユーザー名変更', href: '/mypage/edit-name'},
    { icon: <MdInsertPhoto />, text: 'ユーザー画像変更', href: '/mypage/edit-avatar'},
    { icon: <FaRegComment />, text: '投稿したコメントを見る', href: '/mypage/my-comments'},
    { icon: <FaRegThumbsUp />, text: 'いいねしたコメントを見る', href: '/mypage/liked-comments'},
    { icon: <IoKey />, text: 'パスワード変更', href: '/mypage/change-password'},
    { icon: <RiLogoutBoxLine />, text: 'ログアウト', href: '/logout'},
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-x-2xl">
      {/* Profile Section */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-24 h-24 rounded-full border-2 border-[#83BC87] overflow-hidden mb-4">
          <Image
            src={userData.avatarUrl}
            alt="ユーザーアイコン"
            width={96}
            height={96}
            className="object-cover"
          />
        </div>
        <h2 className="text-xl font-bold text-gray-800">
          {userData.username}
        </h2>
      </div>

      {/* Menu Items */}
      <div className="space-y-4">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="block w-full p-4 bg-[#D3E4D4] hover:bg-[#C1D8C2] rounded-lg transition-colors duration-200 flex items-center gap-3"
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-gray-700">{item.text}</span>
          </Link>
        ))}

        {/* 退会ボタン（メニュー項目から分離) */}
        <Link
          href='/mypage/withdrawal'
          className="block w-full p-4 bg-[#D3E4D4] hover:bg-[#C1D8C2] rounded-lg transition-colors duration-200 flex items-center gap-3 mt-8"
        >
          <span className="text-xl"><MdPersonOff /></span>
          <span className="text-gray-700">退会</span>
        </Link>
      </div>
    </div>
  )
}

export default MyPage;
