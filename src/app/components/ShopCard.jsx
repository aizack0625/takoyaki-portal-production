import { AccessTime, ChatBubbleOutline, Favorite, LocationOnOutlined, Star } from "@mui/icons-material"
import Image from "next/image"
import { FaRegComment } from "react-icons/fa";

// 店舗カードコンポーネント
export const ShopCard = ({ shop }) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow cursor-pointer">
      <div className="flex gap-4">
        <div className="w-24 h-24 relative bg-gray-200 border-[#83BC87] border-2 rounded-md">
          <Image
            src="/shop-plaaceholder.jpg"
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
            営業時間：{shop.businessHours}
          </p>

        </div>
      </div>
    </div>
  );
};
