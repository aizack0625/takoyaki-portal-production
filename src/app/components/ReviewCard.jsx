import Image from 'next/image';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { FaRegThumbsUp, FaRegComment } from "react-icons/fa";

export const ReviewCard = ({ userName, date, shopName, rating, content }) => {
  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      index < rating
        ? <StarIcon key={index} sx={{ color: '#FFD700', fontSize: '1rem' }} />
        : <StarBorderIcon key={index} sx={{ color: '#FFD700', fontSize: '1rem' }} />
    ));
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 relative">
          <Image
            src="/default-user-icon.png"
            alt="ユーザーアイコン"
            fill
            className="rounded-full border-2 border-[#83BC87] "
          />
        </div>
        <div>
          <p className="font-bold">{userName}</p>
          <p className="text-sm text-gray-500">{date}</p>
          <p className='text-[#83BC87] font-bold cursor-pointer'>{shopName}</p>
        </div>
      </div>
      <div className="flex items-center gap-1 mb-2">
        {renderStars(rating)}
      </div>
      <p className="text-sm mb-3">{content}</p>
      <div className="flex items-center gap-6">
        <button className="flex items-center gap-1 text-gray-500">
          <FaRegComment sx={{ fontSize: '1.2rem' }} />
          <span className="text-sm">20</span>
        </button>
        <button className="flex items-center gap-1 text-gray-500">
          <FaRegThumbsUp sx={{ fontSize: '1.2rem' }} />
          <span className="text-sm">30</span>
        </button>
        <button className="ml-auto px-4 py-1 text-sm text-white bg-[#83BC87] rounded-full">
          続きを読む
        </button>
      </div>
    </div>
  );
};
