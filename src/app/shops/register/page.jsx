'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

const ShopRegisterPage = () => {
  const router = useRouter();
  // 店舗の各情報を管理
  const [formData, setFormData] = useState({
    name: '',
    prefecture: '',
    city: '',
    address: '',
    postalCode: '',
    businessHours: {
      start: '',
      end: '',
    },
    closedDays: '',
    menus: [],
  });

  // 店舗情報を登録したら/searchページへ遷移
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: APIを呼び出して店舗情報を登録
    console.log(formData);
    router.push('/search');
  };

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

  // メニューの追加処理
  const handleAddMenu = () => {
    setFormData(prev => ({
      ...prev,
      menus: [...prev.menus, { menuName: '', menuPrice: ''}]
    }));
  };

  // メニューの削除処理
  const handleRemoveMenu = (index) => {
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
          <div className="flex items-center gap-2">
            <input
              type="text"
              name="businessHours.start"
              value={formData.businessHours.start}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
              placeholder="開始時間"
            />
            <span>〜</span>
            <input
              type="text"
              name="businessHours.end"
              value={formData.businessHours.end}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
              placeholder="終了時間"
            />
          </div>
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
              <input
                type="text"
                name="menuPrice"
                value={menu.menuPrice}
                onChange={(e) => handleMenuChange(index, e)}
                className="w-1/3 p-3 border rounded-lg text-xs"
                placeholder="金額（数字のみ）"
              />
              {/* 削除ボタン */}
              <button
                type="button"
                onClick={() => handleRemoveMenu(index)}
                className="px-3 py-2 bg-red-500 text-white rounded-lg"
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
          className="w-full bg-[#83BC87] text-white py-3 rounded-lg mt-8"
        >
          登録する
        </button>
      </form>
    </div>
  );
};

export default ShopRegisterPage;
