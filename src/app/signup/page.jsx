'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import GoogleIcon from '@mui/icons-material/Google';

export default function Signup() {
  const [email, setEmail] = useState(''); // メールアドレス管理
  const [password, setPassword] = useState(''); // パスワード管理
  const [error, setError] = useState(''); // エラー状態管理
  const [loading, setLoading] = useState(false); // 読み込み中の状態管理
  const router = useRouter()
  const { signup, googleLogin, guestLogin } = useAuth();

  // メールアドレス、PWでの新規登録認証
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 8) {
      setError('パスワードは８文字以上で入力してください');
      return;
    }
    try {
      setError('');
      setLoading(true);
      await signup(email, password);
      router.push('/');
    } catch (err) {
      setError('アカウントの作成に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // Googleアカウント新規登録認証
  const handleGoogleSignup = async () => {
    try {
      setError('');
      setLoading(true);
      await googleLogin();
      router.push('/');
    } catch (err) {
      setError('Googleアカウントの登録に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // ゲスト登録認証
  const handleGuestSignUp = async () => {
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
    <div className='min-h-screen bg-[#FFF8F2] pb-14'>
      <div className='container mx-auto px-4 py-12 max-w-md'>
        <h1 className='text-2xl font-bold text-center text-[#83BC87] mb-8'>
          新規アカウント登録
        </h1>

        <div className='bg-white p-8 rounded-2xl shadow-md'>

          {/* エラー発生時の表示 */}
          {error && (
            <div className='mb-4 p-3 bg-red-100 text-red-700 rounded-lg'>
              {error}
            </div>
          )}

          {/* Google登録ボタン */}
          <button
            onClick={handleGoogleSignup}
            disabled={loading}
            className='w-full mb-4 py-3 px-4 border-2 border-[#83BC87] rounded-full flex items-center justify-center gap-3 text-[#83BC87] hover:bg-[#83BC87] hover:text-white transition-all font-medium disabled:opacity-50'
          >
            <GoogleIcon />
            Googleアカウントで登録
          </button>

          {/* ゲスト登録ボタン */}
          <button
            onClick={handleGuestSignUp}
            disabled={loading}
            className='w-full mb-8 py-3 border-2 border-gray-300 rounded-full flex items-center justify-center gap-3 text-gray-600 hover:bg-gray-100 transition-all font-medium disabled:opacity-50'
          >
            ゲストとして利用開始
          </button>

          <div className='flex items-center gap-4 mb-8'>
            <div className='h-px bg-gray-300 flex-1'></div>
            <span className='text-gray-500'>または</span>
            <div className='h-px bg-gray-300 flex-1'></div>
          </div>

          {/* メールアドレス登録フォーム */}
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
                placeholder='８文字以上で入力してください'
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
              登録する
            </button>
          </form>

          {/* ログインリンク */}
          <div className='mt-8 text-center'>
            <p className='text-gray-600'>
              すでにアカウントをお持ちの場合
            </p>
            <Link
              href="/login"
              className='block mt-2 text-[#83BC87] font-medium hover:text-[75a879] hover:underline'>
                ログインはこちら
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
