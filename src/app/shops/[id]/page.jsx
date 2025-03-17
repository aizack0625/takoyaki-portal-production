'use client';

import Image from "next/image";
import { Star, Favorite, AccessTime } from "@mui/icons-material";
import { FaRegComment } from "react-icons/fa";
import { FaRegPenToSquare } from "react-icons/fa6";
import { IoBookOutline } from "react-icons/io5";
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { ReviewCard } from "../../components/ReviewCard";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { imageConfigDefault } from "next/dist/shared/lib/image-config";
import { useAuth } from "../../contexts/AuthContext";
import { LoginRequiredModal } from "../../components/LoginRequiredModal";
import { getShopById } from "../../services/shopService";
import { useParams } from "next/navigation"; // useParamsを使ってparamsを取得
import { useReviews } from "../../hooks/useReviews"; // レビューフックのインポート
import { addFavorite, removeFavorite, isFavorite } from "../../services/favoriteService";

// 営業時間をフォーマットする関数
const formatBusinessHours = (businessHours) => {
  if (!businessHours) return '情報なし';

  // オブジェクトの配列の場合 ({start, end}の形式)
  if (Array.isArray(businessHours)) {
    return businessHours.map(hour => `${hour.start}~${hour.end}`).join('. ');
  }

  // すでに文字列化されている場合
  return businessHours;
};

