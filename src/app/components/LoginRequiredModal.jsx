'use client';

import { useRouter } from "next/navigation";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

export const LoginRequiredModal = ({ open, onClose }) => {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/login');
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="login-required-modal"
    >
      <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">ログインが必要です</h2>
        <p className="text-gray-600 mb-6">
          この機能を利用するにはログインが必要です。
          ログインまたは新規登録を行なってください。
        </p>
        <div className="flex gap-4">
          <button
            onClick={handleLogin}
            className="flex-1 bg-[#83BC87] text-white py-2 rounded-full hover:bg-[#75a879]"
          >
            ログインする
          </button>
          <button
            onClick={onClose}
            className="flex-1 border border-gray-300 py-2 rounded-full hover:bg-gray-50"
          >
            キャンセル
          </button>
        </div>
      </Box>
    </Modal>
  )
}
