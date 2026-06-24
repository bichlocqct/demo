-- 1. Tạo bảng lưu trữ phiếu thông tin khách hàng (Public Reports)
CREATE TABLE IF NOT EXISTS public.reports (
    id TEXT PRIMARY KEY, -- Sử dụng TEXT để tương thích với offline-generated IDs của client
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT,
    store TEXT NOT NULL,
    date DATE NOT NULL,
    symptoms TEXT[] DEFAULT '{}'::TEXT[], -- Mảng lưu danh sách triệu chứng
    routine TEXT,
    purchased BOOLEAN DEFAULT TRUE,
    feedback TEXT,
    staff_name TEXT,
    consent_nghi_dinh_13 BOOLEAN DEFAULT FALSE NOT NULL
);

-- Thêm bình luận cho các cột
COMMENT ON COLUMN public.reports.id IS 'Mã định danh duy nhất của phiếu (có thể do client hoặc server sinh ra)';
COMMENT ON COLUMN public.reports.created_at IS 'Thời gian tạo phiếu';
COMMENT ON COLUMN public.reports.customer_name IS 'Họ và tên khách hàng';
COMMENT ON COLUMN public.reports.customer_phone IS 'Số điện thoại khách hàng';
COMMENT ON COLUMN public.reports.store IS 'Tên cửa hàng thực hiện khảo sát';
COMMENT ON COLUMN public.reports.date IS 'Ngày khảo sát';
COMMENT ON COLUMN public.reports.symptoms IS 'Danh sách triệu chứng về tóc/da đầu';
COMMENT ON COLUMN public.reports.routine IS 'Quy trình tư vấn được đề xuất';
COMMENT ON COLUMN public.reports.purchased IS 'Trạng thái mua hàng (Đã mua / Chưa mua)';
COMMENT ON COLUMN public.reports.feedback IS 'Ý kiến phản hồi từ khách hàng';
COMMENT ON COLUMN public.reports.staff_name IS 'Tên nhân viên tư vấn';
COMMENT ON COLUMN public.reports.consent_nghi_dinh_13 IS 'Xác nhận đồng ý điều khoản thu thập dữ liệu theo Nghị định 13/2023/NĐ-CP';

-- 2. Kích hoạt bảo mật dòng dữ liệu (Row Level Security)
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- 3. Tạo các chính sách bảo mật cho quyền truy cập Anonymous (Anon Key)
-- Hủy chính sách cũ nếu đã tồn tại để tránh lỗi trùng lặp khi chạy lại script
DROP POLICY IF EXISTS "Allow public read access" ON public.reports;
DROP POLICY IF EXISTS "Allow public insert access" ON public.reports;
DROP POLICY IF EXISTS "Allow public delete access" ON public.reports;

-- Cho phép đọc tất cả các phiếu thông tin
CREATE POLICY "Allow public read access" 
ON public.reports 
FOR SELECT 
TO anon 
USING (true);

-- Cho phép thêm mới phiếu thông tin
CREATE POLICY "Allow public insert access" 
ON public.reports 
FOR INSERT 
TO anon 
WITH CHECK (true);

-- Cho phép xóa phiếu thông tin
CREATE POLICY "Allow public delete access" 
ON public.reports 
FOR DELETE 
TO anon 
USING (true);
