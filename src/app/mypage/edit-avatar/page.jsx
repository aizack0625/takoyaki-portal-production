'use client';

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from 'next/image';

export default function EditAvatarPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('/default-user-icon.png');

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const imageUrl = URL.createObjectURL(file);
      setPreviewUrl(imageUrl);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedImage) return;

    // TODO: 画像アップロード処理を実装する
    console.log('アップロードする画像:', selectedImage);
    router.push('/mypage');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="flex flex-col items-center space-y-8">
          {/* プレビュー画像 */}
          <div className="w-32 h-32 relative rounded-full border-2 border-[#83BC87] overflow-hidden">
            <Image
              src={previewUrl}
              alt="ユーザーアイコン"
              fill
              className="object-cover"
            />
          </div>

          {/* 画像アップロードボタン */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />

          <button
            onClick={handleUploadClick}
            className="w-full bg-[#B5D4C4] text-[#41372F] py-3 rounded-lg hover:bg-[#9FC1AE] transition-colors"
          >
            画像をアップロード
          </button>

          {/* 変更ボタン */}
          <button
            onClick={handleSubmit}
            disabled={!selectedImage}
            className={`w-full py-3 rounded-lg transition-colors ${
              selectedImage
                ? 'bg-[#83BC87] text-white hover:bg-[#5F8E63]'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            >
              変更する
            </button>
        </div>
      </div>
    </div>
  )
}
