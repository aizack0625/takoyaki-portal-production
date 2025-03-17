'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { Dialog, DialogContent, DialogActions, Button, CircularProgress } from '@mui/material';
import { getShopById, updateShop } from '../../../services/shopService';
import { useAuth } from '../../../contexts/AuthContext';
import { LoginRequiredModal } from '../../../components/LoginRequiredModal';

// 営業時間の文字列を配列に変換する関数
const parseBusinessHours = (businessHours) => {
  if (!businessHours) return [{ start: '', end: '' }];
  if (Array.isArray(businessHours)) return businessHours;

  // 文字列の場合（例: "10:00~18:00, 19:00~22:00"）
  return businessHours.split(', ').map(hour => {
    const [start, end] = hour.split('~');
    return { start: start || '', end: end || '' };
  });
};

const ShopEditPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const { user } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);

  // フォームデータの状態
  const [formData, setFormData] = useState({
    name: '',
    prefecture: '',
    city: '',
    address: '',
    postalCode: '',
    businessHours: [{ start: '', end: '' }],
    closedDays: '',
    menus: [{ menuName: '', menuPrice: '' }],
  });

  // ログイン状態のチェック
  useEffect(() => {
    if (!user) {
      setShowLoginModal(true);
    }
  }, [user]);

  // 店舗データの取得
  useEffect(() => {
    const fetchShopData = async () => {
      if (!user) {
        return; // ログインしていない場合は処理を行わない
      }

      setLoading(true);
      try {
        const shopData = await getShopById(id);
        // メニューがない場合は空の配列を設定
        if (!shopData.menus) {
          shopData.menus = [{ menuName: '', menuPrice: '' }];
        }

        // 営業時間を配列形式に変換
        shopData.businessHours = parseBusinessHours(shopData.businessHours);

        setFormData(shopData);
        setError(null);
      } catch (err) {
        console.error('店舗データの取得に失敗しました:', err);
        setError('店舗情報の読み込みに失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchShopData();
  }, [id, user]);

  // 入力値変更ハンドラ
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 営業時間フォーム変更ハンドラ
  const handleBusinessHoursChange = (index, e) => {
    const { name, value } = e.target;
    const updatedHours = [...formData.businessHours];
    updatedHours[index] = {
      ...updatedHours[index],
      [name]: value,
    };
    setFormData((prev) => ({
      ...prev,
      businessHours: updatedHours,
    }));
  };

  // 営業時間フォーム追加ハンドラ
  const handleAddBusinessHour = () => {
    setFormData((prev) => ({
      ...prev,
      businessHours: [...prev.businessHours, { start: '', end: '' }],
    }));
  };

  // 営業時間フォーム削除ハンドラ
  const handleRemoveBusinessHour = (index) => {
    const isConfirmed = window.confirm("この営業時間を削除してもよろしいですか？");
    if (!isConfirmed) return;

    const updatedHours = [...formData.businessHours];
    updatedHours.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      businessHours: updatedHours.length ? updatedHours : [{ start: '', end: '' }],
    }));
  };

  // メニュー変更ハンドラ
  const handleMenuChange = (index, e) => {
    const { name, value } = e.target;
    const updatedMenus = [...formData.menus];
    updatedMenus[index] = {
      ...updatedMenus[index],
      [name]: value,
    };
    setFormData((prev) => ({
      ...prev,
      menus: updatedMenus,
    }));
  };

  // メニュー追加ハンドラ
  const handleAddMenu = () => {
    setFormData((prev) => ({
      ...prev,
      menus: [...prev.menus, { menuName: '', menuPrice: '' }],
    }));
  };

  // メニュー削除ハンドラ
  const handleRemoveMenu = (index) => {
    const isConfirmed = window.confirm("このメニューを削除してもよろしいですか？");
    if (!isConfirmed) return;

    const updatedMenus = [...formData.menus];
    updatedMenus.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      menus: updatedMenus.length ? updatedMenus : [{ menuName: '', menuPrice: '' }],
    }));
  };

  // フォーム送信ハンドラ
  const handleSubmit = (e) => {
    e.preventDefault();
    // 必須項目のチェック
    if (!formData.name || !formData.prefecture || !formData.city) {
      alert('店舗名、都道府県、市区町村は必須項目です');
      return;
    }
    setIsConfirmModalOpen(true);
  };

  // 確認モーダルで「更新する」を選択
  const handleConfirm = async () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    setSubmitting(true);
    try {
      await updateShop(id, formData);
      setIsConfirmModalOpen(false);
      setIsCompleteModalOpen(true);
    } catch (error) {
      console.error('店舗更新に失敗しました:', error);
      alert(`店舗の更新に失敗しました: ${error.message}`);
      setIsConfirmModalOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  // 確認モーダルで「キャンセル」を選択
  const handleCancel = () => {
    setIsConfirmModalOpen(false);
  };

  // 完了モーダルで「店舗詳細に戻る」を選択
  const handleCompleteClose = () => {
    setIsCompleteModalOpen(false);
    router.push(`/shops/${id}`);
  };

  // ログインモーダルを閉じた時のハンドラ
  const handleLoginModalClose = () => {
    router.push(`/shops/${id}`); // 店舗詳細ページに戻る
  };

  // ログインしていない場合は、ログインモーダルのみ表示
  if (!user) {
    return (
      <LoginRequiredModal
        open={showLoginModal}
        onClose={handleLoginModalClose}
      />
    );
  }

  // ローディング表示
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CircularProgress />
        <span className="ml-2">店舗情報を読み込み中...</span>
      </div>
    );
  }

  // エラー表示
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => router.push(`/shops/${id}`)}
          className="mt-4 bg-[#83BC87] text-white py-2 px-4 rounded-lg"
        >
          店舗詳細に戻る
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-6 mb-14 max-w-[900px]">
        <h1 className="text-xl font-bold mb-6">店舗情報の修正</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 店舗名 */}
          <div>
            <label className="block text-sm mb-2">
              店舗名
              <span className="text-xs text-white bg-[#FF8E8E] rounded px-2 ml-2">
                必須
              </span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
              required
            />
          </div>

          {/* 都道府県 */}
          <div>
            <label className="block text-sm mb-2">
              都道府県
              <span className="text-xs text-white bg-[#FF8E8E] rounded px-2 ml-2">
                必須
              </span>
            </label>
            <select
              name="prefecture"
              value={formData.prefecture}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
              required
            >
              <option
                value=""
                disabled
              >
                選択してください
              </option>
              <optgroup label="北海道・東北">
                <option value="北海道">北海道</option>
                <option value="青森県">青森県</option>
                <option value="岩手県">岩手県</option>
                <option value="宮城県">宮城県</option>
                <option value="秋田県">秋田県</option>
                <option value="山形県">山形県</option>
                <option value="福島県">福島県</option>
              </optgroup>
              <optgroup label="関東">
                <option value="茨城県">茨城県</option>
                <option value="栃木県">栃木県</option>
                <option value="群馬県">群馬県</option>
                <option value="埼玉県">埼玉県</option>
                <option value="千葉県">千葉県</option>
                <option value="東京都">東京都</option>
                <option value="神奈川県">神奈川県</option>
              </optgroup>
              <optgroup label="中部">
                <option value="新潟県">新潟県</option>
                <option value="富山県">富山県</option>
                <option value="石川県">石川県</option>
                <option value="福井県">福井県</option>
                <option value="山梨県">山梨県</option>
                <option value="長野県">長野県</option>
                <option value="岐阜県">岐阜県</option>
                <option value="静岡県">静岡県</option>
                <option value="愛知県">愛知県</option>
              </optgroup>
              <optgroup label="近畿">
                <option value="三重県">三重県</option>
                <option value="滋賀県">滋賀県</option>
                <option value="京都府">京都府</option>
                <option value="大阪府">大阪府</option>
                <option value="兵庫県">兵庫県</option>
                <option value="奈良県">奈良県</option>
                <option value="和歌山県">和歌山県</option>
              </optgroup>
              <optgroup label="中国">
                <option value="鳥取県">鳥取県</option>
                <option value="島根県">島根県</option>
                <option value="岡山県">岡山県</option>
                <option value="広島県">広島県</option>
                <option value="山口県">山口県</option>
              </optgroup>
              <optgroup label="四国">
                <option value="徳島県">徳島県</option>
                <option value="香川県">香川県</option>
                <option value="愛媛県">愛媛県</option>
                <option value="高知県">高知県</option>
              </optgroup>
              <optgroup label="九州・沖縄">
                <option value="福岡県">福岡県</option>
                <option value="佐賀県">佐賀県</option>
                <option value="長崎県">長崎県</option>
                <option value="熊本県">熊本県</option>
                <option value="大分県">大分県</option>
                <option value="宮崎県">宮崎県</option>
                <option value="鹿児島県">鹿児島県</option>
                <option value="沖縄県">沖縄県</option>
              </optgroup>
            </select>
          </div>

          {/* 市区町村 */}
          <div>
            <label className="block text-sm mb-2">
              市区町村
              <span className="text-xs text-white bg-[#FF8E8E] rounded px-2 ml-2">
                必須
              </span>
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
              required
            />
          </div>

          {/* 番地 */}
          <div>
            <label className="block text-sm mb-2">
              番地以降
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
              placeholder="例：1丁目2-34 (半角数字)　ビル名など"
            />
          </div>

          {/* 郵便番号 */}
          <div>
            <label className="block text-sm mb-2">
              郵便番号
            </label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode || ''}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />
          </div>

          {/* 営業時間 */}
          <div>
            <label className="block text-sm mb-2">
              営業時間
              <span className="text-xs text-gray-500 ml-2">
                ※半角数字で入力してください（例：18:30）
              </span>
            </label>
            {formData.businessHours.map((businessHours, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  name="start"
                  value={businessHours.start || ""}
                  onChange={(e) => handleBusinessHoursChange(index, e)}
                  className="w-full p-3 border rounded-lg"
                  placeholder="開始時間"
                />
                <span>〜</span>
                <input
                  type="text"
                  name="end"
                  value={businessHours.end || ""}
                  onChange={(e) => handleBusinessHoursChange(index, e)}
                  className="w-full p-3 border rounded-lg"
                  placeholder="終了時間"
                />
                {/* 削除ボタン */}
                <button
                  type="button"
                  onClick={() => handleRemoveBusinessHour(index)}
                  className="px-3 py-2 bg-red-500 text-white rounded-lg whitespace-nowrap"
                >
                  削除
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddBusinessHour}
              className="w-full bg-blue-400 text-white py-2 rounded-lg mt-2"
            >
              営業時間を追加
            </button>
          </div>

          {/* 定休日 */}
          <div>
            <label className="block text-sm mb-2">定休日</label>
            <input
              type="text"
              name="closedDays"
              value={formData.closedDays || ''}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
              placeholder="例：水曜日、第１月曜日など"
            />
          </div>

          {/* メニュー情報登録 */}
          <div>
            <label className="block text-sm mb-2">メニュー情報</label>
            {/* map関数でボタンを押してメニュー情報を繰り返し表示 */}
            {formData.menus.map((menu, index) => (
              <div key={index} className="flex gap-2 mb-2">
                {/* メニュー名 */}
                <input
                  type="text"
                  name="menuName"
                  value={menu.menuName}
                  onChange={(e) => handleMenuChange(index, e)}
                  className="w-1/2 p-3 border rounded-lg"
                  placeholder="メニュー名"
                />
                {/* 価格 */}
                <div className="flex items-center">
                  <input
                    type="text"
                    name="menuPrice"
                    value={menu.menuPrice}
                    onChange={(e) => handleMenuChange(index, e)}
                    className="w-1/2 p-3 border rounded-lg"
                    placeholder="金額"
                  />
                  <span className="text-gray-500">円</span>
                </div>
                {/* 削除ボタン */}
                <button
                  type="button"
                  onClick={() => handleRemoveMenu(index)}
                  className="px-3 py-2 bg-red-500 text-white rounded-lg whitespace-nowrap"
                >
                  削除
                </button>
              </div>
            ))}
            {/* メニュー追加ボタン */}
            <button
              type="button"
              onClick={handleAddMenu}
              className="w-full bg-blue-400 text-white py-2 rounded-lg mt-2"
            >
              メニューを追加
            </button>
          </div>

          {/* 登録ボタン */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#83BC87] text-white py-3 rounded-lg mt-8 disabled:bg-gray-300"
          >
            {submitting ? '更新中...' : '更新する'}
          </button>
        </form>

        {/* 確認モーダル */}
        <Dialog
          open={isConfirmModalOpen}
          onClose={handleCancel}
          PaperProps={{
            style: {
              borderRadius: '8px',
              padding: '16px',
            },
          }}
        >
          <DialogContent className="text-center py-4">
            <p>入力した内容で店舗情報を更新します。</p>
          </DialogContent>
          <DialogActions className="flex justify-center gap-4 pb-4">
            <Button
              onClick={handleCancel}
              variant="contained"
              style={{
                backgroundColor: '#A7C7E7',
                color: 'white',
                borderRadius: '4px',
                minWidth: '120px',
              }}
            >
              いいえ
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={submitting}
              variant="contained"
              style={{
                backgroundColor: '#FFB7B7',
                color: 'white',
                borderRadius: '4px',
                minWidth: '120px',
                opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? '更新中...' : 'はい'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* 更新完了モーダル */}
        <Dialog
          open={isCompleteModalOpen}
          PaperProps={{
            style: {
              borderRadius: '8px',
              padding: '16px',
            },
          }}
        >
          <DialogContent className="text-center py-4">
            <p>店舗情報の更新が完了しました。</p>
          </DialogContent>
          <DialogActions className="flex justify-center pb-4">
            <Button
              onClick={handleCompleteClose}
              variant="contained"
              style={{
                backgroundColor: '#FFB7B7',
                color: 'white',
                borderRadius: '4px',
                minWidth: '120px',
              }}
            >
              店舗詳細に戻る
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default ShopEditPage;
