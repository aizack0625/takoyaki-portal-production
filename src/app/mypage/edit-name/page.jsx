'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EditNamePage() {
  const router = useRouter();
  const [newUsername, setNewUsername] = useState('');

  // TODO: 実際のユーザー名を取得する処理を追加
  const currentUsername = '相澤';

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: ユーザー名の更新処理を実装
    console.log('新しいユーザー名:', newUsername);
    router.push('/mypage');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-xl font-bold text-center mb-8">
          現在のユーザーネーム
        </h1>

        <p className="text-center text-lg mb-12">
          {currentUsername}
        </p>

        <h2 className="text-center mb-4">
          新しいユーザーネームを入力してください
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            className="w-full px-4 py-3 border-2 border-[#83BC87] rounded-lg focus:outline-none focus:border-[#5F8E63]"
            placeholder="新しいユーザーネーム"
            required
          />

          <button
            type="submit"
            className="w-full bg-[#B5D4C4] text-[#41372F] py-3 rounded-lg hover:bg-[#9FC1AE] transition-colors"
          >
            変更する
          </button>
        </form>
      </div>
    </div>
  );
}
