'use client';

import { useState } from "react";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    <div>
      aaaaaa
    </div>
  )
}
export default ChangePassword;
