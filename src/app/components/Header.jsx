'use client';

import { usePathname } from 'next/navigation';
import Image from 'next/image'
import React, { useState } from 'react'
import { Dela_Gothic_One } from 'next/font/google';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';


const delaGothicOne = Dela_Gothic_One({
  subsets: ["latin"],
  weight: "400"
});

export const Header = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth(); // ログアウト管理
  const router = useRouter(); // ページ遷移用
  const [showConfirmModal, setShowConfirmModal] = useState(false); // ログアウトモーダル表示管理
  const [showCompletemModal, setShowCompletemModal] = useState(false);

  // パスに応じてタイトルを返す関数
  const getTitle = (path) => {
    switch (path) {
      case '/':
        return null //ホームページには元々のヘッダーを表示
      case '/search':
        return '検索';
      case '/map':
        return 'マップ';
      case '/favorite':
        return 'お気に入り';
      case '/mypage':
        return 'マイページ';
      case '/mypage/edit-name':
        return 'ユーザー名変更';
      case '/mypage/edit-avatar':
        return 'ユーザー画像変更';
      case '/mypage/liked-comments':
        return 'いいねした口コミ';
      case '/mypage/my-comments':
        return '投稿した口コミ';
      case '/shops/register':
        return '店舗情報登録'
      default:
        if (path.startsWith('/shops/edit/')) {
          return '店舗情報修正';
        }
        if (path.startsWith('/shops/')) {
          return '店舗詳細';
        }
        return '';
    }
  };

  const title = getTitle(pathname);

  // ログアウトモーダル開閉処理の関数
  const handleLogoutClick = () => {
    setShowConfirmModal(true)
  }

  // ログアウト処理の関数
  const handleLogout = async () => {
    try {
      await logout();
      setShowConfirmModal(false);
      setShowCompletemModal(true);
      setTimeout(() => {
        setShowCompletemModal(false);
        router.push('/');
      }, 2000);
    } catch (error) {
      console.error('ログアウトに失敗しました:', error);
    }
  };

  // ホームページの場合は元々のヘッダーデザインを表示
  if(!title) {
    return (
      <>
        <div style={{backgroundColor: "#EFD0B8" }}>
          <div className='container mx-auto px-6 text-center relative h-[200px]'>

            {/* ログイン・新規登録ボタン */}
            <div className='absolute top-4 right-6 z-20 flex gap-4'>
              {user ? (
                // ログイン時のボタン
                <button
                  onClick={handleLogoutClick}
                  className='bg-[#83BC87] opacity-90 text-white text-xs px-5 py-2 rounded-full hover:bg-[#75a879] transition-all'
                >
                  ログアウト
                </button>
              ) : (
                // 未ログイン時のボタン
                <>
                  <Link href="/login">
                    <button className='bg-white px-4 py-2 rounded-full text-[#83BC87] font-bold hover:bg-opacity-80 transition-all'>
                      ログイン
                    </button>
                  </Link>
                  <Link href="/signup">
                    <button className='bg-[#83BC87] px-4 py-2 rounded-full text-white font-bold hover:bg-opacity-80 transition-all'>
                      新規登録
                    </button>
                  </Link>
                </>
              )}
            </div>

            {/* メインビジュアル */}
            <div className='relative w-full h-full max-w-[1000px] mx-auto'>
              <Image
                src="/takoyaki.jpg"
                fill
                alt='たこ焼きの画像'
                className='opacity-80 object-cover'
                priority
              />
              <div
                className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 rounded z-10 whitespace-nowrap'
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.7)'
                }}
              >
                <h1 className={`${delaGothicOne.className} text-4xl sm:text-5xl md:text-6xl`}
                  style={{
                    textShadow: '0px 0px 10px rgba(131, 188, 135, 1)',
                    color: '#FF8E8E'
                  }}
                >
                  たこポー
                </h1>
                <p className='md:text-xl text-sm font-bold'
                  style={{
                    textShadow: '0px 0px 10px rgba(131, 188, 135, 1)',
                    color: '#FF8E8E'
                  }}
                >
                  たこ焼き好きが集まるアプリ
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ログアウト確認モーダル */}
        <Modal
          open={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
        >
          <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white p-6 rounded-lg shadow-lg">
            <h2 className='text-xl font-bold mb-4'>ログアウトの確認</h2>
            <p className='text-gray-600 mb-6'>
              ログアウトします。よろしいですか？
            </p>
            <div className='flex gap-4'>
              <button
                onClick={handleLogout}
                className='flex-1 bg-[#83BC87] text-white py-2 rounded-full hover:bg-[#75a879]'
              >
                はい
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                className='flex-1 border border-gray-300py-2 rounded-full hover:bg-gray-50'
              >
                いいえ
              </button>
            </div>
          </Box>
        </Modal>

        {/* ログアウト完了モーダル */}
        <Modal
          open={showCompletemModal}
          onClose={() => setShowCompletemModal(false)}
        >
          <Box
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white p-6 rounded-lg shadow-lg text-center">
              <p className='text-xl font-bold text-[#83BC87]' >
                ログアウトしました
              </p>
            </Box>
        </Modal>
      </>
    )
  }

  // ホームページ以外の場合はシンプルなヘッダーを表示
  return (
    <header className='bg-[#83BC87] text-white py-3'>
      <div className='container mx-auto px-4'>
        <h1 className='text-center text-[#FFF8F2] text-xl'>{title}</h1>
      </div>
    </header>
  )
}

