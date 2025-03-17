'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { getUserFavorites, removeFavorite } from '../services/favoriteService';
import { ShopCard } from '../components/ShopCard';
import { FaHeart } from 'react-icons/fa';
import IconButton from '@mui/material/IconButton';

// お気に入りページのメインコンポーネント
export default function FavoritePage() {
  const { user } = useAuth(); // ログインしているかどうか
  const [favoriteShops, setFavoriteShops] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // お気に入り店舗のデータを取得
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const favorites = await getUserFavorites(user.uid);
        // shop情報を取り出す
        const favoriteShopsData = favorites.map(favorite => favorite.shop);
        setFavoriteShops(favoriteShopsData);
      } catch (error) {
        console.error('お気に入り取得エラー:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  // お気に入りを削除する処理
  const handleRemoveFavorite = async (shopId) => {
    if (!user) return;

    if (window.confirm('お気に入りを解除してよろしいですか？')) {
      try {
        // Firestoreからお気に入りを削除
        await removeFavorite(user.uid, shopId);

        // UIを更新
        setFavoriteShops(prevShops => prevShops.filter(shop => shop.id !== shopId));
      } catch (error) {
        console.error('お気に入り削除エラー：', error);
      }
    }
  };

  if (!user) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <h1 className='text-2xl font-bold mb-6'>お気に入り</h1>
        <div className='bg-white rounded-lg shadow-sm p-8 text-center'>
          <p className='mb-4'>お気に入り機能を利用するにはログインが必要です</p>
          <button
            onClick={() => router.push('/login')}
            className='bg-[#83BC87] text-white px-6 py-2 rounded-full'
          >
            ログインする
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8 pb-20 max-w-[900px]'>
      <h1 className='text-2xl font-bold mb-6'>お気に入り</h1>

      {isLoading ? (
        <div className='text-center py-8'>
          <p>読み込み中...</p>
        </div>
      ) : favoriteShops.length === 0 ? (
        <div className='bg-white rounded-lg shadow-sm p-8 text-center'>
          <p className='mb-4'>お気に入りに追加した店舗はありません</p>
          <button
            onClick={() => router.push('/search')}
            className='bg-[83BC87] text-white px-6 py-2 rounded-full'
          >
            店舗を探す
          </button>
        </div>
      ) : (
        <div className='space-y-4'>
          {favoriteShops.map((shop) => (
            <div key={shop.id} className='relative'>
              <ShopCard shop={shop} />
              <IconButton
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: '#ff1744',
                }}
                onClick={() => handleRemoveFavorite(shop.id)}
              >
                <FaHeart sx={{fonSize: "2px" }} />
              </IconButton>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
