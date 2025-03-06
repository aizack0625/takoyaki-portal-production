'use client';

import { GoPencil } from "react-icons/go";
import { MdInsertPhoto, MdPersonOff } from "react-icons/md";
import { FaRegComment, FaRegThumbsUp } from "react-icons/fa";
import { RiLogoutBoxLine } from "react-icons/ri";
import { IoKey } from "react-icons/io5";
import Image from "next/image";
import Link from "next/link";
import { useState,useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { LoginRequiredModal } from "../components/LoginRequiredModal";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

const MyPage = () => {
  const { user, logout } = useAuth(); // ログイン認証、ログアウトを呼び出す
  const router = useRouter(); // ログインモーダルを閉じた時にトップページにpushするrouter
  const [showLoginModal, setShowLoginModal] = useState(false); // ログインモーダル表示管理
  const [showConfirmModal, setShowConfirmModal] = useState(false); // ログアウト確認モーダル表示管理
  const [showCompleteModal, setShowCompleteModal] = useState(false); // ログアウト完了モーダル表示管理
  // TODO: 認証から取得した実際のユーザーデータに置き換える
  const [userData, setUserData] = useState({
    username: '',
    avatarUrl: '/default-user-icon.png'
  });

  useEffect(() => {
    if (!user) { // ログインしていない場合、ログインモーダルを表示
      setShowLoginModal(true);
    } else {
      // ユーザー情報を設定
      setUserData({
        username: user.displayName || (user.isAnonymous ? 'ゲストユーザー' : user.email?.split('@')[0] || 'ユーザー'),
        avatarUrl: user.photoURL || '/default-user-icon.png'
      });
    }
  }, [user]);

  // ログアウトボタンクリック時の処理
  const handleLogoutClick = () => {
    setShowConfirmModal(true);
  };

  // ログアウト実行処理の関数
  const handleLogout = async () => {
    try {
      await logout();
      setShowConfirmModal(false);
      setShowCompleteModal(true);
      setTimeout(() => {
        setShowCompleteModal(false);
        router.push('/');
      }, 5000);
    } catch (error) {
      console.error('ログアウトに失敗しました：', error);
    }
  };

  if (!user) {
    return (
      <LoginRequiredModal
        open={showLoginModal}
        onClose={() => router.push('/login')}
      />
    );
  }

  // 各種設定メニュー
  const menuItems = [
    { icon: <GoPencil />, text: 'ユーザー名変更', href: '/mypage/edit-name'},
    { icon: <MdInsertPhoto />, text: 'ユーザー画像変更', href: '/mypage/edit-avatar'},
    { icon: <FaRegComment />, text: '投稿した口コミを見る', href: '/mypage/my-comments'},
    { icon: <FaRegThumbsUp />, text: 'いいねした口コミを見る', href: '/mypage/liked-comments'},
    { icon: <IoKey />, text: 'パスワード変更', href: '/mypage/change-password'},
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
        {user?.isAnonymous && (
          <p className="text-sm text-gray-500 mt-1">
            ※ゲストユーザーは一時的なアカウントです
          </p>
        )}
      </div>

      {/* Menu Items */}
      <div className="space-y-4 mb-12">
        {!user?.isAnonymous && menuItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="block w-full p-4 bg-[#D3E4D4] hover:bg-[#C1D8C2] rounded-lg transition-colors duration-200 flex items-center gap-3"
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-gray-700">{item.text}</span>
          </Link>
        ))}

        {/* ログアウトボタン */}
        <button
          onClick={handleLogoutClick}
          className="w-full p-4 bg-[#D3E4D4] hover:bg-[#C1D8C2] rounded-lg transition-colors duration-200 flex items-center gap-3"
        >
          <span className="text-xl"><RiLogoutBoxLine /></span>
          <span className="text-gray-700">ログアウト</span>
        </button>

        {/* 退会ボタン - ゲストユーザーには表示しない */}
        {!user?.isAnonymous && (
          <Link
            href='/mypage/withdrawal'
            className="block w-full p-4 bg-[#989898] hover:bg-[#f99090] rounded-lg transition-colors duration-200 flex items-center gap-3 mt-8"
          >
            <span className="text-xl"><MdPersonOff /></span>
            <span className="text-gray-700">アカウント消去</span>
          </Link>
        )}
      </div>

      {/* ログアウト確認モーダル */}
      <Modal
        open={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
      >
        <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">ログアウトの確認</h2>
          <p className="text-gray-600 mb-6">
            ログアウトします。よろしいですか？
          </p>
          <div className="flex gap-4">
            <button
              onClick={handleLogout}
              className="flex-1 bg-[#83BC87] text-white py-2 rounded-full hover:bg-[#75a879]"
            >
              はい
            </button>
            <button
              onClick={() => setShowConfirmModal(false)}
              className="flex-1 border border-gray-300 py-2 rounded-full hover:bg-gray-50"
            >
              いいえ
            </button>
          </div>
        </Box>
      </Modal>

      {/* ログアウト完了モーダル */}
      <Modal
        open={showCompleteModal}
        onClose={() => setShowCompleteModal(false)}
      >
        <Box
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white p-6 rounded-lg shadow-lg text-center"
        >
          <p className="text-xl font-bold text-[#83BC87]">
            ログアウトしました
          </p>
        </Box>
      </Modal>
    </div>
  )
}

export default MyPage;
