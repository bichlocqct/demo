"use client";
import { useState } from "react";

export default function ScalpClassifier() {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [diagnosis, setDiagnosis] = useState(null);

  const symptomsList = [
    { id: "oily", label: "Tóc bết nhanh, da đầu tiết bóng dầu nhiều", value: "oily" },
    { id: "redness", label: "Da đầu ửng đỏ, có đốm hồng, dễ rát ngứa", value: "sensitive" },
    { id: "dry_flakes", label: "Có vảy bong tróc nhỏ màu trắng, da đầu khô căng", value: "dry" },
    { id: "thick_flakes", label: "Gàu vảy dày, bám thành mảng, ngứa dữ dội", value: "dandruff" },
    { id: "hair_loss", label: "Tóc rụng nhiều (>100 sợi/ngày), nang tóc yếu/thưa", value: "loss" },
    { id: "normal", label: "Da đầu sạch, không đỏ, ẩm mượt vừa phải, tóc khỏe", value: "normal" }
  ];

  const handleSymptomToggle = (id) => {
    if (id === "normal") {
      setSelectedSymptoms(["normal"]);
      return;
    }

    let updated = [...selectedSymptoms].filter(s => s !== "normal");
    if (updated.includes(id)) {
      updated = updated.filter(s => s !== id);
    } else {
      updated.push(id);
    }
    setSelectedSymptoms(updated);
  };

  const runDiagnosis = () => {
    if (selectedSymptoms.length === 0) {
      alert("Vui lòng chọn ít nhất một tình trạng quan sát được dưới máy soi!");
      return;
    }

    // Determine target type by scoring
    let oilyCount = selectedSymptoms.filter(s => s === "oily").length;
    let sensitiveCount = selectedSymptoms.filter(s => s === "redness").length;
    let dryCount = selectedSymptoms.filter(s => s === "dry_flakes").length;
    let dandruffCount = selectedSymptoms.filter(s => s === "thick_flakes").length;
    let lossCount = selectedSymptoms.filter(s => s === "hair_loss").length;
    let normalCount = selectedSymptoms.filter(s => s === "normal").length;

    let result = {
      type: "Da đầu thường / Cân bằng",
      desc: "Da đầu khỏe mạnh, tuyến bã nhờn và độ ẩm ở mức lý tưởng. Màng bảo vệ tự nhiên hoạt động tốt, nang tóc thông thoáng.",
      issues: "Không có vấn đề lớn. Cần duy trì cân bằng độ ẩm và nuôi dưỡng tóc chắc khỏe.",
      routine: [
        {
          step: "Bước 1: Scalp Treatment",
          name: "Roots",
          desc: "Bạc hà + mật ong + hoa hồng. Kích thích tuần hoàn máu nhẹ nhàng giúp tóc khỏe mạnh từ gốc.",
          usage: "Thoa lên da đầu khô trước khi gội 15-20 phút, massage nhẹ và xả sạch."
        },
        {
          step: "Bước 2: Shampoo",
          name: "Fairly Traded Honey",
          desc: "Dầu gội chứa hơn 50% mật ong Zambian giúp kháng khuẩn tự nhiên, dưỡng ẩm và làm mềm mượt tóc vượt trội.",
          usage: "Tạo bọt gội nhẹ nhàng toàn bộ da đầu và tóc."
        },
        {
          step: "Bước 3: Conditioner",
          name: "American Cream",
          desc: "Dầu xả chứa dâu tây tươi, mật ong và oải hương giúp làm mượt và lưu lại hương thơm vani quyến rũ.",
          usage: "Thoa từ giữa thân tóc đến ngọn tóc, xả sạch sau 2-3 phút."
        }
      ]
    };

    if (normalCount > 0) {
      // Normal type already initialized
    } else if (dandruffCount > 0) {
      result = {
        type: "Da đầu gàu & ngứa nấm (Dandruff / Flaky Scalp)",
        desc: "Xuất hiện vảy gàu dày bám dính, ngứa ngáy dữ dội do sự phát triển quá mức của nấm Malassezia kết hợp bã nhờn.",
        issues: "Ngứa rát nang tóc, bong tróc mảng gàu lớn, có nguy cơ gây viêm da tiết bã.",
        routine: [
          {
            step: "Bước 1: Scalp Treatment",
            name: "SuperBalm",
            desc: "Sáp dưỡng da đầu chuyên sâu chứa dầu dừa, sáp candelilla và tinh dầu cúc la mã giúp làm dịu ngứa, bong tróc vảy gàu.",
            usage: "Thoa trực tiếp một lượng nhỏ lên các vùng da đầu bị gàu khô/bong vảy trước khi gội 20 phút."
          },
          {
            step: "Bước 2: Shampoo Bar",
            name: "Soak and Float",
            desc: "Dầu gội bánh chứa dầu cây bách xù gai (Cade oil) giúp kháng nấm, trị gàu triệt để và cúc vạn thọ giúp làm dịu da đầu ngứa ngáy.",
            usage: "Xoa bánh gội lên tóc ướt để tạo bọt, massage kỹ da đầu rồi xả sạch."
          },
          {
            step: "Bước 3: Conditioner",
            name: "Veganese",
            desc: "Dầu xả mỏng nhẹ chứa thạch agar và chanh giúp tóc bóng mượt tự nhiên mà không gây bết dính da đầu gàu.",
            usage: "Thoa nhẹ lên đuôi tóc và xả sạch."
          }
        ]
      };
    } else if (oilyCount > 0) {
      result = {
        type: "Da đầu dầu & bết dính (Oily Scalp)",
        desc: "Tuyến bã nhờn hoạt động quá mức gây đổ dầu nhiều, làm bít tắc các nang tóc, khiến sợi tóc bị xẹp dính và dễ sinh mụn da đầu.",
        issues: "Bết tóc nhanh chóng (trong vòng 1 ngày sau gội), ngứa bết, mùi dầu hôi, lỗ chân lông bít tắc gây rụng tóc.",
        routine: [
          {
            step: "Bước 1: Scalp Treatment",
            name: "Roots",
            desc: "Mặt nạ da đầu bạc hà kích thích mạch máu lưu thông, tẩy tế bào chết nhẹ và kiềm dầu hiệu quả.",
            usage: "Massage lên da đầu khô trước khi gội 15-20 phút, tạo cảm giác mát lạnh sảng khoái."
          },
          {
            step: "Bước 2: Shampoo",
            name: "Rehab / Big",
            desc: "Dầu gội Rehab chứa đu đủ tươi, bạc hà làm sạch sâu kiềm dầu. Hoặc Big chứa muối biển thô giúp tẩy tế bào chết da đầu, tạo phồng tóc cực tốt.",
            usage: "Lấy một lượng vừa đủ, gội kỹ phần chân tóc để làm sạch dầu bã nhờn."
          },
          {
            step: "Bước 3: Conditioner",
            name: "Veganese",
            desc: "Dầu xả chiết xuất từ rong biển agar agar và chanh tươi giúp làm mượt tóc nhưng giữ cho chân tóc cực kỳ tơi phồng, không bết.",
            usage: "Chỉ thoa dầu xả ở ngọn tóc, tránh tuyệt đối tiếp xúc với da đầu dầu."
          }
        ]
      };
    } else if (sensitiveCount > 0) {
      result = {
        type: "Da đầu nhạy cảm & kích ứng (Sensitive Scalp)",
        desc: "Lớp màng bảo vệ da đầu bị tổn thương, dễ bị đỏ ửng, viêm ngứa hoặc châm chích rát khi tiếp xúc hóa chất, khói bụi.",
        issues: "Ửng đỏ dưới nang tóc, ngứa râm ran, rát nhẹ khi gội đầu. Cần sản phẩm cực kỳ dịu lành, không cồn/hóa chất mạnh.",
        routine: [
          {
            step: "Bước 1: Scalp Treatment",
            name: "SuperBalm",
            desc: "Hỗn hợp sáp thảo dược giúp tái tạo màng ẩm bảo vệ da đầu, làm dịu vùng đỏ viêm rát cực kỳ nhanh chóng.",
            usage: "Thoa thật mỏng lên các điểm da đầu đỏ rát trước gội 15 phút."
          },
          {
            step: "Bước 2: Shampoo",
            name: "Fairly Traded Honey",
            desc: "Dầu gội mật ong chiếm đa số thành phần làm sạch dịu nhẹ, dưỡng ẩm và làm dịu vùng da đầu nhạy cảm tổn thương.",
            usage: "Tạo bọt thật kỹ trước khi thoa lên da đầu để giảm ma sát chà xát trực tiếp."
          },
          {
            step: "Bước 3: Conditioner",
            name: "American Cream",
            desc: "Dầu xả chứa oải hương làm dịu da và mật ong dưỡng ẩm sâu giúp củng cố độ khỏe sợi tóc.",
            usage: "Xoa nhẹ nhàng lên thân tóc và ngọn tóc, xả lại bằng nước mát."
          }
        ]
      };
    } else if (dryCount > 0) {
      result = {
        type: "Da đầu khô & thiếu ẩm (Dry Scalp)",
        desc: "Da đầu thiếu hụt dầu tự nhiên và độ ẩm, khiến da căng chặt, dễ bong tróc các vảy khô li ti giống gàu nhưng không nhờn.",
        issues: "Sợi tóc khô xơ chẻ ngọn, da đầu ngứa khô, hay bị bong tróc vảy da chết nhỏ khi chải đầu.",
        routine: [
          {
            step: "Bước 1: Scalp Treatment",
            name: "SuperBalm",
            desc: "Sáp dưỡng chuyên sâu cung cấp chất béo thực vật dồi dào từ bơ và sáp candelilla phục hồi độ ẩm da đầu khô.",
            usage: "Thoa và massage nhẹ nhàng lên da đầu khô 20 phút trước khi gội đầu."
          },
          {
            step: "Bước 2: Shampoo",
            name: "Fairly Traded Honey",
            desc: "Dầu gội dưỡng ẩm cực đỉnh của LUSH, giữ độ ẩm tự nhiên không bị rửa trôi.",
            usage: "Massage nhẹ chân tóc, tránh dùng nước quá nóng khi gội đầu làm mất thêm dầu tự nhiên."
          },
          {
            step: "Bước 3: Conditioner",
            name: "Candy Rain",
            desc: "Dầu xả dưỡng ẩm sâu nhất chứa hạt macadamia và nước dừa giúp phục hồi sợi tóc khô xơ hư tổn trở nên óng ả mềm mượt.",
            usage: "Thoa đẫm đuôi tóc xả sạch sau 3-5 phút."
          }
        ]
      };
    } else if (lossCount > 0) {
      result = {
        type: "Da đầu yếu & Rụng tóc nhiều (Hair Loss / Thinning Scalp)",
        desc: "Nang tóc bị thiếu dưỡng chất, lưu thông máu dưới da đầu kém, vòng đời sợi tóc bị rút ngắn khiến tóc rụng nhiều và thưa thớt.",
        issues: "Tóc rụng chân trắng nhiều, nang tóc teo nhỏ, mật độ tóc giảm. Cần kích thích tuần hoàn máu để nuôi dưỡng chân tóc.",
        routine: [
          {
            step: "Bước 1: Scalp Treatment",
            name: "Roots",
            desc: "Sản phẩm must-have cho tóc rụng. Chứa bạc hà kích thích lưu thông máu dưới da đầu mạnh mẽ, giúp mang dinh dưỡng nuôi nang tóc.",
            usage: "Bôi đều lên da đầu và massage kỹ trong 5 phút. Để nguyên 15 phút rồi đi gội."
          },
          {
            step: "Bước 2: Shampoo Bar",
            name: "New Shampoo Bar",
            desc: "Bánh gội chứa dầu quế, đinh hương và lá bạc hà kích thích mọc tóc cực nhanh và ngừa rụng chân tóc rõ rệt.",
            usage: "Lướt nhẹ bánh gội lên tóc ướt vài lần để tạo bọt, massage da đầu và xả sạch."
          },
          {
            step: "Bước 3: Leave-in",
            name: "Superhero Milk",
            desc: "Xịt dưỡng leave-in chứa dầu hạnh nhân, bơ quả bơ giúp bao bọc bảo vệ sợi tóc mảnh yếu khỏi gãy rụng từ tác động bên ngoài.",
            usage: "Xịt lên tóc ẩm sau khi gội sạch và lau khô bằng khăn."
          }
        ]
      };
    }

    setDiagnosis(result);
  };

  const resetQuiz = () => {
    setSelectedSymptoms([]);
    setDiagnosis(null);
  };

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      
      <div style={{ borderBottom: "1px solid var(--lush-gray-medium)", paddingBottom: "12px" }}>
        <h2 style={{ fontSize: "1.5rem" }}>Trạm Chẩn Đoán & Phân Loại Da Đầu</h2>
        <p style={{ color: "#666", fontSize: "0.9rem" }}>
          Hãy chọn các triệu chứng / dấu hiệu quan sát được dưới máy soi da đầu của khách hàng để hệ thống gợi ý tình trạng và routine LUSH tương ứng.
        </p>
      </div>

      <div className="grid-split-classifier">
        
        {/* Left Column: Quiz Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <h3 style={{ fontSize: "1.1rem", textTransform: "uppercase" }}>Dấu Hiệu Quan Sát Dưới Máy Soi:</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {symptomsList.map((symptom) => {
              const isSelected = selectedSymptoms.includes(symptom.id);
              return (
                <div 
                  key={symptom.id}
                  onClick={() => handleSymptomToggle(symptom.id)}
                  className={`quiz-option ${isSelected ? "selected" : ""}`}
                >
                  <div style={{
                    width: "18px",
                    height: "18px",
                    border: "2px solid currentColor",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "2px",
                    flexShrink: 0
                  }}>
                    {isSelected && <div style={{ width: "10px", height: "10px", background: "currentColor" }} />}
                  </div>
                  <span style={{ fontSize: "0.9rem", fontWeight: "600" }}>{symptom.label}</span>
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
            <button className="lush-btn" onClick={runDiagnosis} style={{ flex: 1 }}>
              Chẩn Đoán Tình Trạng
            </button>
            <button className="lush-btn lush-btn-secondary" onClick={resetQuiz}>
              Xóa Lựa Chọn
            </button>
          </div>
        </div>

        {/* Right Column: Result Diagnostic Card */}
        <div>
          {diagnosis ? (
            <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              
              {/* Scalp Diagnosis Header */}
              <div style={{ 
                border: "3px solid var(--lush-black)", 
                background: "var(--lush-black)", 
                color: "var(--lush-white)", 
                padding: "24px",
                position: "relative"
              }}>
                <div className="lush-tag" style={{ background: "var(--lush-gold)", color: "#000", border: "none", fontWeight: "800", marginBottom: "8px" }}>
                  KẾT QUẢ PHÂN TÍCH
                </div>
                <h2 style={{ fontSize: "1.6rem", textTransform: "uppercase", margin: "4px 0 8px" }}>{diagnosis.type}</h2>
                <div style={{ borderTop: "1px solid #444", paddingTop: "12px", marginTop: "12px" }}>
                  <p style={{ fontSize: "0.95rem", color: "#ccc", lineHeight: "1.5" }}>
                    <strong>Mô tả tình trạng:</strong> {diagnosis.desc}
                  </p>
                  <p style={{ fontSize: "0.95rem", color: "#ccc", lineHeight: "1.5", marginTop: "8px" }}>
                    <strong>Vấn đề cần tập trung:</strong> {diagnosis.issues}
                  </p>
                </div>
              </div>

              {/* LUSH Routine Recommendation */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <h3 style={{ fontSize: "1.2rem", textTransform: "uppercase" }}>🌿 LUSH Routine Đề Xuất Phù Hợp:</h3>
                
                {diagnosis.routine.map((product, idx) => (
                  <div 
                    key={idx}
                    className="lush-card"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "auto 1fr",
                      gap: "20px",
                      alignItems: "start",
                      padding: "20px"
                    }}
                  >
                    {/* Circle Step Number */}
                    <div style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      background: "var(--lush-black)",
                      color: "var(--lush-white)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      fontSize: "15px"
                    }}>
                      {idx + 1}
                    </div>

                    {/* Product Details */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                        <span className="sub-title" style={{ fontSize: "0.7rem", color: "#666" }}>{product.step}</span>
                        <span className="lush-tag green" style={{ fontSize: "0.7rem", padding: "2px 6px" }}>{product.name}</span>
                      </div>
                      <p style={{ fontSize: "0.9rem", color: "#333", marginTop: "2px" }}>
                        <strong>Thành phần & Công dụng:</strong> {product.desc}
                      </p>
                      <p style={{ fontSize: "0.85rem", color: "var(--lush-green)", background: "var(--lush-green-light)", padding: "6px 10px", marginTop: "4px" }}>
                        💡 <strong>Cách dùng tại tiệm/tư vấn:</strong> {product.usage}
                      </p>
                    </div>

                  </div>
                ))}
              </div>

            </div>
          ) : (
            <div style={{
              border: "2px dashed var(--lush-gray-medium)",
              padding: "48px 24px",
              textAlign: "center",
              color: "#888",
              height: "100%",
              minHeight: "350px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "12px"
            }}>
              <span style={{ fontSize: "3rem" }}>🔍</span>
              <h3 style={{ fontSize: "1.2rem", color: "#444" }}>Chưa có kết quả chẩn đoán</h3>
              <p style={{ fontSize: "0.9rem", maxWidth: "300px" }}>
                Hãy tích chọn các biểu hiện quan sát được ở cột bên trái và nhấn nút "Chẩn Đoán Tình Trạng" để hệ thống tính toán kết quả da đầu và routine LUSH tương ứng.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
