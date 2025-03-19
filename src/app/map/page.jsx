'use client';

import { GoogleMap, MarkerF, useLoadScript, DirectionsService, DirectionsRenderer } from "@react-google-maps/api";
import { useCallback, useMemo, useState, useEffect } from "react";
import { AccessTime, Close, Favorite, Star, DirectionsWalk, CalendarMonth, Store } from "@mui/icons-material";
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
  // 店舗情報モーダルの表示状態を管理する新しい状態変数
  const [showShopModal, setShowShopModal] = useState(false);

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

  // ルート表示関連の状態を追加
  const [directions, setDirections] = useState(null);
  const [routeDistance, setRouteDistance] = useState("");
  const [routeDuration, setRouteDuration] = useState("");
  const [showRoute, setShowRoute] = useState(false);

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
    setShowShopModal(true);

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

  // 現在地から店舗までのルートを計算する関数
  const calculateRoute = useCallback(() => {
    if (!currentLocation || !selectedShop || !selectedShop.position) {
      return;
    }

    const directionsService = new google.maps.DirectionsService();

    directionsService.route(
      {
        origin: currentLocation,
        destination: selectedShop.position,
        travelMode: google.maps.TravelMode.WALKING, // 徒歩ルートを指定
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          setDirections(result);

          // ルートの距離と時間を設定
          const route = result.routes[0];
          if (route && route.legs[0]) {
            setRouteDistance(route.legs[0].distance.text);
            setRouteDuration(route.legs[0].duration.text);
          }

          setShowRoute(true);
        } else {
          console.error(`ルートの計算に失敗しました: ${status}`);
          setDirections(null);
          setRouteDistance("");
          setRouteDuration("");
          setShowRoute(false);
        }
      }
    );
  }, [currentLocation, selectedShop]);

  // ルート表示をクリアする関数
  const clearRoute = () => {
    setDirections(null);
    setRouteDistance("");
    setRouteDuration("");
    setShowRoute(false);
  };

  // 選択された店舗が変更された時の処理（ルートクリアを削除）
  useEffect(() => {
    // 店舗が選択されたら自動的にモーダルを表示
    if (selectedShop) {
      setShowShopModal(true);
    }
  }, [selectedShop]);

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

        {/* ルート表示 */}
        {directions && showRoute && (
          <DirectionsRenderer
            directions={directions}
            options={{
              polylineOptions: {
                strokeColor: "#c9842a",
                strokeWeight: 10,
                strokeOpacity: 0.8
              },
              suppressMarkers: true // マーカーの自動表示を抑制
            }}
          />
        )}
      </GoogleMap>

      {/* 現在地取得ボタンを追加 */}
      <button
        onClick={getCurrentLocation}
        className="absolute bottom-4 right-4 bg-white p-3 rounded-full shadow-lg z-10"
      >
        <span role="img" aria-label="現在地">📍</span>
      </button>

      {/* ルート表示中にルートクリアボタンを表示 */}
      {showRoute && !showShopModal && (
        <button
          onClick={clearRoute}
          className="absolute bottom-4 left-4 bg-white py-2 px-4 rounded-full shadow-lg z-10 flex items-center"
        >
          <span className="text-gray-700 text-sm font-medium">ルート消去</span>
        </button>
      )}

      {/* 店舗情報モーダル - selectedShopがある場合に加えて、showShopModalがtrueの場合のみ表示 */}
      {selectedShop && showShopModal && (
        <div className="fixed bottom-[56px] left-0 right-0 bg-[#FFF8F2] border-2 border-[#83BC87] rounded-t-2xl shadow-lg transition-transform duration-300 z-50 max-h-[38vh] max-w-[900px] mx-auto overflow-hidden md:max-h-[70vh] flex flex-col">
          {/* ヘッダー部分 - スクロールしても固定表示 */}
          <div className="sticky top-0 z-10 bg-[#FFF8F2] border-b border-[#E6DDD4] px-5 flex justify-between items-center">
            <h2 className="text-xl font-bold text-[#53463c] truncate pr-2">{selectedShop.name}</h2>
            <button
              onClick={() => setShowShopModal(false)}
              className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="閉じる"
            >
              <Close className="text-gray-500"/>
            </button>
          </div>

          {/* コンテンツ部分 - スクロール可能 */}
          <div className="p-5 pt-2 overflow-auto">
            {/* メインコンテンツ: 画像と店舗情報 */}
            <div className="flex flex-col md:flex-row gap-4">
              {/* 画像部分 - モバイルでは大きく、PCでは左側に配置 */}
              <div className="w-full md:w-1/3 h-48 md:h-auto relative bg-gray-200 border-[#83BC87] border-2 rounded-lg flex-shrink-0 overflow-hidden">
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

              {/* 店舗情報部分 */}
              <div className="flex-1 min-w-0">
                {/* 住所 */}
                <div className="bg-white p-3 rounded-lg shadow-sm mb-3">
                  <p className="text-sm text-gray-700 font-medium flex items-center">
                    <span className="inline-block mr-2">📍</span>
                    {selectedShop.prefecture || ''}
                    {selectedShop.city || ''}
                    {selectedShop.address || ''}
                  </p>
                </div>

                {/* 評価・レビュー情報 */}
                <div className="bg-white p-3 rounded-lg shadow-sm mb-3">
                  <div className="flex items-center gap-5 flex-wrap">
                    <div className="flex items-center">
                      <Star sx={{ color: '#FFD700', fontSize: '1.25rem' }} />
                      <span className="text-sm font-bold ml-1">
                        {selectedShop.rating || 0}
                      </span>
                    </div>
                    <div className="flex items-center text-[#FF8E8E]">
                      <Favorite sx={{ fontSize: '1.25rem' }} />
                      <span className="text-sm font-medium ml-1">
                        {selectedShop.likes || 0}件
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaRegComment size={20} />
                      <span className="text-sm font-medium ml-1">
                        {selectedShop.reviews || 0}レビュー
                      </span>
                    </div>
                  </div>
                </div>

                {/* 営業情報 */}
                <div className="bg-white p-3 rounded-lg shadow-sm mb-3">
                  <div className="flex items-center text-gray-700 mb-2">
                    <AccessTime sx={{ fontSize: '1.25rem' }} className="mr-2 text-[#83BC87]" />
                    <span className="text-sm font-medium">
                      営業時間：{selectedShop.businessHours || '情報なし'}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <span className="mr-2 text-[#83BC87]">
                      <CalendarMonth />
                    </span>
                    <span className="text-sm font-medium">
                      定休日：{selectedShop.closedDays || '情報なし'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ルート情報の表示 */}
            {showRoute && routeDistance && routeDuration && (
              <div className="mt-3 bg-white p-3 rounded-lg shadow-sm">
                <h3 className="font-medium text-[#53463c] mb-2">徒歩ルート情報</h3>
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-sm font-bold text-[#83BC87]">距離：</span>
                    <span className="text-sm">{routeDistance}</span>
                  </div>
                  <div>
                    <span className="text-sm font-bold text-[#83BC87]">予想時間：</span>
                    <span className="text-sm">{routeDuration}</span>
                  </div>
                </div>
              </div>
            )}

            {/* ボタン部分 */}
            <div className="mt-4 flex gap-3 flex-col md:flex-row">

              {/* ルート表示ボタン */}
              {!showRoute ? (
                <button
                  onClick={calculateRoute}
                  disabled={!currentLocation}
                  className="px-2 flex-1 border-2 border-[#41372F] bg-[#FFE7D8] text-[#41372F] py-2.5 rounded-full hover:bg-[#fad5be] transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <DirectionsWalk /> 現在地からの徒歩ルートを表示
                </button>
              ) : (
                <button
                  onClick={clearRoute}
                  className="px-2 flex-1 border-2 border-[#41372F] bg-gray-100 text-[#41372F] py-2.5 rounded-full hover:bg-gray-200 transition-colors font-medium"
                >
                  ルート表示を消す
                </button>
              )}

              {/* お気に入り登録ボタン */}
              <button
                onClick={handleFavoriteClick}
                disabled={isFavoriteLoading}
                className={`flex-1 ${isFavorited ? 'bg-[#FF8E8E]' : 'bg-[#FFCACA]'} text-[#41372F] border-2 border-[#41372F] py-2.5 rounded-full flex items-center justify-center gap-2 transition-colors hover:opacity-90 font-medium`}
              >
                <Favorite sx={{ fontSize: '1.2rem', color: isFavorited ? '#ff4d64' : '#FF7474' }} />
                {isFavorited ? 'お気に入り登録済み' : 'お気に入り登録'}
              </button>

              {/* 店舗情報・口コミボタン */}
              <button
                onClick={() => router.push(`/shops/${selectedShop.id}`)}
                className="flex-1 border-2 border-[#41372F] bg-[#B5D4C4] text-[#41372F] py-2.5 rounded-full hover:bg-[#9EC5B0] transition-colors font-medium flex items-center justify-center gap-2">
                <Store sx={{ fontSize: '1.2rem' }}/>
                店舗情報を見る・口コミ投稿
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
