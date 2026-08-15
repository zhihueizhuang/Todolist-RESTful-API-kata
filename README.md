# 📝 Todolist RESTful API Kata (原生 Node.js)

這是一個使用 **純原生 Node.js (http 模組)** 開發的待辦事項（Todolist）後端 API 專案。本專案不依賴任何第三方 Web 框架（如 Express），完整實作了 RESTful API 的四大核心操作（CRUD），並具備良好的模組化架構。

## 🌐 線上展示 (Render)
- **API 基礎網址**：`https://onrender.com`
- **取得所有待辦**：`https://onrender.com/todos`

---

## 🛠️ 專案模組化亮點

本專案經過重構優化，遵循 **DRY (Don't Repeat Yourself)** 原則，將核心邏輯進行專業拆分：

1. **`server.js`**：主要入口點，負責建立 HTTP 伺服器、監聽連接埠（相容本地與 Render 環境），並精準控制 `req.on('data')` 與 `req.on('end')` 的非同步資料流。
2. **`headers.js`**：獨立封裝跨域資源共享（CORS）與 JSON 回傳格式設定。未來若需調整權限，僅需修改此單一檔案。
3. **`errorHandle.js`**：獨立錯誤處理模組，支援自訂動態錯誤訊息與狀態碼，確保 API 發生異常時能統一回傳格式化 JSON。

---

## 🚀 路由規範與 API 測試說明

本 API 支援以下端點，可使用 Postman 進行測試。所有資料皆暫存於伺服器記憶體（RAM）中。

| 功能 | 請求方法 | 路由網址 | Body 參數範例 (JSON) | 備註 |
| :--- | :--- | :--- | :--- | :--- |
| **取得所有待辦** | `GET` | `/todos` | 無 | 回傳目前所有待辦事項陣列 |
| **新增待辦事項** | `POST` | `/todos` | `{"title": "完成 Node.js 作業"}` | `title` 欄位為必填 |
| **刪除所有待辦** | `DELETE` | `/todos` | 無 | 清空整張待辦清單 |
| **刪除單筆待辦** | `DELETE` | `/todos/:id` | 無 | 需在網址帶入待辦事項的 UUID |
| **編輯單筆待辦** | `PATCH` | `/todos/:id` | `{"title": "更新後的內容"}` | 更新指定 ID 的標題名稱 |

---

## ⚙️ 如何在本地端運行？

1. **複製儲存庫**：
   ```bash
   git clone https://github.com
   cd Todolist-RESTful-API-kata
   ```

2. **安裝 uuid 套件**：
   ```bash
   npm install
   ```

3. **啟動伺服器**：
   ```bash
   npm start
   ```
   啟動成功後，終端機將顯示：`伺服器已成功啟動，監聽 port 3005`。
