"use client";
import { useState } from "react";
import Image from "next/image";
import ScannerGuide from "../components/ScannerGuide";
import ScalpClassifier from "../components/ScalpClassifier";
import ProductCatalog from "../components/ProductCatalog";
import CampaignReport from "../components/CampaignReport";

export default function Home() {
  const [activeTab, setActiveTab] = useState("scanner");

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      
      {/* LUSH Top Stark Header */}
      <header className="header">
        <div className="container header-container">
          <div>
            <h1 style={{ display: "flex", alignItems: "center", margin: 0 }}>
              <Image 
                src="/lush_logo.png" 
                alt="LUSH" 
                width={240} 
                height={60} 
                style={{ height: "60px", width: "auto", objectFit: "contain" }} 
                priority
              />
            </h1>
          </div>
          <div style={{ textAlign: "right" }}>
            <div className="lush-tag dark" style={{ fontWeight: "800" }}>LUSH HAIR WORKSHOP GUIDELINE</div>
            <div style={{ fontSize: "0.75rem", fontWeight: "600", marginTop: "4px", textTransform: "uppercase" }}>Tài liệu nội bộ</div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: "40px 0" }}>
        <div className="container">
          
          {/* Main Navigation Tabs */}
          <div className="tabs-scroll">
            <button 
              className={`tab-btn ${activeTab === "scanner" ? "active" : ""}`}
              onClick={() => setActiveTab("scanner")}
              style={{ fontSize: "0.95rem" }}
            >
              🔎 Hướng Dẫn Máy Soi
            </button>
            <button 
              className={`tab-btn ${activeTab === "classifier" ? "active" : ""}`}
              onClick={() => setActiveTab("classifier")}
              style={{ fontSize: "0.95rem" }}
            >
              📋 Phân Loại Da Đầu
            </button>
            <button 
              className={`tab-btn ${activeTab === "catalog" ? "active" : ""}`}
              onClick={() => setActiveTab("catalog")}
              style={{ fontSize: "0.95rem" }}
            >
              🌿 Bản Đồ Sản Phẩm Tóc
            </button>
            <button 
              className={`tab-btn ${activeTab === "report" ? "active" : ""}`}
              onClick={() => setActiveTab("report")}
              style={{ fontSize: "0.95rem" }}
            >
              📊 Báo Cáo Chiến Dịch
            </button>
          </div>

          {/* Active Tab Panel */}
          <div style={{ minHeight: "500px" }}>
            {activeTab === "scanner" && <ScannerGuide />}
            {activeTab === "classifier" && <ScalpClassifier />}
            {activeTab === "catalog" && <ProductCatalog />}
            {activeTab === "report" && <CampaignReport />}
          </div>

        </div>
      </main>

      {/* LUSH Footnote */}
      <footer className="footer">
        <div className="container footer-container">
          <div>
            <h3 style={{ fontFamily: "var(--font-sans)", fontWeight: "800", fontSize: "1rem", color: "#fff", marginBottom: "8px" }}>
              LUSH VIETNAM
            </h3>
            <p style={{ color: "#aaa", maxWidth: "450px", lineHeight: "1.5" }}>
              Hệ thống hướng dẫn chăm sóc tóc chuyên nghiệp. Kết hợp kỹ thuật soi da đầu lâm sàng và triết lý sản phẩm hữu cơ tươi từ LUSH.
            </p>
          </div>
          <div style={{ color: "#888", textAlign: "right" }}>
            <p>© {new Date().getFullYear()} LUSH Cosmetics. Dành cho đào tạo nội bộ.</p>
            <p style={{ marginTop: "4px" }}>In tài liệu hoặc truy cập hệ thống để hướng dẫn nhân viên mới.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
