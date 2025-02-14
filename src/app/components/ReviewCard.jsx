import Image from "next/image";
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
// import ChatBubbleOutlineOutlineIcon from "@mui/icons-material/ChatBubbleOutlineOutline";
// import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import { BsHandThumbsUp, BsChat } from "react-icons/bs";

export const ReviewCard = ({ userName, date, rating, content }) => {
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
        
      </div>
    </div>
  )
}
