'use client';

import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";
import { useCallback, useMemo, useState } from "react";

const MapPage = () => {
  // 大阪の中心座標
  const center = useMemo(() => (
    { lat: 34.6937, lng: 135.5023 }
  ), [])

  // サンプルのたこ焼き店舗データ
  const [shops] = useState([
    { id: 1, name: "たこ焼きコロコロ", position: { lat: 34.6947, lng: 135.5023 } },
    { id: 2, name: "たこ焼きキング", position: { lat: 34.6987, lng: 135.5123 } },
    { id: 3, name: "たこ焼き○○○", position: { lat: 34.6887, lng: 135.4923 } },
  ]);

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
    console.log('Map Component Loaded!!')
  }, []);

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-112px)]">
        <p>Loading...</p>
      </div>
    );
  }
  return (
    <div className="h-[calc(100vh-112px)]">
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
          />
        ))}
      </GoogleMap>
    </div>
  );
};

export default MapPage;
