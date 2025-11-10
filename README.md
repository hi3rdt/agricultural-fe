Frontend Dashboard - Hệ thống Giám sát Nông nghiệp (agricultural-fe)

Đây là dự án frontend (giao diện người dùng) cho Hệ thống Giám sát Nông nghiệp Thông minh. Dự án này được xây dựng bằng Next.js và Tailwind CSS, cung cấp một dashboard trực quan để người dùng theo dõi dữ liệu cảm biến và điều khiển các thiết bị (máy bơm) từ xa.

🚀 Các tính năng chính

Giao diện được chia thành các thành phần (components) chính:

Tổng quan Cảm biến (SensorOverview):

Hiển thị dữ liệu thời gian thực (cập nhật mỗi 5 giây) cho: Nhiệt độ không khí, Độ ẩm không khí, và Độ ẩm đất.

Hiển thị trạng thái (Status) của máy bơm (Active/Idle).

Hiển thị các thẻ "Loading" (dạng pulse) trong khi chờ dữ liệu.

Điều khiển Tưới tiêu (PumpControls):

Chuyển đổi Chế độ: Cho phép người dùng chuyển đổi giữa hai chế độ "Automatic" và "Manual".

Điều khiển Thủ công: Cung cấp nút "Start/Stop Pump" (chỉ hoạt động ở chế độ "Manual").

Thiết lập Ngưỡng (Thresholds): Cung cấp các thanh trượt (sliders) để người dùng cài đặt ngưỡng tưới (Low/High) cho chế độ "Automatic".

Hiển thị trạng thái độ ẩm đất hiện tại so với các ngưỡng đã cài đặt.

(Sắp có/Đã tích hợp) Thư viện Ảnh:

Hiển thị các ảnh chụp từ ESP32-CAM.

Cho phép người dùng nhấn nút "Chụp ảnh" (Refresh) để yêu cầu camera chụp ảnh mới.

💻 Công nghệ sử dụng

Framework: Next.js (Framework React)

Ngôn ngữ: TypeScript

Styling (Giao diện): Tailwind CSS

UI Components: shadcn/ui (Card, Button, Slider, Switch, Badge)

Icons: Lucide React

🏗️ Kiến trúc & Luồng hoạt động

Frontend này hoạt động như một máy khách (client), giao tiếp hoàn toàn qua HTTP với Backend FastAPI (chạy ở http://localhost:8080).

Quan trọng: Frontend này không kết nối trực tiếp với MQTT Broker.

1. Luồng Lấy Dữ liệu (Polling)

Để hiển thị dữ liệu "gần thời gian thực", frontend sử dụng cơ chế HTTP Polling (hỏi liên tục):

Khi tải trang (và mỗi 5 giây): Cả hai components SensorOverview và PumpControls đều gọi fetch đến API GET /api/latest của FastAPI.

FastAPI (Backend): Nhận yêu cầu, truy vấn CSDL (data.db) để lấy bản ghi cảm biến mới nhất (bản ghi này được MQTT cập nhật 24/7).

Frontend (Next.js): Nhận dữ liệu JSON (gồm temperature, humidity, soil, pump_status, mode, low_threshold, high_threshold) và cập nhật giao diện (state) bằng useState.

2. Luồng Gửi Lệnh (Control)

Khi người dùng tương tác với UI:

Nhấn nút (Ví dụ: "Start Pump"): Component PumpControls gọi fetch đến API POST /api/control của FastAPI.

Nó gửi một JSON body chứa trạng thái điều khiển mới: {"mode": "manual", "pump_status": true, ...}.

FastAPI (Backend): Nhận lệnh POST này, lưu vào CSDL, và đồng thời publish (đẩy) một tin nhắn MQTT lên topic nongnghiep/dieu_khien.

ESP32 (Thiết bị): Nhận được lệnh MQTT và bật máy bơm.

(Đồng bộ ngược): Ở lần Polling tiếp theo (sau 5 giây), GET /api/latest sẽ trả về pump_status: true, và giao diện sẽ tự cập nhật.

3. Luồng Camera (HTTP Polling)

Phần camera cũng sử dụng HTTP Polling (theo yêu cầu):

Nhấn nút "Chụp ảnh": Dashboard gọi POST /api/capture-request.

ESP32-CAM: Liên tục gọi GET /api/cam-command (cách mỗi 3-5 giây). Khi nhận được lệnh "capture", nó sẽ chụp ảnh.

ESP32-CAM: Gửi ảnh lên server bằng POST /api/upload-image-raw/.

Dashboard: Tải lại thư viện ảnh (gallery) và hiển thị ảnh mới.

🔧 Cài đặt & Chạy (Local)

1. Clone Repository:
```
git clone [https://github.com/hi3rdt/agricultural-fe.git](https://github.com/hi3rdt/agricultural-fe.git)
cd agricultural-fe
```

2. Cài đặt Dependencies:
```
npm install
```

3. Quan trọng: Đảm bảo Backend đang chạy
Trước khi chạy frontend, hãy đảm bảo server FastAPI (backend) của bạn đang chạy ở http://localhost:8080.

4. Kiểm tra URL API
Mở các file trong components/ (ví dụ SensorOverview.tsx) và đảm bảo hằng số API_URL được trỏ đúng đến backend của bạn:
```
const API_URL = "http://localhost:8080/api/latest"
```

5. Chạy Development Server:
```
npm run dev
```

6. Mở trình duyệt và truy cập: http://localhost:3000
