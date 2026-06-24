"use client";
import { useState } from "react";
import Image from "next/image";

export default function ScannerGuide() {
  const [activeSubTab, setActiveSubTab] = useState("assembly");
  const [activeStep, setActiveStep] = useState(0);

  const assemblySteps = [
    {
      title: "Bước 1: Lắp Đế Màn Hình",
      desc: "Gắn phần đế của màn hình vào màn hình chính thông qua rãnh ở phía sau màn hình. Đảm bảo khít chặt để màn hình đứng vững.",
      image: "/device_back.png",
      isPhoto: true
    },
    {
      title: "Bước 2: Kết Nối Đầu Soi",
      desc: "Dùng dây cắm ở phần đầu soi da đầu gắn vào dây màu trắng đi cùng với màn hình. Đẩy nhẹ và vặn nắp bảo vệ nếu có để kết nối chắc chắn.",
      image: "/connect_scanner.jpg",
      isPhoto: true
    },
    {
      title: "Bước 3: Cắm Nguồn Sạc",
      desc: "Gắn phần dây của đầu sạc vào phần dây điện màu đỏ của màn hình. Hãy cẩn thận cắm đúng khớp nối màu đỏ để tránh hỏng linh kiện.",
      image: "/connect_power.png",
      isPhoto: true
    }
  ];

  const usageSteps = [
    {
      title: "Bước 1: Cấp Nguồn",
      desc: "Tiến hành cắm đầu sạc điện vào ổ điện. Đèn báo sạc hoặc màn hình sẽ hiển thị tín hiệu có nguồn điện đi vào.",
      image: "/power_on.jpg",
      isPhoto: true
    },
    {
      title: "Bước 2: Khởi Động Máy",
      desc: "Ấn nút nguồn (nút đầu tiên từ trái sang) trên màn hình hiển thị để mở máy. Màn hình LUSH / Meiboyi sẽ sáng lên sau 2-3 giây.",
      image: "/power_switch.jpg",
      isPhoto: true,
      objectFit: "contain"
    },
    {
      title: "Bước 3: Chọn Chức Năng Soi",
      desc: "Cầm đầu soi da đầu và ấn nút điều khiển đầu tiên ở cạnh ngón cái. Mỗi lần ấn sẽ tương ứng với 1 trong 3 chức năng theo thứ tự:\n\n• Ấn lần 1 (White Light): Soi bề mặt tóc, lượng dầu và gàu bết.\n• Ấn lần 2 (Polarized Light): Xem sâu nang tóc, tình trạng viêm đỏ.\n• Ấn lần 3 (UV/Blue Light): Phát hiện nấm da đầu, bã nhờn ẩn sâu.",
      image: "/probe_button.jpg",
      isPhoto: true,
      objectFit: "contain"
    },
    {
      title: "Bước 4: Soi & Đánh Giá",
      desc: "Từ từ đưa máy đến vùng da cần soi và bắt đầu soi từng chi tiết, đánh giá tình trạng da đầu của khách hàng để chẩn đoán đúng routine.",
      image: "/scanner_screen.jpg",
      isPhoto: true,
      objectFit: "contain"
    },
    {
      title: "Bước 5: Chụp Ảnh Màn Hình",
      desc: "Nút nhỏ phía dưới sau nút điều khiển dùng để chụp ảnh màn hình. Nhấn nút này khi tìm thấy vùng da đầu có dấu hiệu cần lưu ý để chụp lại và tư vấn cho khách.",
      image: "/capture_button.jpg",
      isPhoto: true,
      objectFit: "contain"
    }
  ];

  const steps = activeSubTab === "assembly" ? assemblySteps : usageSteps;
  const currentStepData = steps[activeStep] || steps[0];

  const handleSubTabChange = (tab) => {
    setActiveSubTab(tab);
    setActiveStep(0);
  };

  return (
    <div className="fade-in" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "32px" }}>
      
      {/* Sub-navigation tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid var(--lush-gray-medium)", paddingBottom: "8px", gap: "16px", overflowX: "auto", scrollbarWidth: "none" }}>
        <button 
          className={`tab-btn ${activeSubTab === "assembly" ? "active" : ""}`}
          onClick={() => handleSubTabChange("assembly")}
        >
          1. Lắp Ráp Máy
        </button>
        <button 
          className={`tab-btn ${activeSubTab === "usage" ? "active" : ""}`}
          onClick={() => handleSubTabChange("usage")}
        >
          2. Hướng Dẫn Sử Dụng
        </button>
      </div>

      <div className="grid-split">
        
        {/* Left column: Step Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* Step Selector List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {steps.map((step, idx) => (
              <div 
                key={idx}
                onClick={() => setActiveStep(idx)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  padding: "16px",
                  border: activeStep === idx ? "2px solid #000000" : "1px solid #e5e5e5",
                  background: activeStep === idx ? "#000000" : "#ffffff",
                  color: activeStep === idx ? "#ffffff" : "#000000",
                  cursor: "pointer",
                  transition: "var(--transition-smooth)"
                }}
              >
                <div style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background: activeStep === idx ? "#ffffff" : "#000000",
                  color: activeStep === idx ? "#000000" : "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  fontSize: "13px"
                }}>
                  {idx + 1}
                </div>
                <div style={{ fontWeight: "700", textTransform: "uppercase", fontSize: "0.85rem", letterSpacing: "0.5px" }}>
                  {step.title.split(":")[0]}
                </div>
              </div>
            ))}
          </div>

          {/* Current Step Description Card */}
          <div className="lush-card" style={{ minHeight: "220px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <div className="lush-tag dark" style={{ alignSelf: "flex-start" }}>
              Chi tiết bước {activeStep + 1}
            </div>
            <h3 style={{ fontSize: "1.3rem", marginTop: "4px" }}>{currentStepData.title}</h3>
            <p style={{ whiteSpace: "pre-line", color: "#333", fontSize: "0.95rem" }}>
              {currentStepData.desc}
            </p>
          </div>

        </div>

        {/* Right column: Graphic & Video Player */}
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          
          {/* Step Graphic Illustration */}
          <div style={{ 
            border: "2px solid var(--lush-black)", 
            padding: "20px", 
            background: "var(--lush-gray-light)",
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center",
            height: "300px",
            position: "relative"
          }}>
            <Image 
              src={currentStepData.image} 
              alt={currentStepData.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ 
                objectFit: currentStepData.objectFit || (currentStepData.isPhoto ? "cover" : "contain"), 
                filter: currentStepData.isPhoto ? "none" : "grayscale(100%)" 
              }}
            />
            <div style={{ 
              position: "absolute", 
              bottom: "10px", 
              right: "10px", 
              fontSize: "0.7rem", 
              fontWeight: "bold",
              textTransform: "uppercase",
              background: "#000",
              color: "#fff",
              padding: "4px 8px"
            }}>
              Minh Họa Bước {activeStep + 1}
            </div>
          </div>

          {/* Real video player block */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <h3 style={{ fontSize: "1.1rem", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "8px" }}>
              <span>🎥</span> Video Hướng Dẫn Vận Hành Máy
            </h3>
            <div style={{ 
              border: "3px solid var(--lush-black)", 
              boxShadow: "6px 6px 0 var(--lush-black)",
              background: "#000",
              position: "relative",
              aspectRatio: "16/9",
              overflow: "hidden"
            }}>
              <video 
                src="/video_soi_da.mp4" 
                controls 
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>
            <span style={{ fontSize: "0.75rem", color: "#666", fontStyle: "italic" }}>
              💡 Mẹo: Nhân viên mới bắt buộc xem hết video này trước khi thực hành soi da đầu cho khách hàng.
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}
