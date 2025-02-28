'use client';

import { useState } from "react";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState(''); // 新しいPWを格納する状態変数
  const [confirmPassword, setConfirmPassword] = useState(''); // PW確認用の状態管理
  const [showNewPassword, setShowNewPassword] = useState(false); // 新しいPWの表示/非表示の状態管理
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // 確認用PWの表示/非表示の状態管理

  // パスワードの一致確認
  const handleSubmit = async (e) => {
    e.preventDefault();

    // パスワードの一致確認
    if (newPassword !== confirmPassword) {
      alert('パスワードが一致しません');
      return;
    }

    // TODO: パスワード変更APIの呼び出し
    try {
      // API呼び出しのロジックをここに実装
      console.log('パスワード変更リクエスト送信');
    } catch (error) {
      console.error('パスワード変更エラー', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h1 className="text-2xl font-bold text-center mb-8">パスワード変更</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 新しいパスワード入力 */}
        <div className="relative">
          <input
            type={showNewPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="新しいパスワードを入力してください"
            className="w-full p-3 border rounded-lg pr-10"
            required
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          >
            {showNewPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
          </button>
        </div>

        {/* 新しいパスワード確認の再入力 */}
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="確認の為、同じパスワードを再入力してください"
            className="w-full p-3 border rounded-lg pr-10"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          >
            {showConfirmPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
          </button>
        </div>

        {/* 変更するボタン */}
        <button
          type="submit"
          className="w-full bg-[#D3E4D4] hover:bg-[#C1D8C2] text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors duration-200"
        >
          変更する
        </button>
      </form>
    </div>
  )
}
export default ChangePassword;
