'use client';

import { KeyboardArrowDown } from '@mui/icons-material';
import { useState } from 'react';
import { ShopCard } from '../components/ShopCard';
import Link from 'next/link';
import { Dialog, DialogContent, DialogTitle, List, ListItem, ListItemButton, ListItemText } from '@mui/material';

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState(''); // 検索バーに入力されたテキスト状態を管理
  const [isSearched, setIsSearched] = useState(false); // 検索が行われたかを管理(初期値はfalse:検索されてない状態)
  const [isPrefModalOpen, setIsPrefModalOpen] = useState(false); // 都道府県モーダルの開閉状態管理
  const [selectedPrefecture, setSelectedPrefecture] = useState(''); //選択した都道府県を管理

  const prefectures = [
    '北海道','青森県','岩手県','宮城県','秋田県','山形県','福島県',
    '茨城県','栃木県','群馬県','埼玉県','千葉県','東京都','神奈川県',
    '新潟県','富山県','石川県','福井県','山梨県','長野県','岐阜県',
    '静岡県','愛知県','三重県','滋賀県','京都府','大阪府','兵庫県',
    '奈良県','和歌山県','鳥取県','島根県','岡山県','広島県','山口県',
    '徳島県','香川県','愛媛県','高知県','福岡県','佐賀県','長崎県',
    '熊本県','大分県','宮崎県','鹿児島県','沖縄県'
  ];

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

  // filterメソッドで都道府県とキーワード検索機能を実装
  const filteredShops = shops.filter(shop => {
    const matchesKeyword = searchTerm
    ? shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop.area.toLowerCase().includes(searchTerm.toLowerCase())
    : true;

    const matchesPrefecture = selectedPrefecture
    ? shop.area.includes(selectedPrefecture)
    : true;

    return matchesKeyword && matchesPrefecture;
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setIsSearched(true);
  };

  const handlePrefectureSelect = (prefecture) => {
    setSelectedPrefecture(prefecture);
    setIsPrefModalOpen(false);
    setIsSearched(true);
  }

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
      <button
        onClick={() => setIsPrefModalOpen(true)}
        className='w-full bg-[#83BC87] text-white py-3 rounded-lg mt-4'
      >
        都道府県から探す
        {selectedPrefecture && `(${selectedPrefecture})`}
      </button>

      {/* 都道府県選択モーダル */}
      <Dialog
        open={isPrefModalOpen}
        onClose={() => setIsPrefModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>都道府県を選択</DialogTitle>
        <DialogContent>
          <List sx={{ pt: 0 }}>
            {prefectures.map((prefecture) => (
              <ListItem disablePadding key={prefecture}>
                <ListItemButton onClick={() => handlePrefectureSelect(prefecture)}>
                  <ListItemText primary={prefecture} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>

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
            <Link
              href="/shops/register"
              className='text-sm text-[#83BC87] underline'
            >
              ＋ 店舗情報を登録
            </Link>
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
