# KỶ NIỆM LỚP 12A8 — Website HTML/CSS/JavaScript

## 1. Chạy website trên macOS
1. Giải nén `ky-niem-lop-12a8.zip`.
2. Mở VS Code → **File → Open Folder...** → chọn thư mục `ky-niem-lop-12a8`.
3. Mở file `index.html`.
4. Cách nhanh: nhấp đúp `index.html` trong Finder để mở Chrome.
5. Cách tiện hơn: cài extension **Live Server** trong VS Code, nhấp chuột phải `index.html` → **Open with Live Server**.

Không cần Node.js, npm hay framework.

## 2. Sáu trang
- `index.html`: Trang chủ
- `thanh-vien.html`: Danh sách thành viên + tìm kiếm
- `hoat-dong.html`: Dòng thời gian hoạt động
- `album.html`: Album, bộ lọc và phóng to ảnh
- `video.html`: Video YouTube nhúng
- `loi-nhan.html`: Gửi lời nhắn (lưu trên trình duyệt bằng localStorage)

## 3. Cá nhân hóa website
- **Tên thành viên:** sửa các thẻ `article.member-card` trong `thanh-vien.html`.
- **Ảnh:** thay URL `https://images.unsplash.com/...` bằng ảnh của lớp. Nên tạo `assets/images/`, chép ảnh vào đó, rồi dùng đường dẫn ví dụ `assets/images/anh-lop.jpg`.
- **Video YouTube:** mở video → Chia sẻ → Nhúng; lấy mã sau `/embed/` và thay `ScMzIvxBSi4` trong `video.html`.
- **Năm học, lời giới thiệu:** sửa trực tiếp nội dung trong các file HTML.
- **Màu sắc:** sửa biến ở đầu `assets/style.css` trong phần `:root`.

## 4. Lưu ý quan trọng
- Google Fonts và ảnh mẫu cần Internet để tải.
- Video chỉ phát nếu video YouTube cho phép nhúng.
- Lời nhắn dùng `localStorage`: chỉ có trên trình duyệt/thiết bị đang dùng, không tự đồng bộ cho cả lớp. Muốn dùng chung online cần backend hoặc dịch vụ cơ sở dữ liệu.
- Website không thu thập hay gửi dữ liệu đi đâu.
