'use client';

import { usePathname } from 'next/navigation';
import Image from 'next/image'
import React from 'react'
import { Dela_Gothic_One } from 'next/font/google';

const delaGothicOne = Dela_Gothic_One({
  subsets: ["latin"],
  weight: "400"
});

export const Header = () => {
  const pathname = usePathname();

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
      default:
        if (path.startsWith('/shops/')) {
          return '店舗詳細';
        }
        return '';
    }
  };

  const title = getTitle(pathname);

  // ホームページの場合は元々のヘッダーデザインを表示
  if(!title) {
    return (
      <>
        <div style={{backgroundColor: "#EFD0B8" }}>
          <div className='container mx-auto px-6 text-center relative h-[200px]'>
            <div className='relative w-full h-full'>
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
                  たこ焼き屋ポータルサイト
                </p>
              </div>
            </div>
          </div>
        </div>
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

