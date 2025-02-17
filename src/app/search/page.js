'use client';

import { KeyboardArrowDown } from '@mui/icons-material';
import { useState } from 'react';
import { ShopCard } from '../components/ShopCard';

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearched, setIsSearched] = useState(false);

  const shops = [
    {
      id: 1,
      name: 'たこ焼きコロコロ',
      area: '大阪府大阪市中央区',
      rating: 4.5,
      reviews: 50,
      businessHours: '12:00~18:00',
      likes: 60
    },
    {
      id: 2,
      name: 'たこ焼きキング',
      area: '大阪府大阪市浪速区',
      rating: 5,
      reviews: 30,
      businessHours: '17:00~22:00',
      likes: 20
    },
    {
      id: 3,
      name: 'たこ焼き○○○',
      area: '大阪府大阪市中央区',
      rating: 4.5,
      reviews: 50,
      businessHours: '12:00~18:00',
      likes: 60
    },
    {
      id: 4,
      name: 'たこ焼き△△△',
      area: '大阪府大阪市北区',
      rating: 2,
      reviews: 50,
      businessHours: '12:00~18:00',
      likes: 60
    },
    {
      id: 5,
      name: 'たこ焼き◻︎◻︎◻︎',
      area: '大阪府大阪市淀川区',
      rating: 3,
      reviews: 50,
      businessHours: '12:00~18:00',
      likes: 60
    },
  ];

  // filterメソッドで検索機能を実装
  const filteredShops = shops.filter(shop =>
    shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shop.area.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // console.log(filteredShops);

  const handleSearch = (e) => {
    e.preventDefault();
    setIsSearched(true);
  };

  // console.log(setSearchTerm)


  return (
    <div className='container mx-auto px-4 pb-20'>
      {/* 検索バー */}
      <form onSubmit={handleSearch} className='relative mt-4'>
        <input
          type='text'
          placeholder='店名、住所など'
          className='w-full p-3 pr-12 border rounded-lg'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className='absolute right-2 top-1/2 -translate-y-1/2 bg-[#83BC87] text-white p-2 rounded-lg'>
          検索
        </button>
      </form>

      {/* 都道府県から探すボタン */}
      <button className='w-full bg-[#83BC87] text-white py-3 rounded-lg mt-4'>
        都道府県から探す
      </button>

      { isSearched ? (
        // 検索結果を表示
        <>
          <div className='flex justify-between items-center mt-6'>
            <div className='text-lg'>
              検索結果
                <span className='text-[#83BC87] font-bold'>
                  {filteredShops.length}
                </span>
              件
            </div>
            <button className='flex items-center text-sm text-gray-600'>
              レビューが多い順 <KeyboardArrowDown />
            </button>
          </div>
          <div className='space-y-4 mt-4'>
            {filteredShops.map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </div>
        </>
      ) : (
        // 検索前の表示
        <>
          {/* 店舗情報登録ボタン */}
          <div className='text-right mt-2'>
            <button className='text-sm text-[#83BC87] underline'>
              ＋ 店舗情報を登録
            </button>
          </div>

          {/* おすすめのたこ焼き屋一覧 */}
          <h2 className='text-lg font-bold mt-8 mb-4'>
            おすすめのたこ焼き屋一覧
          </h2>
          <div className='space-y-4'>
            {shops.map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
