'use client';

import { KeyboardArrowDown } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { ShopCard } from '../components/ShopCard';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { LoginRequiredModal } from '../components/LoginRequiredModal';
import { Dialog, DialogContent, DialogTitle, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { getAllShops, getRecommendedShops } from '../services/shopService'; // ショップサービスをインポート
import { useRouter } from 'next/navigation';

// 店舗データ処理関数
const processShopData = (shop) => {
  // FirestoreのTimestampオブジェクトを日付に変換
  const createdAt = shop.createdAt && typeof shop.createdAt.toDate === 'function'
    ? shop.createdAt.toDate()
    : shop.createdAt;

  return {
    ...shop,
    createdAt,
  };
};

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState(''); // 検索バーに入力されたテキスト状態を管理
  const [isSearched, setIsSearched] = useState(false); // 検索が行われたかを管理(初期値はfalse:検索されてない状態)
  const [isPrefModalOpen, setIsPrefModalOpen] = useState(false); // 都道府県モーダルの開閉状態管理
  const [selectedPrefecture, setSelectedPrefecture] = useState(''); //選択した都道府県を管理
  const [shops, setShops] = useState([]); // 店舗データの状態管理
  const [loading, setLoading] = useState(true); // データの読み込み中の状態管理
  const [error, setError] = useState(null); // エラー状態の管理
  const { user } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const router = useRouter();

  // 店舗情報登録ボタンのクリックハンドラー
  const handleRegisterClick = () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    router.push('/shops/register');
  };

  const prefectures = [
    '北海道','青森県','岩手県','宮城県','秋田県','山形県','福島県',
    '茨城県','栃木県','群馬県','埼玉県','千葉県','東京都','神奈川県',
    '新潟県','富山県','石川県','福井県','山梨県','長野県','岐阜県',
    '静岡県','愛知県','三重県','滋賀県','京都府','大阪府','兵庫県',
    '奈良県','和歌山県','鳥取県','島根県','岡山県','広島県','山口県',
    '徳島県','香川県','愛媛県','高知県','福岡県','佐賀県','長崎県',
    '熊本県','大分県','宮崎県','鹿児島県','沖縄県'
  ];

  // ページロード時に店舗データを取得
  useEffect(() => {
    async function fetchShops() {
      try {
        setLoading(true);
        // おすすめ店舗(最新の登録店舗)を取得
        const recommendedShopsData = await getRecommendedShops(10);

        // データがない場合はデフォルトのデータを使用
        if (recommendedShopsData.length === 0) {
          setShops([
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
          ]);
        } else {
          setShops(recommendedShopsData);
        }
      } catch (err) {
        console.error('店舗データの取得に失敗しました：', err);
        setError('店舗データの読み込みに失敗しました');
        // エラー時はデフォルトデータを設定
        setShops([
          {
            id: 1,
            name: 'たこ焼きコロコロ',
            area: '大阪府大阪市中央区',
            rating: 4.5,
            reviews: 50,
            businessHours: '12:00~18:00',
            likes: 60
          }
        ]);
      } finally {
        setLoading(false);
      }
    }

    fetchShops();
  }, []);

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
            <button
              onClick={handleRegisterClick}
              className='text-sm text-[#83BC87] underline'
            >
              ＋ 店舗情報を登録
            </button>
          </div>

          {/* おすすめのたこ焼き屋一覧 */}
          <h2 className='text-lg font-bold mt-8 mb-4'>
            おすすめのたこ焼き屋一覧
          </h2>

          {loading ? (
            <div className='text-center py-8'>
              <p>読み込み中...</p>
            </div>
          ) : error ? (
            <div className='text-center py-8 text-red-500'>
              <p>{error}</p>
            </div>
          ) : shops.length === 0 ? (
            <div className='text-center py-8'>
              <p>登録された店舗がありません</p>
              <Link href="/shops/register" className='mt-4 inline-block bg-[#83BC87] text-white px-4 py-2 rounded-lg'>
                店舗を登録する
              </Link>
            </div>
          ) : (
            <div className='space-y-4'>
              {shops.map((shop) => (
                <ShopCard key={shop.id} shop={shop} />
              ))}
            </div>
          )}
        </>
      )}

      {/* ログイン要求モーダル */}
      <LoginRequiredModal
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
}
