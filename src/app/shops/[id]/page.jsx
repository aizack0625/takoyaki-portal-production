'use client';

import Image from "next/image";
import { Star, Favorite, AccessTime } from "@mui/icons-material";
import { FaRegComment } from "react-icons/fa";
import { FaRegPenToSquare } from "react-icons/fa6";
import { IoBookOutline } from "react-icons/io5";
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { ReviewCard } from "../../components/ReviewCard";
import { useState, use } from "react";
import { useRouter } from "next/navigation";
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import { imageConfigDefault } from "next/dist/shared/lib/image-config";
import { useAuth } from "../../contexts/AuthContext";
import { LoginRequiredModal } from "../../components/LoginRequiredModal";

const ShopDetailPage = ({ params }) => {
  // params を use() で解決する
  const unwrappedParams = use(params); // Promise を解決
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false); // メニューモーダルの開閉状態を管理
  const [isFavorited, setIsFavorited] = useState(false); // お気に入り状態を管理
  // 口コミ投稿モーダルの状態管理
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false); // 口コミ投稿モーダル表示管理
  const [reviewRating, setReviewRating] = useState(3); // 口コミ投稿の星評価数の管理
  const [reviewContent, setReviewContent] = useState(''); // 口コミ投稿の文字を管理
  const [selectedImage, setSelectedImage] = useState(null) // 口コミ投稿の画像を管理
  const router = useRouter();
  const { user } = useAuth(); // ログイン認証Auth
  const [showLoginModal, setShowLoginModal] = useState(false); // ログインモーダル表示管理

  // TODO: 実際のAPIから店舗のデータを取得する
  const [shop] = useState({
    id: unwrappedParams.id, // 解決された params.id を使用
    name: "たこ焼きコロコロ",
    address: "大阪府大阪市都島区都島1-1-10",
    rating: 4.5,
    likes: 80,
    reviews: 70,
    businessHours: "9:00~18:00",
    closedDays: "水曜日、第１月曜日",
    reviews: [
      {
        userName: "相澤",
        date: "2025.1.30",
        rating: 5,
        content: "ふわとろで美味しかったです！"
      },
      {
        userName: "テストユーザー1",
        date: "2025.1.30",
        rating: 4,
        content: "かなり美味しいです。"
      },
      {
        userName: "テストユーザー2",
        date: "2025.1.30",
        rating: 3,
        content: "あつあつでした。"
      }
    ],
    menus: [
      {
        name: "たこ焼き(8個)",
        price: 500,
      },
      {
        name: "チーズたこ焼き(8個)",
        price: 600,
      },
      {
        name: "明太マヨたこ焼き(8個)",
        price: 650,
      },
      {
        name: "たこせん",
        price: 250,
      },
    ]
  });

  const handleMenuModalOpen = () => setIsMenuModalOpen(true);
  const handleMenuModalClose = () => setIsMenuModalOpen(false);

  // お気に入りボタンのクリックハンドラー
  const handleFavoriteClick = () => {
    if (!user) { // ログイン済みでない場合、ログインモーダルを表示
      setShowLoginModal(true);
      return;
    }

    if (!isFavorited) {
      setIsFavorited(true);
    } else {
      if (confirm('お気に入りを解除しますか？')) {
        setIsFavorited(false);
      }
    }
  };

  const handleReviewModalOpen = () => {
    if (!user) { // ログイン済みでない場合、ログインモーダルを表示
      setShowLoginModal(true);
      return;
    }
    setIsReviewModalOpen(true)
  };

  const handleReviewModalClose = () => {
    setIsReviewModalOpen(false);
    setReviewRating(3);
    setReviewContent('')
    setSelectedImage(null)
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const handleSubmitReview = async () => {
    // TODO: APIを呼び出して口コミを投稿する処理を実装
    console.log({
      rating: reviewRating,
      content: reviewContent,
      image: selectedImage
    });

    // 仮の実装：reviews stateに新しいレビューを追加
    const newReview = {
      userName: "ユーザー", // TODO: 実際のユーザー名を使用
      date: new Date().toLocaleDateString('ja-JP'),
      rating: reviewRating,
      content: reviewContent
    };

    shop.reviews.unshift(newReview);
    handleReviewModalClose();
    // TODO: 成功メッセージを表示
  };

  return (
    <>
      <div className="pb-20">

        {/* 店舗情報 */}
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-2">{shop.name}</h1>
          {/* 店舗画像 */}
          <div className="w-full h-64 relative">
            <Image
              src="/shop-placeholder.png"
              alt={shop.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex items-center gap-4 my-2">
            <div className="flex items-center">
              <Star sx={{ color: '#FFD700', fontSize: '1rem' }} />
              <span className="text-sm ml-1">{shop.rating}</span>
            </div>
            <div className="flex items-center text-[#FF8E8E]">
              <Favorite sx={{ fontSize: '1rem' }} />
              <span className="text-sm ml-1">{shop.likes}件</span>
            </div>
            <div className="flex items-center text-gray-600">
              <FaRegComment />
              <span className="text-sm ml-1">{shop.reviews.length}レビュー</span>
            </div>
          </div>

          <div className="space-y-2 mb-3">

            <div className="flex items-center text-gray-600">
              <LocationOnOutlinedIcon sx={{ fontSize: '1rem' }} className="mr-1" />
              <span className="text-sm">住所：{shop.address}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <AccessTime sx={{ fontSize: '1rem' }} className="mr-1" />
              <span className="text-sm">営業時間：{shop.businessHours}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <EventBusyOutlinedIcon sx={{ fontSize: '1rem' }} className="mr-1" />
              <span className="text-sm">定休日：{shop.closedDays}</span>
            </div>
          </div>

          {/* メニュー情報、お気に入り登録、マップを見る、口コミ投稿ボタン */}
          <div className="flex flex-wrap gap-1">
          <button
            onClick={handleMenuModalOpen}
            className="w-[48%] bg-[#83BC87] text-[#41372F] border-2 border-[#41372F] py-2 rounded-full flex items-center justify-center gap-1"
          >
              <IoBookOutline sx={{ fontSize: '1rem', color: '#FF7474' }} />
              メニュー情報
            </button>
            <button
              onClick={handleFavoriteClick}
              className={`w-[48%] ${isFavorited ? 'bg-[#FF8E8E]' : 'bg-[#FFCACA]'} text-[#41372F] border-2 border-[#41372F] py-2 rounded-full flex items-center justify-center gap-1`}>
              <Favorite sx={{ fontSize: '1rem', color: '#FF7474' }} />
              {isFavorited ? 'お気に入り登録ずみ' : 'お気に入り登録'}
            </button>
            <button className="w-[48%] bg-[#B0E6FF] text-[#41372F] border-2 border-[#41372F] py-2 rounded-full flex items-center justify-center gap-1">
              <LocationOnOutlinedIcon />
              マップを見る
            </button>
            <button
              onClick={handleReviewModalOpen}
              className="w-[48%] bg-[#ececec] text-[#41372F] border-2 border-[#41372F] py-2 rounded-full flex items-center justify-center gap-1"
            >
              <FaRegPenToSquare />
              口コミを投稿
            </button>
          </div>

          {/* レビュー投稿モーダル */}
          <Modal
            open={isReviewModalOpen}
            onClose={handleReviewModalClose}
            aria-labelledby="review-modal-title"
          >
            <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white p-6 rounded-lg shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 id="review-modal-title" className="text-xl font-bold">口コミを投稿</h2>
                <button onClick={handleReviewModalClose}>
                  <CloseIcon />
                </button>
              </div>

              <div className="mb-4">
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="focus:outline-none"
                    >
                      <Star
                        sx={{
                          color: star <= reviewRating ? '#FFD700' : '#D3D3D3',
                          fontSize: '1.5rem'
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={reviewContent}
                onChange={(e) => setReviewContent(e.target.value)}
                placeholder="味の感想などを入力..."
                className="w-full h-32 p-2 border rounded-lg mb-4 resize-none"
              />

              <div className="mb-4">
                <button
                  onClick={() => document.getElementById('image-input').click()}
                  className="w-full py-3 bg-[#E8E8E8] text-gray-600 rounded-lg flex items-center justify-center gap-2"
                >
                  <span>写真を追加</span>
                </button>
                <input
                  id="image-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                {selectedImage && (
                  <div className="mt-2 relative w-24 h-24">
                    <Image
                      src={selectedImage}
                      alt="Selected"
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>

              <button
                onClick={handleSubmitReview}
                disabled={!reviewContent.trim()}
                className={`w-full py-3 rounded-lg ${
                  reviewContent.trim()
                    ? 'bg-[#83BC87] text-white cursor-pointer'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                投稿
              </button>
            </Box>
          </Modal>

          {/* メニューモーダル */}
          <Modal
            open={isMenuModalOpen}
            onClose={handleMenuModalClose}
            aria-labelledby="menu-modal-title"
          >
            <Box className="absolute top-1/2 left-1/2 tranform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2
                id="menu-modal-title"
                className="text-xl font-bold"
              >
                メニュー
              </h2>
              <button onClick={handleMenuModalClose}>
                <CloseIcon />
              </button>
              </div>
              <div className="space-y-4">
                {shop.menus.map((menu, index) => (
                  <div key={index} className="border-b pb-3">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold">{menu.name}</h3>
                      <span className="text-red-600">¥{menu.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Box>
          </Modal>

          {/* レビュー一覧 */}
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">口コミ一覧</h2>
            <div className="space-y-4">
              {shop.reviews.map((review, index) => (
                <ReviewCard
                  key={index}
                  {...review}
                  shopName={shop.name}
                  shopId={shop.id}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ログインモーダル表示 */}
      <LoginRequiredModal
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
};

export default ShopDetailPage;
