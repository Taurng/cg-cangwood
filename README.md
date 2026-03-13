# 專案說明

這是一個基於 Vite + React 的專案。

## 1. 啟動開發環境

**前置作業:** Node.js 20+

1. 進入專案目錄並安裝套件：
   ```bash
   npm install
   ```
2. 設定 `.env.local` 檔案（如果有的話，例如將 `.env.example` 複製一份為 `.env.local` 並填入對應的 API Key）。
3. 啟動本地伺服器：
   ```bash
   npm run dev
   ```
預設會運行於 `http://localhost:3000/` 或是本機 IP。

## 2. GitHub Action 部署

專案已設定 `.github/workflows/deploy.yml`。將程式碼 push 到 GitHub `main` 分支後，GitHub Actions 會自動將 Vite 編譯打包的靜態檔案部署到 GitHub Pages 上。

**重要設定步驟**：
請到 GitHub 專案庫的 Settings > Pages > Build and deployment 中，將 Source 切換為 **GitHub Actions**。

## 3. Git 忽略檔案設定

已配置標準 Vite + React 適用的 `.gitignore`，避免如 `node_modules`、暫存檔 (`.log`, `.DS_Store`)、環境變數 (`.env`) 以及 IDE 產生的各類目錄被上傳到儲存庫中。
