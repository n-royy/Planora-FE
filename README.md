# Planora - Task Management Application

Ứng dụng quản lý công việc (Task Management) hiện đại, giúp cá nhân và nhóm theo dõi, tổ chức và hoàn thành công việc hiệu quả hơn.

---

## 📋 Mục lục

- [Giới thiệu](#-giới-thiệu)
- [Tính năng](#-tính-năng)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Yêu cầu hệ thống](#-yêu-cầu-hệ-thống)
- [Cài đặt và chạy ứng dụng](#-cài-đặt-và-chạy-ứng-dụng)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [Scripts](#-scripts)

---

## 🎯 Giới thiệu

**Planora** là một ứng dụng web quản lý task (công việc) được xây dựng với mục tiêu giúp người dùng:

- 📝 Tạo và quản lý danh sách công việc cá nhân
- ✅ Theo dõi tiến độ hoàn thành các task
- 🎨 Tổ chức công việc theo dự án, danh mục hoặc mức độ ưu tiên
- 📊 Trực quan hóa công việc và năng suất làm việc
- 🔔 Nhận thông báo và nhắc nhở về deadline

Planora được thiết kế với giao diện người dùng thân thiện, responsive và hiệu suất cao, phù hợp cho cả sử dụng cá nhân và nhóm làm việc nhỏ.

---

## ✨ Tính năng

### Quản lý Task

- ➕ **Tạo task mới** với tiêu đề, mô tả chi tiết, và các thuộc tính tùy chỉnh
- ✏️ **Chỉnh sửa task** linh hoạt: cập nhật thông tin, thay đổi trạng thái
- 🗑️ **Xóa task** không còn cần thiết
- ✅ **Đánh dấu hoàn thành** để theo dõi tiến độ

### Tổ chức và Phân loại

- 📁 **Nhóm task** theo dự án hoặc danh mục
- 🏷️ **Gắn nhãn (Tags)** để phân loại và tìm kiếm dễ dàng
- ⭐ **Đánh mức độ ưu tiên** (cao, trung bình, thấp)
- 📅 **Thiết lập deadline** cho từng task

### Giao diện và Trải nghiệm

- 🎨 **Giao diện hiện đại** với MUI
- 📱 **Responsive Design** hoạt động mượt mà trên mọi thiết bị
- 🌓 **Dark/Light Mode**
- ⚡ **Performance tối ưu** với Vite và React

### Tìm kiếm và Lọc

- 🔍 **Tìm kiếm nhanh** task theo từ khóa
- 🔽 **Lọc task** theo trạng thái, độ ưu tiên, hoặc danh mục
- 📊 **Sắp xếp** task theo nhiều tiêu chí khác nhau

---

## 🛠 Công nghệ sử dụng

### Core Technologies

- **[React 18+](https://react.dev/)** - Thư viện JavaScript để xây dựng giao diện người dùng
- **[TypeScript](https://www.typescriptlang.org/)** - Ngôn ngữ lập trình có type-safety
- **[Vite](https://vitejs.dev/)** - Build tool hiện đại, nhanh chóng với HMR

### UI/UX Libraries

- **[MUI](https://mui.com/)** - CSS framework và Icon library hiện đại

### Development Tools

- **[ESLint](https://eslint.org/)** - Linting tool để đảm bảo code quality
- **[Prettier](https://prettier.io/)** - Code formatter để giữ code style nhất quán
- **TypeScript ESLint** - TypeScript-specific linting rules

### State Management & Data Fetching

- **[React Query/TanStack Query](https://tanstack.com/query)** (nếu có) - Data fetching và caching
- **[Zustand](https://zustand-demo.pmnd.rs/)** - State management

### Build & Deployment

- **Vite** - Build và bundle application

---

## 💻 Yêu cầu hệ thống

Trước khi bắt đầu, đảm bảo máy tính của bạn đã cài đặt:

- **Node.js** phiên bản 18.0 trở lên
- **npm** (đi kèm với Node.js) hoặc **yarn** / **pnpm**
- **Git** để clone repository

Kiểm tra phiên bản đã cài đặt:

```bash
node --version  # v18.0.0 hoặc cao hơn
npm --version   # 9.0.0 hoặc cao hơn
```

---

## 🚀 Cài đặt và chạy ứng dụng

### 1. Clone Repository

```bash
git clone https://github.com/n-royy/Planora-FE.git
cd Planora-FE
```

### 2. Cài đặt Dependencies

Sử dụng **npm**:

```bash
npm install
```

### 4. Chạy Development Server

```bash
npm run dev
```

Ứng dụng sẽ chạy tại: `http://localhost:3000`

### 5. Build cho Production

```bash
npm run build
```

Các file build sẽ được tạo trong thư mục `dist/`

### 6. Preview Production Build

```bash
npm run preview
```

---

## 📁 Cấu trúc dự án

```
Planora-FE/
├── src/
│   ├── app/             # Provier, router
│   ├── assets/          # Static assets (images, fonts, etc.)
│   ├── components/      # Reusable React components
│   │   ├── common/      # Theme components
│   │   ├── layout/      # Main Layout components
│   ├── design-system/   # Custom UI from MUI
│   ├── fetures/         # Page components/views
│   ├── lib/             # Custom library
│   ├── services/        # API services và business logic
│   ├── stores/          # State management (Zustand/Context)
│   ├── utils/           # Utility functions
│   ├── styles/          # Global styles
│   ├── App.tsx          # Main App component
│   └── main.tsx         # Application entry point
├── public/              # Public static files
├── .eslintrc.cjs        # ESLint configuration
├── .prettierrc          # Prettier configuration
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite configuration
├── package.json         # Project dependencies và scripts
└── README.md            # Documentation
```

---

## 📜 Scripts

| Script               | Mô tả                                  |
| -------------------- | -------------------------------------- |
| `npm run dev`        | Chạy development server với hot reload |
| `npm run build`      | Build ứng dụng cho production          |
| `npm run preview`    | Preview bản build production           |
| `npm run lint`       | Chạy ESLint để kiểm tra code           |
| `npm run lint:fix`   | Tự động fix các lỗi ESLint có thể sửa  |
| `npm run format`     | Format code với Prettier               |
| `npm run type-check` | Kiểm tra TypeScript types              |

---

<div align="center">
  <p>Made with ❤️ by n-royy</p>
  <p>⭐ Nếu project này hữu ích, hãy cho một Star nhé!</p>
</div>
