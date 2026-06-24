"use client";
import { useState, useEffect } from "react";

export default function CampaignReport() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeStoreTab, setActiveStoreTab] = useState(null);

  // Form fields
  const [customerName, setCustomerName] = useState("");
  const [store, setStore] = useState("Lush Saigon Center");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [symptoms, setSymptoms] = useState([]);
  const [routine, setRoutine] = useState("");
  const [purchased, setPurchased] = useState(true); // true = Đã mua, false = Không mua
  const [feedback, setFeedback] = useState("");
  const [staffName, setStaffName] = useState("");

  const storesList = [
    "Lush Saigon Center",
    "Lush Vincom Đồng Khởi",
    "Lush Hùng Vương Plaza",
    "Lush Hà Nội Center",
    "Lush Lotte Tây Hồ",
    "Lush Aeon Hà Đông",
    "Cửa hàng khác"
  ];

  const symptomsList = [
    { id: "oily", label: "Tóc bết nhanh, da đầu tiết bóng dầu nhiều" },
    { id: "redness", label: "Da đầu ửng đỏ, có đốm hồng, dễ rát ngứa" },
    { id: "dry_flakes", label: "Có vảy bong tróc nhỏ màu trắng, da đầu khô căng" },
    { id: "thick_flakes", label: "Gàu vảy dày, bám thành mảng, ngứa dữ dội" },
    { id: "hair_loss", label: "Tóc rụng nhiều (>100 sợi/ngày), nang tóc yếu/thưa" },
    { id: "normal", label: "Da đầu sạch, không đỏ, ẩm mượt vừa phải, tóc khỏe" }
  ];

  // Fetch reports on mount
  const fetchReports = async () => {
    try {
      // Load local reports from localStorage
      const localReportsStr = localStorage.getItem("lush_campaign_reports");
      const localReports = localReportsStr ? JSON.parse(localReportsStr) : [];

      const res = await fetch("/api/reports");
      let apiReports = [];
      if (res.ok) {
        apiReports = await res.json();
      }

      // Merge and deduplicate by id
      const allReports = [...localReports, ...apiReports];
      const uniqueReports = [];
      const seenIds = new Set();
      for (const r of allReports) {
        if (r && r.id && !seenIds.has(r.id)) {
          seenIds.add(r.id);
          uniqueReports.push(r);
        }
      }

      // Sort by date or createdAt descending (newest first)
      uniqueReports.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));
      setReports(uniqueReports);
    } catch (err) {
      console.error("Error fetching reports:", err);
      // Fallback to localStorage only if API fails
      const localReportsStr = localStorage.getItem("lush_campaign_reports");
      if (localReportsStr) {
        try {
          const localReports = JSON.parse(localReportsStr);
          localReports.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));
          setReports(localReports);
        } catch (e) {
          console.error(e);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleSymptomToggle = (id) => {
    if (id === "normal") {
      if (symptoms.includes("normal")) {
        setSymptoms([]);
      } else {
        setSymptoms(["normal"]);
      }
      return;
    }

    let updated = [...symptoms].filter(s => s !== "normal");
    if (updated.includes(id)) {
      updated = updated.filter(s => s !== id);
    } else {
      updated.push(id);
    }
    setSymptoms(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerName.trim()) {
      alert("Vui lòng điền họ và tên khách hàng!");
      return;
    }

    setSubmitting(true);
    const newReport = {
      customerName,
      store,
      date,
      symptoms,
      routine,
      purchased,
      feedback,
      staffName
    };

    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReport)
      });

      let savedReport = null;
      if (res.ok) {
        savedReport = await res.json();
      } else {
        // Fallback for offline / direct local save
        savedReport = {
          id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
          createdAt: new Date().toISOString(),
          ...newReport
        };
      }

      if (savedReport) {
        // Save to localStorage
        const localReportsStr = localStorage.getItem("lush_campaign_reports");
        const localReports = localReportsStr ? JSON.parse(localReportsStr) : [];
        localReports.push(savedReport);
        localStorage.setItem("lush_campaign_reports", JSON.stringify(localReports));
      }

      // Clear fields
      setCustomerName("");
      setSymptoms([]);
      setRoutine("");
      setPurchased(true);
      setFeedback("");
      // Reload list
      await fetchReports();
      alert("Lưu phiếu thông tin khách hàng thành công!");
    } catch (err) {
      console.error(err);
      // Even if network request fails, save it locally!
      const savedReport = {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
        createdAt: new Date().toISOString(),
        ...newReport
      };
      const localReportsStr = localStorage.getItem("lush_campaign_reports");
      const localReports = localReportsStr ? JSON.parse(localReportsStr) : [];
      localReports.push(savedReport);
      localStorage.setItem("lush_campaign_reports", JSON.stringify(localReports));

      setCustomerName("");
      setSymptoms([]);
      setRoutine("");
      setPurchased(true);
      setFeedback("");
      await fetchReports();
      alert("Lưu phiếu thành công! (Lưu cục bộ trên trình duyệt do lỗi mạng)");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Bạn có chắc chắn muốn xóa phiếu thông tin này?")) {
      return;
    }

    try {
      // 1. Delete from API
      await fetch(`/api/reports?id=${id}`, { method: "DELETE" });
    } catch (err) {
      console.error("Error calling delete API:", err);
    }

    // 2. Delete from localStorage
    try {
      const localReportsStr = localStorage.getItem("lush_campaign_reports");
      if (localReportsStr) {
        const localReports = JSON.parse(localReportsStr);
        const updated = localReports.filter(r => r.id !== id);
        localStorage.setItem("lush_campaign_reports", JSON.stringify(updated));
      }
    } catch (err) {
      console.error("Error updating localStorage on delete:", err);
    }

    // 3. Reload list
    await fetchReports();
  };

  const getSymptomLabel = (id) => {
    const found = symptomsList.find(s => s.id === id);
    return found ? found.label : id;
  };

  // Aggregated KPIs
  const totalCustomers = reports.length;
  const totalRoutines = reports.filter(r => r.routine && r.routine.trim() !== "").length;
  const totalPurchased = reports.filter(r => r.purchased === true || r.purchased === "true" || r.purchased === "yes").length;

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      
      {/* Header */}
      <div style={{ borderBottom: "1px solid var(--lush-gray-medium)", paddingBottom: "12px" }}>
        <h2 style={{ fontSize: "1.5rem" }}>Phiếu Thông Tin Khách Hàng Soi Da Đầu</h2>
        <p style={{ color: "#666", fontSize: "0.9rem" }}>
          Nhập thông tin khách hàng tham gia workshop soi da đầu và quản lý kết quả tư vấn sản phẩm LUSH tại các cửa hàng.
        </p>
      </div>

      {/* KPI Dashboard */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
        
        {/* KPI 1: Total Customers */}
        <div className="lush-card" style={{ display: "flex", flexDirection: "column", gap: "8px", background: "#fcfcfc" }}>
          <span className="sub-title" style={{ color: "#666" }}>Tổng số khách đã tham gia</span>
          <div style={{ fontSize: "2.2rem", fontWeight: "800" }}>{totalCustomers}</div>
          <span style={{ fontSize: "0.75rem", color: "var(--lush-green)", background: "var(--lush-green-light)", padding: "4px 8px", alignSelf: "flex-start", fontWeight: "600" }}>
            👥 Khách trải nghiệm soi da đầu
          </span>
        </div>

        {/* KPI 2: Total Routines Advised */}
        <div className="lush-card" style={{ display: "flex", flexDirection: "column", gap: "8px", background: "#fcfcfc" }}>
          <span className="sub-title" style={{ color: "#666" }}>Tổng số bộ routine đã tư vấn</span>
          <div style={{ fontSize: "2.2rem", fontWeight: "800" }}>{totalRoutines}</div>
          <span style={{ fontSize: "0.75rem", color: "#8a6a00", background: "var(--lush-gold-light)", padding: "4px 8px", alignSelf: "flex-start", fontWeight: "600" }}>
            🌿 Giải pháp routine chăm sóc
          </span>
        </div>

        {/* KPI 3: Total Purchased */}
        <div className="lush-card" style={{ display: "flex", flexDirection: "column", gap: "8px", background: "#fcfcfc" }}>
          <span className="sub-title" style={{ color: "#666" }}>Tổng số khách hàng đã mua</span>
          <div style={{ fontSize: "2.2rem", fontWeight: "800" }}>{totalPurchased}</div>
          <span className="lush-tag green" style={{ alignSelf: "flex-start", fontSize: "0.65rem", background: "#e1f5fe", color: "#0288d1", borderColor: "#0288d1" }}>
            🛒 Tỷ lệ mua: {totalCustomers > 0 ? Math.round((totalPurchased / totalCustomers) * 100) : 0}%
          </span>
        </div>

      </div>


      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: "32px", alignItems: "start", marginTop: "16px" }}>
        
        {/* Left Column: Input Form */}
        <form onSubmit={handleSubmit} className="lush-card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h3 style={{ fontSize: "1.1rem", textTransform: "uppercase", borderBottom: "2px solid #000", paddingBottom: "8px" }}>
            📝 Tạo Phiếu Khách Hàng Mới
          </h3>

          {/* Customer Name */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: "700", textTransform: "uppercase" }}>Họ và Tên khách hàng *</label>
            <input 
              type="text" 
              value={customerName} 
              onChange={(e) => setCustomerName(e.target.value)} 
              placeholder="Nhập tên khách hàng..."
              required
              style={{ padding: "10px", border: "2px solid #000", fontSize: "0.9rem", outline: "none" }}
            />
          </div>

          {/* Store & Date */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: "700", textTransform: "uppercase" }}>Cửa hàng *</label>
              <select 
                value={store} 
                onChange={(e) => setStore(e.target.value)}
                style={{ padding: "10px", border: "2px solid #000", fontSize: "0.9rem", cursor: "pointer", outline: "none" }}
              >
                {storesList.map(st => <option key={st} value={st}>{st}</option>)}
              </select>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: "700", textTransform: "uppercase" }}>Ngày tư vấn *</label>
              <input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
                required
                style={{ padding: "10px", border: "2px solid #000", fontSize: "0.9rem", outline: "none" }}
              />
            </div>
          </div>

          {/* Scalp Symptoms Checkboxes (Same structure as ScalpClassifier) */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: "700", textTransform: "uppercase" }}>Tình trạng da đầu gặp phải (Chọn nhiều triệu chứng)</label>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", background: "var(--lush-gray-light)", padding: "12px", border: "1px solid var(--lush-gray-medium)" }}>
              {symptomsList.map((sym) => {
                const isChecked = symptoms.includes(sym.id);
                return (
                  <label 
                    key={sym.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      cursor: "pointer",
                      fontSize: "0.85rem",
                      fontWeight: isChecked ? "bold" : "normal",
                      padding: "2px 0",
                      userSelect: "none"
                    }}
                  >
                    <input 
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleSymptomToggle(sym.id)}
                      style={{ accentColor: "#000", width: "16px", height: "16px" }}
                    />
                    <span>{sym.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Recommended Routine */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: "700", textTransform: "uppercase" }}>Bộ routine đã tư vấn cho khách hàng *</label>
            <textarea 
              value={routine} 
              onChange={(e) => setRoutine(e.target.value)} 
              placeholder="Ví dụ: SuperBalm + Soak & Float + Veganese..."
              rows="2"
              required
              style={{ padding: "10px", border: "2px solid #000", fontSize: "0.9rem", outline: "none", resize: "vertical" }}
            />
          </div>

          {/* Purchased Option */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: "700", textTransform: "uppercase" }}>Trạng thái mua hàng *</label>
            <div style={{ display: "flex", gap: "24px", padding: "8px 0" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "0.9rem", fontWeight: "700" }}>
                <input 
                  type="radio" 
                  name="purchased"
                  checked={purchased === true}
                  onChange={() => setPurchased(true)}
                  style={{ accentColor: "#000", width: "18px", height: "18px" }}
                />
                🟢 Đã mua hàng
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "0.9rem", fontWeight: "700" }}>
                <input 
                  type="radio" 
                  name="purchased"
                  checked={purchased === false}
                  onChange={() => setPurchased(false)}
                  style={{ accentColor: "#000", width: "18px", height: "18px" }}
                />
                🔴 Không mua
              </label>
            </div>
          </div>

          {/* Advisor Name (Staff) */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: "700", textTransform: "uppercase" }}>Nhân viên tư vấn (Không bắt buộc)</label>
            <input 
              type="text" 
              value={staffName} 
              onChange={(e) => setStaffName(e.target.value)} 
              placeholder="Nhập tên nhân viên..."
              style={{ padding: "10px", border: "2px solid #000", fontSize: "0.9rem", outline: "none" }}
            />
          </div>

          {/* Customer Feedback */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: "700", textTransform: "uppercase" }}>Phản ánh của khách hàng & Ghi chú</label>
            <textarea 
              value={feedback} 
              onChange={(e) => setFeedback(e.target.value)} 
              placeholder="Khách thích mùi gì, cảm nhận khi test thử hoặc lí do chưa mua..."
              rows="2"
              style={{ padding: "10px", border: "2px solid #000", fontSize: "0.9rem", outline: "none", resize: "vertical" }}
            />
          </div>

          <button 
            type="submit" 
            className="lush-btn" 
            disabled={submitting} 
            style={{ width: "100%", marginTop: "8px" }}
          >
            {submitting ? "Đang lưu thông tin..." : "Lưu Phiếu Khách Hàng"}
          </button>
        </form>

        {/* Right Column: History List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h3 style={{ fontSize: "1.1rem", textTransform: "uppercase", paddingBottom: "4px" }}>
            📜 Danh Sách Phiếu Khách Hàng ({reports.length})
          </h3>
          
          {loading ? (
            <div style={{ padding: "40px", textAlign: "center", color: "#888" }}>
              Đang tải danh sách phiếu khách hàng...
            </div>
          ) : reports.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxHeight: "850px", overflowY: "auto", paddingRight: "8px" }}>
              {reports.map((report) => (
                <div 
                  key={report.id}
                  className="lush-card"
                  style={{
                    padding: "20px",
                    borderWidth: "2px",
                    borderColor: "#000",
                    position: "relative"
                  }}
                >
                  {/* Top info and delete button */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", flexWrap: "wrap", gap: "8px" }}>
                    <div>
                      <span className="lush-tag dark" style={{ fontSize: "0.65rem", padding: "2px 6px" }}>{report.store}</span>
                      <h4 style={{ fontSize: "1.2rem", marginTop: "6px", textTransform: "none", fontFamily: "var(--font-sans)", fontWeight: "800" }}>
                        👤 {report.customerName || report.staffName || "Khách hàng ẩn danh"}
                      </h4>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span style={{ fontSize: "0.8rem", color: "#666", fontWeight: "700" }}>{report.date}</span>
                      <button 
                        onClick={() => handleDelete(report.id)}
                        title="Xóa phiếu thông tin"
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "1rem",
                          padding: "2px 4px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          opacity: 0.6,
                          transition: "opacity 0.2s"
                        }}
                        onMouseEnter={(e) => e.target.style.opacity = 1}
                        onMouseLeave={(e) => e.target.style.opacity = 0.6}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  {/* Diagnosed scalp symptoms */}
                  <div style={{ marginTop: "12px" }}>
                    <span style={{ fontSize: "0.75rem", textTransform: "uppercase", fontWeight: "800", color: "#666", display: "block" }}>Tình trạng da đầu:</span>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "4px" }}>
                      {report.symptoms && report.symptoms.length > 0 ? (
                        report.symptoms.map((symId, index) => (
                          <span 
                            key={index} 
                            className="lush-tag" 
                            style={{ 
                              fontSize: "0.7rem", 
                              padding: "2px 6px",
                              borderColor: symId === "normal" ? "var(--lush-green)" : "#e57373",
                              color: symId === "normal" ? "var(--lush-green)" : "#c62828",
                              background: symId === "normal" ? "var(--lush-green-light)" : "#ffebee",
                              textTransform: "none",
                              fontWeight: "600"
                            }}
                          >
                            {getSymptomLabel(symId)}
                          </span>
                        ))
                      ) : (
                        <span style={{ fontSize: "0.85rem", color: "#888", fontStyle: "italic" }}>Chưa ghi nhận triệu chứng</span>
                      )}
                    </div>
                  </div>

                  {/* Recommended Routine */}
                  <div style={{ 
                    margin: "12px 0 8px",
                    padding: "12px", 
                    background: "var(--lush-gray-light)",
                    border: "1px solid var(--lush-gray-medium)",
                    fontSize: "0.85rem"
                  }}>
                    <div style={{ marginBottom: "6px" }}>
                      <strong>🌿 Routine tư vấn:</strong>
                      <p style={{ marginTop: "2px", fontWeight: "600", color: "var(--lush-green)" }}>
                        {report.routine || "Chưa đề xuất"}
                      </p>
                    </div>
                    {report.staffName && report.customerName && (
                      <div style={{ fontSize: "0.75rem", color: "#666", borderTop: "1px dashed #e5e5e5", paddingTop: "6px", marginTop: "6px" }}>
                        👤 <strong>Nhân viên tư vấn:</strong> {report.staffName}
                      </div>
                    )}
                  </div>

                  {/* Bottom Purchased Status & Feedback */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px dashed #e5e5e5", paddingTop: "10px", marginTop: "10px" }}>
                    <div style={{ fontSize: "0.85rem" }}>
                      {report.feedback ? (
                        <span style={{ fontStyle: "italic", color: "#444" }}>
                          💬 "{report.feedback}"
                        </span>
                      ) : (
                        <span style={{ color: "#aaa", fontStyle: "italic" }}>Không có phản ánh</span>
                      )}
                    </div>

                    <span 
                      className={`lush-tag ${report.purchased === true || report.purchased === "true" || report.purchased === "yes" ? "green" : "dark"}`}
                      style={{ 
                        fontSize: "0.7rem", 
                        padding: "4px 8px",
                        background: report.purchased === true || report.purchased === "true" || report.purchased === "yes" ? "var(--lush-green-light)" : "#f5f5f5",
                        color: report.purchased === true || report.purchased === "true" || report.purchased === "yes" ? "var(--lush-green)" : "#757575",
                        borderColor: report.purchased === true || report.purchased === "true" || report.purchased === "yes" ? "var(--lush-green)" : "#bdbdbd",
                        fontWeight: "800"
                      }}
                    >
                      {report.purchased === true || report.purchased === "true" || report.purchased === "yes" ? "✓ ĐÃ MUA HÀNG" : "✗ KHÔNG MUA"}
                    </span>
                  </div>

                </div>
              ))}
            </div>
          ) : (
            <div style={{
              border: "2px dashed var(--lush-gray-medium)",
              padding: "48px 24px",
              textAlign: "center",
              color: "#888"
            }}>
              Chưa có phiếu thông tin khách hàng nào được tạo.
            </div>
          )}
        </div>

      </div>

      {/* Store Summaries Section */}
      <div className="lush-card" style={{ display: "flex", flexDirection: "column", gap: "20px", background: "#ffffff", marginTop: "24px" }}>
        <h3 style={{ fontSize: "1.1rem", textTransform: "uppercase", borderBottom: "2px solid #000", paddingBottom: "8px", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
          <span>🏢</span> Tóm Tắt Hoạt Động Theo Cửa Hàng
        </h3>

        {/* Store Grid Selector */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
          {storesList.map(storeName => {
            const storeReports = reports.filter(r => r.store === storeName);
            const customers = storeReports.length;
            const purchased = storeReports.filter(r => r.purchased === true || r.purchased === "true" || r.purchased === "yes").length;
            const isActive = activeStoreTab === storeName;

            return (
              <div 
                key={storeName}
                onClick={() => setActiveStoreTab(isActive ? null : storeName)}
                style={{
                  border: isActive ? "3px solid #000000" : "1px solid var(--lush-gray-medium)",
                  background: isActive ? "var(--lush-black)" : "#ffffff",
                  color: isActive ? "var(--lush-white)" : "var(--lush-black)",
                  padding: "16px",
                  cursor: "pointer",
                  transition: "all 0.2s ease-in-out",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  position: "relative"
                }}
              >
                <div style={{ fontWeight: "800", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  {storeName}
                </div>
                <div style={{ display: "flex", gap: "10px", fontSize: "0.75rem", color: isActive ? "#ccc" : "#666", marginTop: "4px" }}>
                  <span>Khách: <strong>{customers}</strong></span>
                  <span>|</span>
                  <span>Mua: <strong>{purchased}</strong></span>
                </div>
                <div style={{
                  position: "absolute",
                  bottom: "8px",
                  right: "12px",
                  fontSize: "0.8rem",
                  opacity: 0.6
                }}>
                  {isActive ? "▼" : "▶"}
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Store View */}
        {activeStoreTab && (() => {
          const storeReports = reports.filter(r => r.store === activeStoreTab);
          const customersCount = storeReports.length;
          const purchasedCount = storeReports.filter(r => r.purchased === true || r.purchased === "true" || r.purchased === "yes").length;
          const conversionRate = customersCount > 0 ? Math.round((purchasedCount / customersCount) * 100) : 0;

          return (
            <div 
              className="fade-in"
              style={{
                border: "2px solid #000",
                background: "var(--lush-gray-light)",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                marginTop: "4px"
              }}
            >
              {/* Store Detail Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", borderBottom: "1px solid #000", paddingBottom: "12px" }}>
                <h4 style={{ fontSize: "1.2rem", margin: 0, textTransform: "uppercase", fontWeight: "800" }}>
                  📍 {activeStoreTab}
                </h4>
                <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                  <span className="lush-tag dark" style={{ fontSize: "0.75rem" }}>
                    Khách tham gia: <strong>{customersCount}</strong>
                  </span>
                  <span className="lush-tag green" style={{ fontSize: "0.75rem" }}>
                    Khách mua hàng: <strong>{purchasedCount}</strong>
                  </span>
                  <span className="lush-tag" style={{ fontSize: "0.75rem", background: "var(--lush-gold-light)", borderColor: "var(--lush-gold)" }}>
                    Tỷ lệ mua: <strong>{conversionRate}%</strong>
                  </span>
                </div>
              </div>

              {/* Customer Records Under Selected Store */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <h5 style={{ fontSize: "0.85rem", textTransform: "uppercase", margin: 0, color: "#555", fontWeight: "800" }}>
                  Danh sách khách hàng ({customersCount})
                </h5>
                
                {customersCount > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "400px", overflowY: "auto", paddingRight: "4px" }}>
                    {storeReports.map((report) => (
                      <div 
                        key={report.id}
                        style={{
                          background: "#ffffff",
                          border: "1px solid var(--lush-gray-medium)",
                          padding: "16px",
                          display: "flex",
                          flexDirection: "column",
                          gap: "10px"
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                          <span style={{ fontWeight: "800", fontSize: "0.95rem" }}>
                            👤 {report.customerName || "Khách hàng ẩn danh"}
                          </span>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <span style={{ fontSize: "0.8rem", color: "#666" }}>{report.date}</span>
                            <span 
                              className={`lush-tag ${report.purchased === true || report.purchased === "true" || report.purchased === "yes" ? "green" : "dark"}`}
                              style={{ fontSize: "0.65rem", padding: "2px 6px", fontWeight: "700" }}
                            >
                              {report.purchased === true || report.purchased === "true" || report.purchased === "yes" ? "ĐÃ MUA" : "KHÔNG MUA"}
                            </span>
                          </div>
                        </div>

                        {/* Scalp conditions */}
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", alignItems: "center" }}>
                          <span style={{ fontSize: "0.75rem", color: "#666", fontWeight: "700" }}>Da đầu:</span>
                          {report.symptoms && report.symptoms.length > 0 ? (
                            report.symptoms.map((symId, idx) => (
                              <span 
                                key={idx}
                                style={{
                                  fontSize: "0.7rem",
                                  padding: "1px 5px",
                                  border: "1px solid #ccc",
                                  borderRadius: "2px",
                                  background: "#f9f9f9"
                                }}
                              >
                                {getSymptomLabel(symId)}
                              </span>
                            ))
                          ) : (
                            <span style={{ fontSize: "0.75rem", color: "#999", fontStyle: "italic" }}>Chưa ghi nhận</span>
                          )}
                        </div>

                        {/* Routine */}
                        <div style={{ fontSize: "0.85rem" }}>
                          <strong>🌿 Routine tư vấn:</strong>{" "}
                          <span style={{ color: "var(--lush-green)", fontWeight: "600" }}>
                            {report.routine || "Chưa đề xuất"}
                          </span>
                        </div>

                        {/* Feedback */}
                        <div style={{ fontSize: "0.8rem", borderTop: "1px dashed #eee", paddingTop: "8px", color: "#555", fontStyle: "italic" }}>
                          💬 {report.feedback ? `"${report.feedback}"` : "Không có nhận xét"}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: "20px", textAlign: "center", color: "#888", background: "#ffffff", border: "1px dashed var(--lush-gray-medium)", fontSize: "0.9rem" }}>
                    Chưa có khách hàng nào tham gia tại cửa hàng này.
                  </div>
                )}
              </div>
            </div>
          );
        })()}
      </div>

    </div>
  );
}