const ShopDetailPage = ({ params }) => {
  const { id } = useParams(); // useParamsを使ってidを取得

  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false); // メニューモーダルの開閉状態を管理
  const [isFavorited, setIsFavorited] = useState(false); // お気に入り状態を管理
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false); // お気に入り登録ロード状態管理
  // 口コミ投稿モーダルの状態管理
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false); // 口コミ投稿モーダル表示管理
  const [reviewRating, setReviewRating] = useState(3); // 口コミ投稿の星評価数の管理
  const [reviewContent, setReviewContent] = useState(''); // 口コミ投稿の文字を管理
  const [selectedImage, setSelectedImage] = useState(null); // 口コミ投稿の画像を管理
  const [selectedFile, setSelectedFile] = useState(null); // 口コミ投稿のファイル選択管理
  const [isSubmitting, setIsSubmitting] = useState(false); // 口コミ投稿管理
  const router = useRouter();
  const { user } = useAuth(); // ログイン認証Auth
  const [showLoginModal, setShowLoginModal] = useState(false); // ログインモーダル表示管理
  // 画像カルーセル用のstate
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // 画像クリックで拡大表示できるモーダル用のstate
  const [imageModalOpen, setImageModalOpen] = useState(false);

  // 各店舗の複数画像
  const getShopImages = (shopName) => {
    if (shopName === "たこ焼きA店") {
      return [
        "/takoyaki_a.jpg",
        "/takoyaki_a_2.jpg",
        "/takoyaki_a_3.jpg",
      ];
    } else if (shopName === "たこ焼きC店") {
      return [
        "/takoyaki.jpg",
        "/takoyaki_c_2.jpg",
        "/takoyaki_c_3.jpg",
      ];
    } else if (shopName === "たこ焼きB店") {
      return [
        "/takoyaki_b.jpg",
      ];
    } else if (shopName === "たこ焼きD店") {
      return [
        "/takoyaki_d.jpg",
        "/takoyaki_d_2.jpg",
        "/takoyaki_d_3.jpg",
      ];
    } else {
      return ["/shop-placeholder.png"];
    }
  };

  // 画像カルーセルのナビゲーション関数
  const goToPreviousImage = () => {
    const images = getShopImages(shop.name);
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNextImage = () => {
    const images = getShopImages(shop.name);
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // レビューフックの利用
  const {
    reviews,
    isLoading: reviewsLoading,
    error: reviewsError,
    addReview,
    removeReview,
    refreshReviews
  } = useReviews(id);

  // 店舗データの取得関数　- useEffectの外部に移動
    const fetchShopData = async () => {
      setLoading(true); // データを読み込み中にする
      try {
        const shopData = await getShopById(id); // 店舗データを取得
        setShop(shopData); // 取得した店舗データを状態に設定
        setError(null)
      } catch (err) {
        console.error('店舗データの取得に失敗しました:', err);
        setError('店舗情報の読み込みに失敗しました'); // エラーメッセージを設定

        // エラー時にフォールバックデータを設定
        setShop({
          id: id,
          name: "店舗情報を取得できませんでした",
          prefecture: "",
          city: "",
          address: "",
          businessHours: "",
          holidays: "",
          menus: []
        });
      } finally {
        setLoading(false); // データの読み込みが完了したらローディング状態を解除
      }
    };

  // 店舗データを取得
  useEffect(() => {
      fetchShopData(); // 関数を呼び出し
  }, [id]); // idが変更されるたびに実行

  // お気に入り状態を取得
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (user && id) {
        try {
          setIsFavoriteLoading(true);
          const favoriteStatus = await isFavorite(user.uid, id);
          setIsFavorited(favoriteStatus);
        } catch (error) {
          console.error('お気に入り状態確認エラー：', error);
        } finally {
          setIsFavoriteLoading(false);
        }
      }
    };

    checkFavoriteStatus();
  }, [user, id]);

  // 画像モーダルのハンドラー
  const handleImageModalOpen = () => setImageModalOpen(true);
  const handleImageModalClose = () => setImageModalOpen(false);

  // メニューモーダルのハンドラー
  const handleMenuModalOpen = () => setIsMenuModalOpen(true);
  const handleMenuModalClose = () => setIsMenuModalOpen(false);

  // お気に入りボタンのクリックハンドラー
  const handleFavoriteClick = async () => {
    if (!user) { // ログイン済みでない場合、ログインモーダルを表示
      setShowLoginModal(true);
      return;
    }

    try {
      setIsFavoriteLoading(true);

      if (isFavorited) {
        // お気に入りから削除
        await removeFavorite(user.uid, id);
      } else {
        // お気に入り追加
        await addFavorite(user.uid, id);
      }

      // 状態を更新
      setIsFavorited(!isFavorited);
    } catch (error) {
      console.error('お気に入り処理エラー：', error);
    } finally {
      setIsFavoriteLoading(false);
    }
  };

  // レビューモーダルを開く
  const handleReviewModalOpen = () => {
    if (!user) { // ログイン済みでない場合、ログインモーダルを表示
      setShowLoginModal(true);
      return;
    }
    setIsReviewModalOpen(true)
  };

  // レビューモーダルを閉じる
  const handleReviewModalClose = () => {
    setIsReviewModalOpen(false);
    // 入力内容をリセット
    setReviewRating(3);
    setReviewContent('');
    setSelectedImage(null);
    setSelectedFile(null);
  };

  // 画像選択処理
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  // レビュー投稿処理
  const handleSubmitReview = async () => {
    try {
      if (!user) {
        // ユーザーがログインしていない場合
        setShowLoginModal(true);
        return;
      }

      if (!reviewContent.trim()) {
        alert('レビュー内容を入力してください。');
        return;
      }

      setIsSubmitting(true);

      // レビューデータの準備
      const reviewData = {
        rating: reviewRating,
        content: reviewContent,
        imageFile: selectedFile
      };

      // レビュー投稿
      const success = await addReview(reviewData);

      if (success) {
        // 投稿成功
        handleReviewModalClose();
        // 店舗情報を再取得 (評価が更新されるため)
        fetchShopData();
      } else {
        // useReviewsフックからのエラーメッセージを表示
        const reviewsError = error || '不明なエラーが発生しました';
        alert(`レビュー投稿に失敗しました： ${reviewsError}`);
      }
    } catch (error) {
      console.error('レビュー投稿エラー：', error);
      alert(`レビュー投稿に失敗しました： ${error.message || '不明なエラーが発生しました'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ローディング中の表示
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>読み込み中...</p>
      </div>
    );
  }

  // エラーがある場合の表示
  if (error && !shop) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => router.push('/search')}
          className="mt-4 bg-[#83BC87] text-white py-2 px-4 rounded-lg"
        >
          店舗一覧に戻る
        </button>
      </div>
    );
  }

  // 店舗データがない場合
  if (!shop) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>店舗情報が見つかりません</p>
      </div>
    );
  }

  // レビューセクションのレンダリング
  const renderReviewSection = () => {
    if (reviewsLoading) {
      return <div className="text-center py-4">口コミを読み込み中...</div>;
    }

    if (reviewsError) {
      return (
        <div className="text-center py-4">
          <p className="text-red-500">{reviewsError}</p>
          <button
            onClick={refreshReviews}
            className="mt-2 px-4 py-1 bg-green-100 text-green-800 rounded-full"
          >
            再読み込み
          </button>
        </div>
      );
    }

    if (!reviews || reviews.length === 0) {
      return <div className="text-center py-4">まだ口コミがありません。最初の口コミを投稿しませんか？</div>;
    }

    return reviews.map((review) => {
      // 投稿者のアイコンを使用（投稿者のアイコンがない場合はデフォルト）
      const avatarUrl = review.userAvatarUrl || '/default-user-icon.png';

      return (
        <ReviewCard
          key={review.id}
          id={review.id}
          userName={review.userName}
          date={review.date}
          shopName={shop?.name}
          shopId={shop?.id}
          rating={review.rating}
          content={review.content}
          likes={review.likes || 0}
          likedBy={review.likedBy || []}
          avatarUrl={avatarUrl}
          onLikeToggle={refreshReviews} // いいねが変更されたら口コミを再読み込み
        />
      );
    });
  };

  return (
    <>
      <div className="pb-20">

        {/* 店舗情報 */}
        <div className="p-4 max-w-[900px] mx-auto">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-bold">{shop.name}</h1>
            <button
              onClick={() => router.push(`/shops/edit/${id}`)}
              className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 py-1 px-2 rounded border border-gray-300"
            >
              店舗情報修正
            </button>
          </div>
          {/* 店舗画像カルーセル */}
          <div
            className="w-full h-64 relative bg-[#ffe7d8] rounded-lg overflow-hidden cursor-pointer"
            style={{ minHeight: '200px', maxHeight: '400px', aspectRatio: '16/9'}}
            onClick={handleImageModalOpen}
          >
            {/* 現在の画像 */}
            <Image
              src={getShopImages(shop.name)[currentImageIndex]}
              alt={`${shop.name}の画像 ${currentImageIndex + 1}`}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
            {/* 複数画像がある場合のみナビゲーションボタンを表示 */}
            {getShopImages(shop.name).length > 1 && (
              <>
                {/* 前の画像ボタン */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPreviousImage();
                  }}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/70 rounded-full p-1 hover:bg-white/90 transition-colors"
                  aria-label="前の画像"
                >
                  <ArrowBackIosNewIcon fontSize="medium" />
                </button>

                {/* 次の画像ボタン */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNextImage();
                  }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/70 rounded-full p-1 hover:bg-white/90 transition-colors"
                  aria-label="次の画像"
                >
                  <ArrowForwardIosIcon fontSize="medium" />
                </button>

                {/* 画像インジゲーター */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {getShopImages(shop.name).map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex(index);
                      }}
                      className={`w-3 h-3 rounded-full ${index === currentImageIndex ? 'bg-[#83BC87]' : 'bg-white/70'}`}
                      aria-label={`画像 ${index + 1} に移動`}
                    />
                  ))}
                </div>
              </>
            )}
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
              <span className="text-sm ml-1">
                {reviews ? reviews.length : 0}レビュー
              </span>
            </div>
          </div>

          <div className="space-y-2 mb-3">

            <div className="flex items-center text-gray-600">
              <LocationOnOutlinedIcon sx={{ fontSize: '1rem' }} className="mr-1" />
              <span className="text-sm">住所：{shop.prefecture + shop.city + shop.address}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <AccessTime sx={{ fontSize: '1rem' }} className="mr-1" />
              <span className="text-sm">
                営業時間：{formatBusinessHours(shop.businessHours)}
              </span>
            </div>
            <div className="flex items-center text-gray-600">
              <EventBusyOutlinedIcon sx={{ fontSize: '1rem' }} className="mr-1" />
              <span className="text-sm">定休日：{shop.closedDays}</span>
            </div>
          </div>

          {/* メニュー情報、お気に入り登録、マップを見る、口コミ投稿ボタン */}
          <div className="flex flex-wrap gap-6 justify-center items-center">
          <button
            onClick={handleMenuModalOpen}
            className="w-[46%] bg-[#83BC87] text-[#41372F] border-2 border-[#41372F] py-3 rounded-full flex items-center justify-center gap-1"
          >
              <IoBookOutline sx={{ fontSize: '1rem', color: '#FF7474' }} />
              メニュー情報
            </button>
            <button
              onClick={handleFavoriteClick}
              disabled={isFavoriteLoading}
              className={`w-[46%] ${isFavorited ? 'bg-[#FF8E8E]' : 'bg-[#FFCACA]'} text-[#41372F] border-2 border-[#41372F] py-3 rounded-full flex items-center justify-center gap-1 whitespace-nowrap`}>
              <Favorite sx={{ fontSize: '1rem', color: '#FF7474' }} />
              {isFavorited ? 'お気に入り登録済' : 'お気に入り登録'}
            </button>
            <button
              onClick={() => router.push(`/map?shopId=${id}`)}
              className="w-[46%] bg-[#B0E6FF] text-[#41372F] border-2 border-[#41372F] py-3 rounded-full flex items-center justify-center gap-1"
            >
              <LocationOnOutlinedIcon />
              マップを見る
            </button>
            <button
              onClick={handleReviewModalOpen}
              className="w-[46%] bg-[#ececec] text-[#41372F] border-2 border-[#41372F] py-3 rounded-full flex items-center justify-center gap-1"
            >
              <FaRegPenToSquare />
              口コミを投稿
            </button>
          </div>

          {/* 画像拡大モーダル */}
          <Modal
            open={imageModalOpen}
            onClose={handleImageModalClose}
            aria-labelledby="image-modal-title"
          >
            <Box className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-5xl bg-white p-4 rounded-lg shadow-lg'>
              <div className="flex justify-between items-center mb-4">
                <h2 id="image-modal-title" className="text-xl font-bold">
                  {shop.name}の写真
                </h2>
                <button onClick={handleImageModalClose}>
                  <CloseIcon />
                </button>
              </div>

              <div className="relative w-full" style={{ height: '70vh', maxHeight: '80vh' }}>
                <Image
                  src={getShopImages(shop.name)[currentImageIndex]}
                  alt={`${shop.name}の画像 ${currentImageIndex + 1}`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 95vw, 1024px"
                  priority
                />

                {getShopImages(shop.name).length > 1 && (
                  <>
                    {/* 前の画像ボタン */}
                    <button
                      onClick={goToPreviousImage}
                      className="absolute left-2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/70 rounded-full p-2 hover:bg-white/90 transition-colors"
                      aria-label="前の画像"
                    >
                      <ArrowBackIosNewIcon fontSize="large" />
                    </button>

                    {/* 次の画像ボタン */}
                    <button
                      onClick={goToNextImage}
                      className="absolute right-2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/70 rounded-full p-2 hover:bg-white/90 transition-colors"
                      aria-label="次の画像"
                    >
                      <ArrowForwardIosIcon fontSize="large" />
                    </button>
                  </>
                )}
              </div>

              {/* サムネイル一覧 */}
              {getShopImages(shop.name).length > 1 && (
                <div className="flex justify-center gap-2 mt-4 overflow-x-auto">
                  {getShopImages(shop.name).map((src, index) => (
                    <div
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative h-16 w-16 cursor-pointer border-2 rounded ${
                        index === currentImageIndex ? 'border-[#83BC87]' : 'border-transparent'
                      }`}
                    >
                      <Image
                        src={src}
                        alt={`${shop.name}のサムネイル ${index + 1}`}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  ))}
                </div>
              )}
            </Box>
          </Modal>

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
                disabled={!reviewContent.trim() || isSubmitting}
                className={`w-full py-3 rounded-lg ${
                  reviewContent.trim() && !isSubmitting
                    ? 'bg-[#83BC87] text-white cursor-pointer'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? '投稿中...' : '投稿'}
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

                {shop.menus && shop.menus.length > 0 ? ( // 店舗のメニュー情報があるか確認
                  shop.menus.map((menu, index) => ( // メニュー情報がある場合、１つずつメニューを取り出す
                    <div key={index} className="border-b pb-3">
                      <div className="flex justify-between items-center">
                        <h3 className="font-bold">{menu.menuName}</h3>
                        <span className="text-red-600">¥{menu.menuPrice}</span>
                      </div>
                    </div>
                  ))
                ) : ( // メニュー情報がない場合のメッセージ表示
                  <p className="text-center text-gray-500">メニュー情報がありません</p>
                )}
              </div>
            </Box>
          </Modal>

          {/* レビュー一覧 */}
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">口コミ一覧</h2>
            {renderReviewSection()}
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
