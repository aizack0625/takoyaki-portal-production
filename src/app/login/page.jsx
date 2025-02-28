'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext'
import GoogleIcon from '@mui/icons-material/Google';

export default function Login() {
  const [email, setEmail] = useState(''); // ログイン時のメールアドレス管理
  const [password, setPassword] = useState(''); // ログイン時のPW管理
  const [error, setError] = useState(''); // ログインエラー管理
  const [loading, setLoading] = useState(false); // ログイン処理かんり
  const router = useRouter();
  const { login, googleLogin, guestLogin } = useAuth(); // Firebase Auth認証

  // メールアドレス、パスワード認証
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(email,password);
      router.push('/');
    } catch (err) {
      setError('メールアドレスまたはパスワードが正しくありません');
    } finally {
      setLoading(false);
    }
  };

  // Googleログイン認証
  const handleGoogleLogin = async () => {
    try {
      setError('');
      setLoading(true);
      await googleLogin();
      router.push('/');
    } catch (err) {
      setError('Googleログインに失敗しました');
    } finally {
      setLoading(false);
    }
  }

  // ゲストログイン認証
  const handleGuestLogin = async () => {
    try {
      setError('');
      setLoading(true);
      await guestLogin();
      router.push('/');
    } catch (err) {
      setError('ゲストログインに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-[#FFF8F2]'>
      <div className='container mx-auto px-4 py-12 max-w-md'>
        <h1 className='text-2xl font-bold text-center text-[#83BC87] mb-8'>
          ログイン
        </h1>

        <div className='bg-white p-8 rounded-2xl shadow-md'>

          {/* エラー発生時の表示 */}
          {error && (
            <div className='mb-4 p-3 bg-red-100 text-red-700 rounded-lg'>
              {error}
            </div>
          )}

          {/* Googleログインボタン */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className='w-full mb-8 py-3 px-4 border-2 border-[#83BC87] rounded-full flex items-center justify-center gap-3 text-[#83BC87] hover:bg-[#83BC87] hover:text-white transition-all font-medium disabled:opacity-50'
          >
            <GoogleIcon />
            Googleでログイン
          </button>

          {/* ゲストログインボタン */}
          <button
            onClick={handleGuestLogin}
            disabled={loading}
            className='w-full mb-8 py-3 px-4 border-2 border-gray-300 rounded-full flex items-center justify-center gap-3 text-gray-600 hover:bg-gray-100 transition-all font-medium disabled:opacity-50'
          >
            ゲストとしてログイン
          </button>

          <div className='flex items-center gap-4 mb-8'>
            <div className='h-px bg-gray-300 flex-1'></div>
            <span className='text-gray-500'>または</span>
            <div className='h-px bg-gray-300 flex-1'></div>
          </div>

          {/* メールアドレスログインフォーム */}
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-gray-700 mb-2'>
                  メールアドレス
              </label>
              <input
                type='email'
                id='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='example@email.com'
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#83BC87] focus:border-transparent transition-all'
                required
              />
            </div>

            <div>
              <label
                htmlFor='password'
                className='block text-sm font-medium text-gray-700 mb-2'>
                  パスワード
              </label>
              <input
                type='password'
                id='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='パスワードを入力'
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#83BC87] focus:border-transparent transition-all'
                required
              />
            </div>

            <div className='text-right'>
              <Link href="/forgot-password" className='text-sm text-red-500 hover:text-red-600 hover:underline'>
                パスワードをお忘れの方はこちら
              </Link>
            </div>

            <button
              type='submit'
              disabled={loading}
              className='w-full bg-[#83BC87] text-white py-3 rounded-full hover:bg-[#75a879] transition-all font-medium text-lg shadow-sm disabled:opacity-50'
            >
              ログイン
            </button>
          </form>

          {/* 新規登録リンク */}
          <div className='mt-8 text-center'>
            <p className='text-gray-600'>
              アカウントをお持ちでない方は
            </p>
            <Link
              href="/signup"
              className='block mt-2 text-[#83BC87] font-medium hover:text-[75a879] hover:underline'>
                新規登録はこちら
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
