'use client';

import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";
import { useCallback, useMemo, useState } from "react";
import { AccessTime, Close, Favorite, Star } from "@mui/icons-material";
import { FaRegComment } from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/navigation";

const MapPage = () => {
  // ルーターオブジェクトを取得
  const router = useRouter();

  // 大阪の中心座標
  const center = useMemo(() => (
    { lat: 34.6937, lng: 135.5023 }
  ), [])

  // 選択された店舗の状態を管理
  const [selectedShop, setSelectedShop] = useState(null);

  // サンプルのたこ焼き店舗データ
  const [shops] = useState([
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

  // マーカークリック時のハンドラー
  const handleMarkerClick = (shop) => {
    setSelectedShop(shop);
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
  }, []);

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-112px)]">
        <p>Loading...</p>
      </div>
    );
  }
  return (
    <div className="h-[calc(100vh-108px)] relative">
      <GoogleMap
        options={mapOptions}
        zoom={14}
        center={center}
        mapTypeId={google.maps.MapTypeId.ROADMAP}
        mapContainerStyle={{ width: '100%', height: '100%' }}
        onLoad={onload}
      >
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

      {/* 店舗情報モーダル */}
      {selectedShop && (
        <div className="fixed bottom-[56px] left-0 right-0 bg-[#FFF8F2] border-2 border-[#83BC87] rounded-t-2xl shadow-lg transition-transform duration-1000 z-50">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#53463c]">{selectedShop.name}</h2>
              <button
                onClick={() => setSelectedShop(null)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <Close />
              </button>
            </div>

            <div className="w-24 h-24 relative bg-gray-200 border-[#83BC87] border-2 rounded-md">
              <Image
                src="/shop-placeholder.png"
                alt="店舗画像"
                fill
                className="object-cover rounded-lg"
              />
              </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-600">{selectedShop.address}</p>

              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <Star sx={{ color: '#FFD700', fontSize: '1rem' }} />
                  <span className="text-sm ml-1">{selectedShop.rating}</span>
                </div>
                <div className="flex items-center text-[#FF8E8E]">
                  <Favorite sx={{ fontSize: '1rem' }} />
                  <span className="text-sm ml-1">{selectedShop.likes}件</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaRegComment />
                  <span className="text-sm ml-1">{selectedShop.reviews}レビュー</span>
                </div>
              </div>

              <div className="flex items-center text-gray-600">
                <AccessTime sx={{ fontSize: '1rem' }} className="mr-1" />
                <span className="text-sm">営業時間：{selectedShop.businessHours}</span>
              </div>

              <p className="text-sm text-gray-600">定休日：{selectedShop.closedDays}</p>
            </div>

            <div className="mt-4 space-y-2">
              <button className="w-full bg-[#FFCACA] text-[#41372F] border-2 border-[#41372F] py-2 rounded-full flex items-center justify-center gap-1">
                <Favorite sx={{ fontSize: '1rem', color: '#FF7474' }} />
                  お気に入り登録
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
    </div>
  );
};

export default MapPage;
