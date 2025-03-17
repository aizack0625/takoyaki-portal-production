'use client';

import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";
import { useCallback, useMemo, useState, useEffect } from "react";
import { AccessTime, Close, Favorite, Star } from "@mui/icons-material";
import { FaRegComment } from "react-icons/fa";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { getAllShops } from "../services/shopService";
import { useAuth } from "../contexts/AuthContext";
import { addFavorite, removeFavorite, isFavorite } from "../services/favoriteService";
import { LoginRequiredModal } from "../components/LoginRequiredModal";

const MapPage = () => {
  // URLパラメータからshopIdを取得
  const searchParams = useSearchParams(); // クエリパラメータを取得
  const shopIdFromUrl = searchParams.get('shopId'); // shopIdの値を取得

  // ルーターオブジェクトを取得
  const router = useRouter();
  // 現在地の状態を追加
  const [currentLocation, setCurrentLocation] = useState(null);
  // AuthContextからユーザー情報を取得
  const { user } = useAuth();
  // ログインモーダルの表示状態
  const [showLoginModal, setShowLoginModal] = useState(false);
  // お気に入り操作中の状態
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
  // 選択された店舗のお気に入り状態
  const [isFavorited, setIsFavorited] = useState(false);

  // 大阪の中心座標
  const center = useMemo(() => (
    currentLocation || { lat: 34.6937, lng: 135.5023 }
  ), [currentLocation]);

  // 現在地取得関数
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by ")
    }
  };

  // コンポーネントマウント時に現在地を取得
  useEffect(() => {
    getCurrentLocation();
  }, []);

  // 選択された店舗の状態を管理
  const [selectedShop, setSelectedShop] = useState(null);
  // 店舗データを管理
  const [shops, setShops] = useState([]);
  // ローディング状態を管理
  const [loading, setLoading] = useState(true);
  // エラー状態を管理
  const [error, setError] = useState(null);

  // 店舗データを取得する
  useEffect(() => {
    const fetchShops = async () => {
      try {
        setLoading(true);
        const shopsData = await getAllShops();

        // 住所から緯度・経度を取得する
        const shopsWithLocation = await Promise.all(
          shopsData.map(async (shop) => {
            const address = `${shop.prefecture || ''}${shop.city || ''}${shop.address || ''}`;
            if (!address) {
              // 住所がない場合はデフォルトの位置を設定
              return {
                ...shop,
                position: {
                  lat: center.lat + (Math.random() - 0.5) * 0.02,
                  lng: center.lng + (Math.random() - 0.5) * 0.02
                }
              };
            }

            try {
              // Google Maps Geocoding APIを使用して住所から位置情報を取得
              const position = await geocodeAddress(address);
              return {
                ...shop,
                position
              };
            } catch (geocodeError) {
              console.error('ジオコーディングエラー：', geocodeError);
              // ジオコーディングに失敗した場合はデフォルトの位置を設定
              return {
                ...shop,
                position: {
                  lat: center.lat + (Math.random() - 0.5) * 0.02,
                  lng: center.lng + (Math.random() - 0.5) * 0.02
                }
              };
            }
          })
        );

        setShops(shopsWithLocation);
        setError(null);

        // shopIdFromUrlがある場合、該当の店舗を選択する
        if (shopIdFromUrl) {
          const targetShop = shopsWithLocation.find(shop => shop.id.toString() === shopIdFromUrl); // リストの中にURLと同じお店があるか探す
          if (targetShop) {
            handleMarkerClick(targetShop); // targetShopを地図に表示
          }
        }
      } catch (err) {
        console.error('店舗データの取得に失敗しました：', err);
        setError('店舗データの読み込みに失敗しました');

        // エラー時にはサンプルデータを使用
        setShops([
          {
            id: 1,
            name: "たこ焼きコロコロ",
            position: { lat: 34.6947, lng: 135.5023 },
            address: "大阪府大阪市中央区1-1-1",
            businessHours: "17:00~22:00",
            rating: 4.2,
            reviews: 70,
            likes: 60,
            closedDays: "水曜日、第１月曜日"
          },
          {
            id: 2,
            name: "たこ焼きキング",
            position: { lat: 34.6987, lng: 135.5123 },
            address: "大阪府大阪市中央区2-2-2",
            businessHours: "16:00~21:00",
            rating: 3.5,
            reviews: 50,
            likes: 20,
            closedDays: "水曜日、第3月曜日"
          },
          {
            id: 3,
            name: "たこ焼き○○○",
            position: { lat: 34.6887, lng: 135.4923 },
            address: "大阪府大阪市中央区3-3-3",
            businessHours: "12:00~20:00",
            rating: 5.0,
            reviews: 70,
            likes: 60,
            closedDays: "木曜日、第１月曜日"
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, [center, shopIdFromUrl]);

  // 住所から緯度・経度を取得する関数
  const geocodeAddress = async (address) => {
    return new Promise((resolve, reject) => {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address }, (results, status) => {
        if (status === "OK" && results[0]) {
          const { lat, lng } = results[0].geometry.location;
          resolve({ lat: lat(), lng: lng() });
        } else {
          reject(new Error(`ジオコーディングに失敗しました： ${status}`));
        }
      });
    });
  };

  // マーカークリック時のハンドラー
  const handleMarkerClick = async (shop) => {
    setSelectedShop(shop);

    // マップの中心を選択した店舗の位置に移動
    if (shop && shop.position) {
      // centerの状態を直接更新することはできないので、マップの中心を移動する処理を追加
      if (window.map) {
        window.map.panTo(shop.position);
      }
    }

    // ユーザーがログインしている場合、お気に入り状態を確認
    if (user && shop.id) {
      try {
        setIsFavoriteLoading(true);
        const favoriteStatus = await isFavorite(user.uid, shop.id);
        setIsFavorited(favoriteStatus);
      } catch (error) {
        console.error('お気に入り状態確認エラー：', error);
      } finally {
        setIsFavoriteLoading(false);
      }
    } else {
      setIsFavorited(false);
    }
  };

  // お気に入りボタンのクリックハンドラー
  const handleFavoriteClick = async () => {
    if (!user) { // ログイン済みでない場合、ログインモーダルを表示
      setShowLoginModal(true);
      return;
    }

    if (!selectedShop) return;

    try {
      setIsFavoriteLoading(true);

      if (isFavorited) {
        // お気に入りから削除
        await removeFavorite(user.uid, selectedShop.id);
      } else {
        // お気に入り追加
        await addFavorite(user.uid, selectedShop.id);
      }

      // 状態を更新
      setIsFavorited(!isFavorited);
    } catch (error) {
      console.error('お気に入り処理エラー：', error);
    } finally {
      setIsFavoriteLoading(false);
    }
  };

  // API Keyを取得
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  });

  const mapOptions = useMemo(() => ({
    disableDefaultUI: true,
    clickableIcons: true,
    scrollwheel: true
  }), []);

  const onLoad = useCallback(map => {
    // マップの初期設定をここで実施する
    console.log('Map Component Loaded!')
    // グローバル変数にマップインスタンスを保存（パンする為に必要）
    window.map = map;

    // URLパラメータから指定された店舗IDがあり、既に店舗データが読み込まれている場合
    if (shopIdFromUrl && shops.length > 0) {
      const targetShop = shops.find(shop => shop.id.toString() === shopIdFromUrl);
      if (targetShop && targetShop.position) {
        // マップの中心を該当店舗に移動
        map.panTo(targetShop.position);
        // ズームレベルを少し拡大
        map.setZoom(16);
      }
    }
  }, [shopIdFromUrl, shops]);

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-112px)]">
        <p>Loading...</p>
      </div>
    );
  }

  if (loading && isLoaded) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-112px)]">
        <p>店舗データを読み込み中</p>
      </div>
    )
  }
  return (
    <div className="h-[calc(100vh-108px)] relative">
      <GoogleMap
        options={mapOptions}
        zoom={14}
        center={center}
        mapTypeId={google.maps.MapTypeId.ROADMAP}
        mapContainerStyle={{ width: '100%', height: '100%' }}
        onLoad={onLoad}
      >
        {/* 現在地マーカーを追加 */}
        {currentLocation && (
          <MarkerF
            position={currentLocation}
            icon={{
              url: `data:image/svg+xml,${encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                  <circle cx="12" cy="12" r="10" fill="#4285F4" />
                  <circle cx="12" cy="12" r="6" fill="skyblue" />
                </svg>
                `)}`,
                scaledSize: new google.maps.Size(38, 38),
                anchor: new google.maps.Point(12, 12),
            }}
          />
        )}

        {shops.map(shop => (
          <MarkerF
            key={shop.id}
            position={shop.position}
            title={shop.name}
            onClick={() => handleMarkerClick(shop)}
            icon={{
              url: `data:image/svg+xml,${encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#ff9900"/>
                </svg>
              `)}`,
              anchor: new google.maps.Point(24, 48),
              scaledSize: new google.maps.Size(72, 72),
            }}
            label={{
              text: "🐙",  // たこ焼き絵文字
              fontSize: "30px",
              fontFamily: "Arial",
            }}
          />
        ))}
      </GoogleMap>

      {/* 現在地取得ボタンを追加 */}
      <button
        onClick={getCurrentLocation}
        className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-lg"
      >
        <span role="img" aria-label="現在地">📍</span>
      </button>

      {/* 店舗情報モーダル */}
      {selectedShop && (
        <div className="fixed bottom-[56px] left-0 right-0 bg-[#FFF8F2] border-2 border-[#83BC87] rounded-t-2xl shadow-lg transition-transform duration-1000 z-50 max-h-[35vh] max-w-[900px] mx-auto overflow-auto md:max-h-[70vh]">
          <div className="p-4">
            <div className="flex justify-between items-center mb-2 md:mb-4">
              <h2 className="text-lg font-bold text-[#53463c] truncate pr-2">{selectedShop.name}</h2>
              <button
                onClick={() => setSelectedShop(null)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <Close className="text-sm md:text-base"/>
              </button>
            </div>

          <div className="flex flex-row items-start">
            <div className="w-24 h-24 relative bg-gray-200 border-[#83BC87] border-2 rounded-md flex-shrink-0">
              <Image
              src={selectedShop.name === "たこ焼きC店"
                ? "/takoyaki.jpg"
                : (selectedShop.name === "たこ焼きA店"
                  ? "/takoyaki_a.jpg"
                  : (selectedShop.name === "たこ焼きB店"
                    ? "/takoyaki_b.jpg"
                    : (selectedShop.name === "たこ焼きD店"
                      ? "/takoyaki_d.jpg"
                      : "/shop-placeholder.png"
                      )
                    )
                  )
                }
                alt="店舗画像"
                fill
                className="object-cover rounded-lg"
              />
              </div>
          </div>

            <div className="space-y-1 flex-1 min-w-0">
              <p className="text-sm text-gray-600 truncate">
                {selectedShop.prefecture || ''}
                {selectedShop.city || ''}
                {selectedShop.address || ''}
              </p>

              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center">
                  <Star sx={{ color: '#FFD700', fontSize: '1rem' }} />
                  <span className="text-sm ml-1">
                    {selectedShop.rating || 0}
                  </span>
                </div>
                <div className="flex items-center text-[#FF8E8E]">
                  <Favorite sx={{ fontSize: '1rem' }} />
                  <span className="text-sm ml-1">
                    {selectedShop.likes || 0}件
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaRegComment />
                  <span className="text-sm ml-1">
                    {selectedShop.reviews || 0}レビュー
                  </span>
                </div>
              </div>

              <div className="flex items-center text-gray-600">
                <AccessTime sx={{ fontSize: '1rem' }} className="mr-1" />
                <span className="text-sm">
                  営業時間：{selectedShop.businessHours || '情報なし'}
                </span>
              </div>

              <p className="text-sm text-gray-600">
                定休日：{selectedShop.closedDays || '情報なし'}
              </p>
            </div>

            <div className="mt-4 space-y-2">
              <button
                onClick={handleFavoriteClick}
                disabled={isFavoriteLoading}
                className={`w-full ${isFavorited ? 'bg-[#FF8E8E]' : 'bg-[#FFCACA]'} text-[#41372F] border-2 border-[#41372F] py-2 rounded-full flex items-center justify-center gap-1`}
              >
                <Favorite sx={{ fontSize: '1rem', color: '#FF7474' }} />
                {isFavorited ? 'お気に入り登録済み' : 'お気に入り登録'}
              </button>
              <button
                onClick={() => router.push(`/shops/${selectedShop.id}`)}
                className="w-full border-2 border-[#41372F] bg-[#B5D4C4] text-[#41372F] py-2 rounded-full">
                店舗情報を全て表示・口コミ投稿
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ログインモーダル表示 */}
      <LoginRequiredModal
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
};

export default MapPage;
