'use client';

import { useEffect, useState } from 'react';
import { Box, Typography, IconButton, ratingClasses } from '@mui/material';
import { ShopCard } from '../components/ShopCard';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useAuth } from '../contexts/AuthContext';
import { LoginRequiredModal } from '../components/LoginRequiredModal';
import { useRouter } from 'next/navigation';

// ハードコードの店舗データ
// TODO: APIから実際の店舗データを取得する
const favoriteShops = [
  {
    id: 1,
    name: 'たこ焼きコロコロ',
    image: '/images/shop-placeholder.png',
    address: '大阪府大阪市中央区◯◯2丁目1-1',
    area: '大阪市中央区',
    rating: 4.5,
    likes: 120,
    reviews: 50,
    businessHours: '11:00~20:00',
  },
  {
    id: 2,
    name: 'たこ焼きたこ丸',
    image: '/images/shop-placeholder.png',
    address: '大阪府大阪市中央区◯◯2丁目1-1',
    area: '大阪市中央区',
    rating: 3.5,
    likes: 100,
    reviews: 20,
    businessHours: '11:00~20:00',
  },
  {
    id: 3,
    name: 'たこ焼きコロコロ',
    image: '/images/shop-placeholder.png',
    address: '大阪府大阪市中央区◯◯2丁目1-1',
    area: '大阪市中央区',
    rating: 4.5,
    likes: 120,
    reviews: 50,
    businessHours: '11:00~20:00',
  },
  {
    id: 4,
    name: 'たこ焼きコロコロ',
    image: '/images/shop-placeholder.png',
    address: '大阪府大阪市中央区◯◯2丁目1-1',
    area: '大阪市中央区',
    rating: 4.5,
    likes: 120,
    reviews: 50,
    businessHours: '11:00~20:00',
  },
  {
    id: 5,
    name: 'たこ焼きコロコロ',
    image: '/images/shop-placeholder.png',
    address: '大阪府大阪市中央区◯◯2丁目1-1',
    area: '大阪市中央区',
    rating: 4.5,
    likes: 120,
    reviews: 50,
    businessHours: '11:00~20:00',
  },
  {
    id: 6,
    name: 'たこ焼きコロコロ',
    image: '/images/shop-placeholder.png',
    address: '大阪府大阪市中央区◯◯2丁目1-1',
    area: '大阪市中央区',
    rating: 4.5,
    likes: 120,
    reviews: 50,
    businessHours: '11:00~20:00',
  },
];

export default function FavoritePage() {
  const { user } = useAuth(); // ログインしているかどうか
  const router = useRouter();
  const [showLoginModal, setShowLoginModal] = useState(false); // ログインモーダル表示管理

  // ログイン済みか確認をする
  useEffect(() => {
    if (!user) {
      setShowLoginModal(true);
    }
  }, [user]);

  const handleRemoveFavorite = (shopId) => {
    if(!user) {
      setShowLoginModal(true);
      return;
    }
    // 確認ダイアログ表示
    if (window.confirm('お気に入りを解除してよろしいですか？')) {
      // TODO: お気に入り解除の処理を実装
      console.log(`Shop ${shopId} removed from favorites`);
    }
  };

  if (!user) {
    return (
      <LoginRequiredModal
        open={showLoginModal}
        onClose={() => router.push('/')}
      />
    );
  }

  return (
    <Box sx={{ pb: 7, pt: 2, px: 2 }}>
      <Typography variant='h5' component="h1" sx={{ mb: 3, fontWeight: 'bold '}}>
        お気に入り店舗
      </Typography>

      {favoriteShops.map((shop) => (
        <div key={shop.id} className='relative'>
          <ShopCard shop={shop} />
          <IconButton
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: '#ff1744',
              zIndex: 10,
            }}
            onClick={() => handleRemoveFavorite(shop.id)}
          >
            <FavoriteIcon />
          </IconButton>
        </div>
      ))}

      {favoriteShops.length === 0 && (
        <Typography variant='body1' sx={{ textAlign: 'center', mt: 4 }}>
          お気に入りの店舗がありません
        </Typography>
      )}
    </Box>
  );
}
