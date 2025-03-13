import { AccessTime, ChatBubbleOutline, Favorite, LocationOnOutlined, Star } from "@mui/icons-material"
import Image from "next/image"
import Link from "next/link";
import { FaRegComment } from "react-icons/fa";

// 営業時間をフォーマットする関数
const formatBusinessHours = (businessHours) => {
  if (!businessHours) return '情報なし';

  // オブジェクトの配列の場合 ({start, end}の形式)
  if (Array.isArray(businessHours)) {
    return businessHours.map(hour => `${hour.start}~${hour.end}`).join(', ');
  }

  // すでに文字列化されている場合
  return businessHours;
};

// 店舗カードコンポーネント
export const ShopCard = ({ shop }) => {
  return (
    <Link href={`/shops/${shop.id}`}>
      <div className="bg-white rounded-lg p-4 shadow cursor-pointer  mb-2">
        <div className="flex gap-4">
          <div className="w-24 h-24 relative bg-gray-200 border-[#83BC87] border-2 rounded-md">
            <Image
              src={shop.name === "たこ焼きC店"
                ? "/takoyaki.jpg"
                : (shop.name === "たこ焼きA店"
                  ? "/takoyaki_a.jpg"
                  : (shop.name === "たこ焼きB店"
                    ? "/takoyaki_b.jpg"
                    : "/shop-placeholder.png"
                    )
                  )
                }
              alt={shop.name}
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg">
              {shop.name}
            </h3>
            <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
              <LocationOnOutlined sx={{ fontSize: '1rem' }} />
              {shop.area}
            </p>
            <div className="flex items-center gap-5 mt-1">
              <div className="flex items-center">
                <Star sx={{ color: '#FFD700', fontSize: '1rem' }} />
                <span className="text-sm ml-1">{shop.rating}</span>
              </div>
              <div className="flex items-center gap-1 mt-1 text-[#FF8E8E]">
              <Favorite sx={{ fontSize: '1rem' }} />
              <span className="text-sm">{shop.likes}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FaRegComment sx={{ fontSize: '1rem' }} />
                <span className="text-sm ml-1">{shop.reviews}レビュー</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
              <AccessTime sx={ {fontSize: '1rem'} } />
              営業時間：{formatBusinessHours(shop.businessHours)}
            </p>

          </div>
        </div>
      </div>
    </Link>
  );
};
