'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";

export default function EditNamePage() {
  const router = useRouter();
  const { user, updateUsername } = useAuth(); // ユーザー名変更認証
  const [newUsername, setNewUsername] = useState(''); // ログイン時にユーザー名の表示を管理
  const [error, setError] = useState(''); // ユーザー名変更エラー管理
  const [loading, setLoading] = useState(false); // ユーザー名変更読み込み管理
  const [showSuccessModal, setShowSuccessModal] = useState(false); // ユーザー名変更完了モーダル表示管理

  // 現在のユーザー名を取得
  const currentUsername = user?.displayName || (user?.isAnonymous ? 'ゲストユーザー' : user?.email?.split('@')[0] || 'ユーザー');

  // ユーザー名変更ボタンのハンドリング
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ユーザー名が空白時のエラー処理「
    if (newUsername.trim() === '') {
      setError('ユーザー名を入力してください')
      return;
    }

    // 現在のユーザー名と同じ時のエラー処理
    if (newUsername === currentUsername) {
      setError('現在のユーザー名と同じです');
      return
    }

    try {
      setError('');
      setLoading(true);
      await updateUsername(newUsername);
      setShowSuccessModal(true);

      // ３秒後にマイページに戻る
      setTimeout(() => {
        router.push('/mypage');
      }, 2000);
    } catch (err) {
      setError('ユーザー名の更新に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
      <div className="flex items-centermb-6">
        <Link href="/mypage" className="flex items-center text-gray-600 hover:text-gray-800">
          <IoArrowBack className="mr-2" />
          マイページに戻る
        </Link>
      </div>
        <h1 className="text-xl font-bold text-center mb-8">
          {/* ユーザー名変更 */}
        </h1>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-center mb-8">
            現在のユーザーネーム
            <span className="font-bold text-lg block mt-2">
              {currentUsername}
            </span>
          </p>
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                新しいユーザーネーム
              </label>
              <input
                type="text"
                id="username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#83BC87] rounded-lg focus:outline-none focus:border-[#5F8E63]"
                placeholder="新しいユーザーネームを入力"
                disabled={loading}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#83BC87] text-white py-3 rounded-full hover:bg-[#75a879] transition-all font-medium disabled:opacity-50"
            >
              {loading ? '更新中' : '変更する'}
            </button>
          </form>
        </div>
        {/* 変更成功時のモーダル */}
        <Modal
          open={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
        >
          <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="text-xl font-bold text-[#83BC87] mb-2">
              ユーザーネームを変更しました
            </p>
            <p className="text-gray-600">
              新しいユーザーネーム：{newUsername}
            </p>
          </Box>
        </Modal>
      </div>
    </div>
  );
}
