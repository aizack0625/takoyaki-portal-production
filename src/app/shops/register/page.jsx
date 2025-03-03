'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogActions, Button } from "@mui/material";
import { registerShop } from "../../services/shopService"; // 店舗登録サービスをインポート

const ShopRegisterPage = () => {
  const router = useRouter();

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false); // モーダル表示の状態管理
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false); // 完了モーダル表示の状態管理
  const [loading, setLoading] = useState(false); // 店舗登録処理中の状態管理

  // 店舗の各情報を管理
  const [formData, setFormData] = useState({
    name: '',
    prefecture: '',
    city: '',
    address: '',
    postalCode: '',
    businessHours: [{
      start: '',
      end: '',
    }],
    closedDays: '',
    menus: [{ menuName: '', menuPrice: '' }],
  });

  // フォーム送信時の処理
  const handleSubmit = (e) => {
    e.preventDefault();
    // モーダルを表示
    setIsConfirmModalOpen(true);
  };

  // 確認モーダルで「はい」を選択した時の処理
  const handleConfirm = async () => {
    try {
      setLoading(true);
      // shopServiceを使用して店舗情報を登録
      await registerShop(formData);
      setIsConfirmModalOpen(false);
      setIsCompleteModalOpen(true);
    } catch (error) {
      console.error('店舗登録に失敗しました：', error);
      alert('店舗の登録に失敗しました。もう一度お試しください。');
      setIsConfirmModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  // 確認モーダルで「いいえ」を選択した時の処理
  const handleCancel = () => {
    setIsConfirmModalOpen(false);
  }

  // 完了モーダルの「店舗一覧へ」ボタンを押した時の処理
  const handleGoToList = () => {
    setIsCompleteModalOpen(false);
    router.push('/search');
  }

  // フォームの入力値を管理し、setFormDataを使って
  // 状態(formData)を更新する
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // 営業時間の追加処理
  const handleAddBusinessHour = () => {
    setFormData(prev => ({
      ...prev,
      businessHours: [...prev.businessHours, { start: '', end: '' }]
    }));
  };

  // 営業時間の削除処理
  const handleRemoveBusinessHour = (index) => {
    const isConfirmed = window.confirm("この営業時間を削除してもよろしいですか？");
    if (!isConfirmed) return;

    setFormData(prev => ({
      ...prev,
      businessHours: prev.businessHours.filter((_, i) => i !== index)
    }));
  };

  // 営業時間の入力値を更新する処理
  const handleBusinessHourChange = (index, e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      businessHours: prev.businessHours.map((businessHour, i) =>
        i === index ? {...businessHour, [name]: value } : businessHour
      )
    }));
  };


  // メニューの追加処理
  const handleAddMenu = () => {
    setFormData(prev => ({
      ...prev,
      menus: [...prev.menus, { menuName: '', menuPrice: ''}]
    }));
  };

  // メニューの削除処理
  const handleRemoveMenu = (index) => {
    const isConfirmed = window.confirm("このメニューを削除してもよろしいですか？");
    if (!isConfirmed) return;

    setFormData(prev => ({
      ...prev,
      menus: prev.menus.filter((_, i) => i !== index)
    }));
  };

  // メニューの入力値を更新する処理
  const handleMenuChange = (index, e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      menus: prev.menus.map((menu, i) =>
        i === index ? {...menu, [name]: value } : menu
      )
    }));
  };

  return (
    <div className="container mx-auto px-4 py-6 mb-14">
      <h1 className="text-xl font-bold mb-6">店舗情報の登録</h1>

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
            <option value="">選択</option>
            <option value="大阪府">大阪府</option>
            <option value="京都府">京都府</option>
            <option value="東京都">東京都</option>
            {/* 他の都道府県もここで追加可能 */}
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
            番地
            <span className="text-xs text-white bg-[#FF8E8E] rounded px-2 ml-2">
              必須
            </span>
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            placeholder="例：1丁目2-34 (半角数字)"
            required
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
            value={formData.postalCode}
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
                onChange={(e) => handleBusinessHourChange(index, e)}
                className="w-full p-3 border rounded-lg"
                placeholder="開始時間"
              />
              <span>〜</span>
              <input
                type="text"
                name="end"
                value={businessHours.end || ""}
                onChange={(e) => handleBusinessHourChange(index, e)}
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
            value={formData.closedDays}
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

        {/* 店舗画像 */}
        <div>
          <label className="block text-sm mb-2">店舗の写真</label>
          <button
            type="button"
            className="w-full h-32 border-2 border-dashed border-[#83BC87] rounded-lg flex items-center justify-center text-[#83BC87]">
              画像をアップロード
            </button>
        </div>

        {/* 登録ボタン */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#83BC87] text-white py-3 rounded-lg mt-8 disabled:bg-gray-300"
        >
          {loading ? '登録中...' : '登録する'}
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
          <p>入力した内容で新規店舗登録します。</p>
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
            disabled={loading}
            variant="contained"
            style={{
              backgroundColor: '#FFB7B7',
              color: 'white',
              borderRadius: '4px',
              minWidth: '120px',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? '登録中...' : 'はい'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 登録完了モーダル */}
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
          <p>新規店舗登録が完了しました。</p>
        </DialogContent>
        <DialogActions className="flex justify-center pb-4">
          <Button
            onClick={handleGoToList}
            variant="contained"
            style={{
              backgroundColor: '#FFB7B7',
              color: 'white',
              borderRadius: '4px',
              minWidth: '120px',
            }}
          >
            店舗一覧へ
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ShopRegisterPage;
