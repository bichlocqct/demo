"use client";
import { useState } from "react";
import Image from "next/image";

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
      image: "/scalp_normal.png",
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
    } else if (oilyCount > 0 && (dryCount > 0 || sensitiveCount > 0)) {
      result = {
        type: "Da đầu hỗn hợp (Combination Scalp)",
        desc: "Tình trạng da đầu đổ nhiều dầu ở vùng đỉnh đầu nhưng lại bị khô ráp, bong tróc hoặc nhạy cảm ở vùng hai bên thái dương và sau gáy. Tình trạng này thay đổi thất thường theo thời tiết và mùa trong năm.",
        issues: "Phân bổ bã nhờn không đồng đều, nang tóc vùng đỉnh dễ bết tắc trong khi vùng bên cạnh thiếu độ ẩm tự nhiên.",
        image: "/scalp_combination.png",
        routine: [
          {
            step: "Bước 1: Scalp Treatment",
            name: "Roots",
            desc: "Massage mặt nạ đất sét bạc hà tươi lên vùng da đầu đổ dầu nhiều (đỉnh đầu) trước khi gội 15 phút để làm sạch sâu bã nhờn.",
            usage: "Thoa lên phần da đầu dầu ở đỉnh đầu trước khi gội 15-20 phút, massage nhẹ và xả sạch."
          },
          {
            step: "Bước 2: Shampoo",
            name: "Fairly Traded Honey",
            desc: "Dầu gội chứa hơn 50% mật ong tự nhiên giúp kháng khuẩn và cấp ẩm cân bằng cho toàn bộ da đầu mà không gây xẹp tóc hay làm khô các vùng nhạy cảm.",
            usage: "Tạo bọt kỹ và gội sạch nhẹ nhàng toàn bộ da đầu."
          },
          {
            step: "Bước 3: Conditioner",
            name: "Veganese",
            desc: "Dầu xả mỏng nhẹ chiết xuất thạch agar agar và chanh tươi giúp làm mượt thân và ngọn tóc, giữ độ tơi phồng tự nhiên cho chân tóc.",
            usage: "Chỉ thoa dầu xả ở ngọn tóc và thân tóc, tránh tuyệt đối bôi trực tiếp lên da đầu."
          }
        ]
      };
    } else if (dandruffCount > 0) {
      result = {
        type: "Da đầu gàu & ngứa nấm (Dandruff / Flaky Scalp)",
        desc: "Xuất hiện vảy gàu dày bám dính, ngứa ngáy dữ dội do sự phát triển quá mức của nấm Malassezia kết hợp bã nhờn.",
        issues: "Ngứa rát nang tóc, bong tróc mảng gàu lớn, có nguy cơ gây viêm da tiết bã.",
        image: "/scalp_dandruff.png",
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
        image: "/scalp_oily.png",
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
        image: "/scalp_sensitive.png",
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
        image: "/scalp_dry.png",
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
        image: "/scalp_loss.png",
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
            name: "Super Milk",
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
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      
      {/* Top Diagnostics Station */}
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
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

                {/* Scalp Image Illustration */}
                {diagnosis.image && (
                  <div style={{
                    border: "3px solid var(--lush-black)",
                    height: "220px",
                    position: "relative",
                    overflow: "hidden"
                  }}>
                    <Image
                      src={diagnosis.image}
                      alt={diagnosis.type}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      style={{ objectFit: "cover" }}
                    />
                    <div style={{
                      position: "absolute",
                      bottom: "10px",
                      right: "10px",
                      fontSize: "0.75rem",
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      background: "#000",
                      color: "#fff",
                      padding: "4px 8px"
                    }}>
                      Hình Ảnh Soi Da Đầu Thực Tế
                    </div>
                  </div>
                )}

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

                {/* Ranh giới y tế - Ngưỡng chuyển tuyến */}
                <div style={{
                  border: "2px solid var(--lush-red)",
                  background: "#fdf2f2",
                  padding: "16px",
                  color: "#9b1c1c",
                  fontSize: "0.85rem",
                  marginTop: "8px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px"
                }}>
                  <div style={{ fontWeight: "800", display: "flex", alignItems: "center", gap: "6px", textTransform: "uppercase" }}>
                    ⚠️ NGƯỠNG CHUYỂN TUYẾN Y KHOA (DISCLAIMER)
                  </div>
                  <p style={{ lineHeight: "1.4", margin: 0 }}>
                    Kết quả phân tích trên mang tính chất gợi ý routine mỹ phẩm LUSH hỗ trợ chăm sóc da đầu lành mạnh. Nếu dưới máy soi quan sát thấy da đầu khách có biểu hiện viêm loét chảy dịch, mụn mủ nhiễm trùng nặng, nấm tróc vảy mảng lớn chảy máu, hoặc rụng tóc loang lổ tạo mảng hói trơn láng, nhân viên <strong>tuyệt đối không được chẩn đoán y khoa</strong> và cần khuyên khách hàng đến khám trực tiếp tại bác sĩ da liễu.
                  </p>
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

      {/* Educational Guide Section from Infographic */}
      <div style={{ marginTop: "40px", borderTop: "3px solid var(--lush-black)", paddingTop: "40px", display: "flex", flexDirection: "column", gap: "32px" }}>
        
        <div style={{ textAlign: "center", marginBottom: "10px" }}>
          <span className="sub-title" style={{ color: "var(--lush-green)", fontSize: "0.85rem", fontWeight: "800" }}>LUSH HAIRCARE</span>
          <h2 style={{ fontSize: "2rem", marginTop: "8px", fontFamily: "var(--font-serif)" }}>Thấu Hiểu Mái Tóc Từ Khoa Học Đến Thiên Nhiên</h2>
          <p style={{ color: "#555", maxWidth: "600px", margin: "10px auto 0", fontSize: "0.95rem" }}>
            Hệ thống kiến thức đào tạo chuyên sâu về cấu tạo tóc, chu kỳ sinh trưởng và các giải pháp chăm sóc phục hồi chuyên biệt từ thảo mộc LUSH.
          </p>
        </div>


        {/* Row 2: Scalp Classifications */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <h3 style={{ fontSize: "1.3rem", display: "flex", alignItems: "center", gap: "10px" }}>
            <span>👤</span> Phân Loại Da Đầu Phổ Biến & Chỉ Số Đối Chiếu Dưới Máy Soi
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "24px" }}>
            
            {/* Normal Scalp */}
            <div className="lush-card" style={{ display: "flex", flexDirection: "column", gap: "12px", borderLeft: "8px solid var(--lush-green)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="lush-tag dark">DA THƯỜNG / CÂN BẰNG</span>
                <span style={{ fontSize: "1.5rem" }}>🌿</span>
              </div>
              <div style={{ position: "relative", height: "140px", border: "1px solid var(--lush-gray-medium)", overflow: "hidden", margin: "4px 0" }}>
                <Image
                  src="/scalp_normal.png"
                  alt="Da đầu thường"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div style={{ fontSize: "0.85rem", color: "#444", display: "flex", flexDirection: "column", gap: "6px" }}>
                <p><strong>Triệu chứng:</strong> Bề mặt ẩm mượt tự nhiên, tóc tơi phồng, không ngứa rát hay bong vảy.</p>
                <div style={{ background: "#f9f9f9", padding: "8px", border: "1px solid #eee", fontSize: "0.8rem" }}>
                  <strong style={{ display: "block", marginBottom: "4px", color: "#000" }}>🔍 CHỈ SỐ SOI DA ĐẦU:</strong>
                  • <strong>Bã nhờn:</strong> Cân bằng, phễu nang tóc sạch, không đọng bã nhờn cứng.<br/>
                  • <strong>Tế bào chết:</strong> Rất ít hoặc không có vảy sừng chết bong tróc.<br/>
                  • <strong>Mật độ nang:</strong> Cao, mỗi nang chứa từ 2 - 3 sợi tóc dày khỏe.<br/>
                  • <strong>Mức độ viêm đỏ:</strong> Da đầu có màu hồng nhạt/trắng sáng khỏe, không đỏ mạch máu.
                </div>
              </div>
              <div style={{ marginTop: "8px", paddingTop: "8px", borderTop: "1px solid var(--lush-gray-medium)", fontSize: "0.85rem" }}>
                <strong style={{ color: "var(--lush-green)", display: "block", marginBottom: "4px" }}>💡 GIẢI PHÁP TỪ LUSH:</strong>
                Gội mật ong <strong>Fairly Traded Honey</strong> và massage mặt nạ đất sét bạc hà <strong>Roots</strong> hàng tuần để duy trì độ ẩm tự nhiên của da đầu.
              </div>
            </div>

            {/* Dry Scalp */}
            <div className="lush-card" style={{ display: "flex", flexDirection: "column", gap: "12px", borderLeft: "8px solid #c0392b" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="lush-tag dark">DA KHÔ / THIẾU ẨM</span>
                <span style={{ fontSize: "1.5rem" }}>🍂</span>
              </div>
              <div style={{ position: "relative", height: "140px", border: "1px solid var(--lush-gray-medium)", overflow: "hidden", margin: "4px 0" }}>
                <Image
                  src="/scalp_dry.png"
                  alt="Da đầu khô"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div style={{ fontSize: "0.85rem", color: "#444", display: "flex", flexDirection: "column", gap: "6px" }}>
                <p><strong>Triệu chứng:</strong> Căng chặt da đầu, ngứa khô châm chích, sợi tóc mảnh yếu dễ xơ rối và chẻ ngọn.</p>
                <div style={{ background: "#f9f9f9", padding: "8px", border: "1px solid #eee", fontSize: "0.8rem" }}>
                  <strong style={{ display: "block", marginBottom: "4px", color: "#000" }}>🔍 CHỈ SỐ SOI DA ĐẦU:</strong>
                  • <strong>Bã nhờn:</strong> Không có dầu thừa, tuyến bã nhờn hoạt động kém, bề mặt da ráp.<br/>
                  • <strong>Tế bào chết:</strong> Vảy sừng mỏng, khô màu trắng li ti phủ rải rác trên bề mặt da đầu.<br/>
                  • <strong>Mật độ nang:</strong> Nang tóc bình thường nhưng sợi tóc mảnh, thân tóc khô mất nước.<br/>
                  • <strong>Mức độ viêm đỏ:</strong> Nền da đầu hơi xỉn màu hoặc khô nhăn, không đỏ.
                </div>
              </div>
              <div style={{ marginTop: "8px", paddingTop: "8px", borderTop: "1px solid var(--lush-gray-medium)", fontSize: "0.85rem" }}>
                <strong style={{ color: "var(--lush-red)", display: "block", marginBottom: "4px" }}>💡 GIẢI PHÁP TỪ LUSH:</strong>
                Cấp béo tự nhiên bằng sáp dưỡng <strong>SuperBalm</strong> trước gội 20 phút, dùng dầu gội mật ong <strong>Fairly Traded Honey</strong> và dầu xả siêu dưỡng ẩm <strong>Candy Rain</strong>.
              </div>
            </div>

            {/* Oily Scalp */}
            <div className="lush-card" style={{ display: "flex", flexDirection: "column", gap: "12px", borderLeft: "8px solid #2980b9" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="lush-tag dark">DA DẦU / BẾT DÍNH</span>
                <span style={{ fontSize: "1.5rem" }}>💧</span>
              </div>
              <div style={{ position: "relative", height: "140px", border: "1px solid var(--lush-gray-medium)", overflow: "hidden", margin: "4px 0" }}>
                <Image
                  src="/scalp_oily.png"
                  alt="Da đầu dầu"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div style={{ fontSize: "0.85rem", color: "#444", display: "flex", flexDirection: "column", gap: "6px" }}>
                <p><strong>Triệu chứng:</strong> Tóc xẹp bết sát da đầu chỉ sau vài tiếng gội, bết dính dầu, lỗ chân lông dễ lên mụn viêm.</p>
                <div style={{ background: "#f9f9f9", padding: "8px", border: "1px solid #eee", fontSize: "0.8rem" }}>
                  <strong style={{ display: "block", marginBottom: "4px", color: "#000" }}>🔍 CHỈ SỐ SOI DA ĐẦU:</strong>
                  • <strong>Bã nhờn:</strong> Bã nhờn ướt nhầy phủ bề mặt da đầu, tích tụ cục bã nhờn vàng bao quanh phễu nang tóc.<br/>
                  • <strong>Tế bào chết:</strong> Bám bết thành từng mảng ẩm, không bong ra mà kết dính với dầu thừa.<br/>
                  • <strong>Mật độ nang:</strong> Bị b bịt tắc nghẽn, cản trở sự hô hấp của nang tóc, gây rụng chân tóc.<br/>
                  • <strong>Mức độ viêm đỏ:</strong> Có đốm đỏ viêm nhẹ quanh vùng cổ nang tóc do vi khuẩn tích tụ.
                </div>
              </div>
              <div style={{ marginTop: "8px", paddingTop: "8px", borderTop: "1px solid var(--lush-gray-medium)", fontSize: "0.85rem" }}>
                <strong style={{ color: "#2980b9", display: "block", marginBottom: "4px" }}>💡 GIẢI PHÁP TỪ LUSH:</strong>
                Kiềm dầu bằng mặt nạ da đầu bạc hà <strong>Roots</strong>, làm sạch sâu bằng dầu gội muối biển <strong>Big</strong> hoặc gội chứa enzym đu đủ <strong>Rehab</strong>.
              </div>
            </div>

            {/* Combination Scalp */}
            <div className="lush-card" style={{ display: "flex", flexDirection: "column", gap: "12px", borderLeft: "8px solid var(--lush-gold)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="lush-tag dark">DA HỖN HỢP</span>
                <span style={{ fontSize: "1.5rem" }}>⚖️</span>
              </div>
              <div style={{ position: "relative", height: "140px", border: "1px solid var(--lush-gray-medium)", overflow: "hidden", margin: "4px 0" }}>
                <Image
                  src="/scalp_combination.png"
                  alt="Da đầu hỗn hợp"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div style={{ fontSize: "0.85rem", color: "#444", display: "flex", flexDirection: "column", gap: "6px" }}>
                <p><strong>Triệu chứng:</strong> Bết dầu ở đỉnh đầu (vùng chữ T) nhưng hai bên thái dương và gáy lại khô ráp, căng hoặc ngứa nhẹ.</p>
                <div style={{ background: "#f9f9f9", padding: "8px", border: "1px solid #eee", fontSize: "0.8rem" }}>
                  <strong style={{ display: "block", marginBottom: "4px", color: "#000" }}>🔍 CHỈ SỐ SOI DA ĐẦU:</strong>
                  • <strong>Bã nhờn:</strong> Tuyến bã nhờn hoạt động quá mức ở đỉnh đầu, trong khi vùng bên cạnh rất khô.<br/>
                  • <strong>Tế bào chết:</strong> Bong tróc vảy khô tập trung ở vùng gáy và thái dương.<br/>
                  • <strong>Mật độ nang:</strong> Nang đỉnh đầu bít tắc bã nhờn, nang hai bên có thân tóc khô mảnh.<br/>
                  • <strong>Mức độ viêm đỏ:</strong> Da đầu đỏ nhẹ hoặc nhạy cảm tại những khu vực bị khô căng thiếu lipid.
                </div>
              </div>
              <div style={{ marginTop: "8px", paddingTop: "8px", borderTop: "1px solid var(--lush-gray-medium)", fontSize: "0.85rem" }}>
                <strong style={{ color: "var(--lush-gold)", display: "block", marginBottom: "4px" }}>💡 GIẢI PHÁP TỪ LUSH:</strong>
                Chăm sóc đa vùng: Thoa <strong>Roots</strong> lên vùng đỉnh đầu nhiều dầu, gội dưỡng ẩm dịu nhẹ <strong>Fairly Traded Honey</strong> và chỉ dùng dầu xả mỏng nhẹ ở ngọn tóc.
              </div>
            </div>

            {/* Dandruff & Flaky Scalp */}
            <div className="lush-card" style={{ display: "flex", flexDirection: "column", gap: "12px", borderLeft: "8px solid #8e44ad" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="lush-tag dark" style={{ background: "#8e44ad", borderColor: "#8e44ad" }}>GÀU VÀ BONG TRÓC MẢNG</span>
                <span style={{ fontSize: "1.5rem" }}>❄️</span>
              </div>
              <div style={{ position: "relative", height: "140px", border: "1px solid var(--lush-gray-medium)", overflow: "hidden", margin: "4px 0" }}>
                <Image
                  src="/scalp_dandruff.png"
                  alt="Da đầu gàu"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div style={{ fontSize: "0.85rem", color: "#444", display: "flex", flexDirection: "column", gap: "6px" }}>
                <p><strong>Triệu chứng:</strong> Gàu vảy trắng/vàng rơi nhiều trên vai áo, ngứa da đầu ngột ngạt dữ dội, hay gãi trầy xước da.</p>
                <div style={{ background: "#f9f9f9", padding: "8px", border: "1px solid #eee", fontSize: "0.8rem" }}>
                  <strong style={{ display: "block", marginBottom: "4px", color: "#000" }}>🔍 CHỈ SỐ SOI DA ĐẦU:</strong>
                  • <strong>Bã nhờn:</strong> Bã nhờn tích tụ nhiều bám dính chặt cùng tế bào sừng.<br/>
                  • <strong>Tế bào chết:</strong> Các mảng sừng chết bong thành vảy lớn xếp chồng lên nhau bịt kín lỗ chân lông.<br/>
                  • <strong>Mật độ nang:</strong> Chân tóc bị bịt kín, đôi khi phát hiện mụn gàu hoặc vết trầy đỏ do ngứa gãi.<br/>
                  • <strong>Mức độ viêm đỏ:</strong> Đỏ ửng xung quanh vùng bong vảy gàu (dấu hiệu nấm Malassezia bùng phát).
                </div>
              </div>
              <div style={{ marginTop: "8px", paddingTop: "8px", borderTop: "1px solid var(--lush-gray-medium)", fontSize: "0.85rem" }}>
                <strong style={{ color: "#8e44ad", display: "block", marginBottom: "4px" }}>💡 GIẢI PHÁP TỪ LUSH:</strong>
                Làm sạch vảy gàu và làm dịu da đầu bằng sáp dưỡng <strong>SuperBalm</strong> trước khi gội đầu bằng bánh dầu gội kháng nấm đặc trị <strong>Soak and Float</strong>.
              </div>
            </div>

            {/* Sensitive Scalp */}
            <div className="lush-card" style={{ display: "flex", flexDirection: "column", gap: "12px", borderLeft: "8px solid #e67e22" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="lush-tag dark" style={{ background: "#e67e22", borderColor: "#e67e22" }}>DA NHẠY CẢM & DỄ KÍCH ỨNG</span>
                <span style={{ fontSize: "1.5rem" }}>🚨</span>
              </div>
              <div style={{ position: "relative", height: "140px", border: "1px solid var(--lush-gray-medium)", overflow: "hidden", margin: "4px 0" }}>
                <Image
                  src="/scalp_sensitive.png"
                  alt="Da đầu nhạy cảm"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div style={{ fontSize: "0.85rem", color: "#444", display: "flex", flexDirection: "column", gap: "6px" }}>
                <p><strong>Triệu chứng:</strong> Cảm giác châm chích rát nhẹ khi đi gió, đổi dầu gội, nổi sẩn ngứa đỏ hoặc xót rát khi sấy nóng.</p>
                <div style={{ background: "#f9f9f9", padding: "8px", border: "1px solid #eee", fontSize: "0.8rem" }}>
                  <strong style={{ display: "block", marginBottom: "4px", color: "#000" }}>🔍 CHỈ SỐ SOI DA ĐẦU:</strong>
                  • <strong>Bã nhờn:</strong> Rất ít, màng lipid bảo vệ da đầu bị bào mòn mỏng yếu.<br/>
                  • <strong>Tế bào chết:</strong> Có thể bong tế bào chết dạng cám nhẹ do bề mặt da khô yếu kích ứng.<br/>
                  • <strong>Mật độ nang:</strong> Sợi tóc mỏng mảnh, dễ rụng chân tóc do nang bị tổn thương.<br/>
                  • <strong>Mức độ viêm đỏ:</strong> Nổi các mao mạch máu nhỏ li ti, các vệt hoặc mảng da đỏ loang lổ.
                </div>
              </div>
              <div style={{ marginTop: "8px", paddingTop: "8px", borderTop: "1px solid var(--lush-gray-medium)", fontSize: "0.85rem" }}>
                <strong style={{ color: "#e67e22", display: "block", marginBottom: "4px" }}>💡 GIẢI PHÁP TỪ LUSH:</strong>
                Hạn chế dùng hóa chất mạnh. Phục hồi màng da bằng sáp dưỡng <strong>SuperBalm</strong>, gội cực kỳ dịu nhẹ bằng mật ong nguyên chất <strong>Fairly Traded Honey</strong>.
              </div>
            </div>

            {/* Hair Loss Scalp */}
            <div className="lush-card" style={{ display: "flex", flexDirection: "column", gap: "12px", borderLeft: "8px solid #7f8c8d" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="lush-tag dark" style={{ background: "#7f8c8d", borderColor: "#7f8c8d" }}>DA ĐẦU YẾU & RỤNG TÓC</span>
                <span style={{ fontSize: "1.5rem" }}>📉</span>
              </div>
              <div style={{ position: "relative", height: "140px", border: "1px solid var(--lush-gray-medium)", overflow: "hidden", margin: "4px 0" }}>
                <Image
                  src="/scalp_loss.png"
                  alt="Da đầu rụng tóc"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div style={{ fontSize: "0.85rem", color: "#444", display: "flex", flexDirection: "column", gap: "6px" }}>
                <p><strong>Triệu chứng:</strong> Tóc rụng trên 100 sợi mỗi ngày khi gội hoặc chải, mật độ tóc thưa mỏng nhìn rõ da đầu vùng đỉnh.</p>
                <div style={{ background: "#f9f9f9", padding: "8px", border: "1px solid #eee", fontSize: "0.8rem" }}>
                  <strong style={{ display: "block", marginBottom: "4px", color: "#000" }}>🔍 CHỈ SỐ SOI DA ĐẦU:</strong>
                  • <strong>Bã nhờn:</strong> Có thể tắc nghẽn bã sừng cứng (sebaceous plug) cản trở nang tóc mới phát triển.<br/>
                  • <strong>Tế bào chết:</strong> Bã sừng kết dính lâu ngày gây teo lỗ nang tóc.<br/>
                  • <strong>Mật độ nang:</strong> Cực kỳ thấp, phát hiện nhiều nang tóc rỗng (chỉ có chân không có ngọn) hoặc nang chỉ có 1 sợi tóc mảnh yếu.<br/>
                  • <strong>Mức độ viêm đỏ:</strong> Nền da đầu xỉn màu, tuần hoàn máu dưới nang kém.
                </div>
              </div>
              <div style={{ marginTop: "8px", paddingTop: "8px", borderTop: "1px solid var(--lush-gray-medium)", fontSize: "0.85rem" }}>
                <strong style={{ color: "#7f8c8d", display: "block", marginBottom: "4px" }}>💡 GIẢI PHÁP TỪ LUSH:</strong>
                Massage kích thích tuần hoàn máu bằng <strong>Roots</strong>, kích hoạt nang tóc bằng bánh dầu gội quế đinh hương bạc hà <strong>New Shampoo Bar</strong>.
              </div>
            </div>

          </div>
        </div>

        {/* MEDICAL BOUNDARY SECTION */}
        <div className="lush-card" style={{ display: "flex", flexDirection: "column", gap: "16px", border: "3px solid var(--lush-red)", boxShadow: "6px 6px 0 var(--lush-red)", background: "#fffefe", marginTop: "16px" }}>
          <h3 style={{ fontSize: "1.3rem", color: "var(--lush-red)", display: "flex", alignItems: "center", gap: "10px", margin: 0 }}>
            <span>🛑</span> Ranh Giới Tư Vấn & Ngưỡng Chuyển Tuyến Y Khoa Da Liễu
          </h3>
          <p style={{ fontSize: "0.95rem", lineHeight: "1.6", color: "#222", margin: 0 }}>
            Đối với hoạt động soi da đầu tại workshop LUSH, nhân viên tư vấn bắt buộc phải tuân thủ nghiêm ngặt ranh giới y khoa để bảo vệ sức khỏe khách hàng cũng như uy tín thương hiệu LUSH Việt Nam.
          </p>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginTop: "8px" }} className="grid-split">
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <strong style={{ color: "#c0392b", fontSize: "0.9rem", textTransform: "uppercase" }}>⚠️ Các Dấu Hiệu Viêm Nặng (Ngưỡng Chuyển Tuyến):</strong>
              <ul style={{ fontSize: "0.85rem", paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px", color: "#333" }}>
                <li><strong>Nhiễm trùng nang tóc:</strong> Có các nốt mụn mủ đầu trắng sưng to, lan rộng nhiều vùng da đầu.</li>
                <li><strong>Viêm da tiết bã nặng / Vẩy nến:</strong> Các mảng vảy sừng dày cộp màu xám đục bong tróc chảy máu khi gãi, kèm rỉ dịch vàng.</li>
                <li><strong>Nấm da đầu ăn sâu:</strong> Da đầu bị loang lổ mất tóc, tróc vảy mủ, ngứa ngáy điên cuồng kèm mùi hôi đặc trưng.</li>
                <li><strong>Rụng tóc bệnh lý:</strong> Tóc rụng thành từng mảng loang tròn hoàn toàn nhẵn bóng (Alopecia areata) hoặc rụng kèm sẹo da đầu.</li>
              </ul>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", background: "#fbfcfc", padding: "16px", border: "1px solid var(--lush-gray-medium)" }}>
              <strong style={{ color: "var(--lush-black)", fontSize: "0.9rem", textTransform: "uppercase" }}>📋 Hướng Dẫn Talk Track Khuyên Khách Khám Da Liễu:</strong>
              <p style={{ fontSize: "0.85rem", fontStyle: "italic", color: "#444", lineHeight: "1.5", margin: 0 }}>
                "Dạ chị ơi, qua hình ảnh soi da đầu vùng sau gáy/đỉnh đầu của chị, em thấy đang xuất hiện các vùng viêm sưng và có dấu hiệu rỉ mụn nước/nấm loang lổ. Đây là tình trạng biểu bì bị tổn thương sâu và có khả năng là dấu hiệu viêm da lý do bệnh lý. Vì LUSH là mỹ phẩm thảo mộc tự nhiên chỉ hỗ trợ chăm sóc da lành mạnh, để đảm bảo an toàn tuyệt đối cho sức khỏe của chị, em khuyên chân thành chị nên đến gặp trực tiếp bác sĩ da liễu khám để nhận chỉ định điều trị y khoa phù hợp nhất chị nhé!"
              </p>
              <div style={{ fontSize: "0.8rem", color: "#c0392b", fontWeight: "700", marginTop: "4px" }}>
                🚫 Tuyệt đối KHÔNG tự chẩn đoán tên bệnh y khoa (VD: 'Chị bị nấm Malassezia rồi', 'Đây là chàm khô da đầu') và KHÔNG cam kết dùng sản phẩm LUSH sẽ khỏi bệnh y khoa!
              </div>
            </div>
          </div>
        </div>

        {/* Row 3: Restoration & Herbs */}
        <div className="grid-split">
          
          {/* LUSH 3 Pillars of Restoration */}
          <div className="lush-card" style={{ display: "flex", flexDirection: "column", gap: "16px", height: "100%" }}>
            <h3 style={{ fontSize: "1.2rem", borderBottom: "2px solid #000", paddingBottom: "10px", display: "flex", alignItems: "center", gap: "8px" }}>
              <span>🛡️</span> Ba Trụ Cột Phục Hồi Tận Gốc LUSH
            </h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "14px", fontSize: "0.85rem" }}>
              <div>
                <strong style={{ color: "var(--lush-green)", textTransform: "uppercase", fontSize: "0.8rem", display: "block", marginBottom: "2px" }}>
                  1. PROTEIN - Phục Hồi Cấu Trúc
                </strong>
                Sử dụng lúa mì thủy phân hoặc Aquafaba để lấp đầy các hư tổn trên biểu bì tóc uốn, uốn/tẩy/nhuộm.
                <div style={{ marginTop: "4px" }}>
                  <span className="lush-tag green" style={{ fontSize: "0.7rem", padding: "1px 5px" }}>Sản phẩm tiêu biểu: POWER</span>
                </div>
              </div>

              <div style={{ borderTop: "1px dashed var(--lush-gray-medium)", paddingTop: "10px" }}>
                <strong style={{ color: "var(--lush-gold)", textTransform: "uppercase", fontSize: "0.8rem", display: "block", marginBottom: "2px" }}>
                  2. MOISTURE - Cấp Ẩm & Làm Mềm
                </strong>
                Sử dụng các loại bơ thực vật và dầu thực vật tự nhiên (hạnh nhân, bơ quả bơ) thẩm thấu vào thân tóc giúp tóc mềm mượt, đàn hồi và bóng khỏe.
                <div style={{ marginTop: "4px" }}>
                  <span className="lush-tag gold" style={{ fontSize: "0.7rem", padding: "1px 5px" }}>Sản phẩm tiêu biểu: BALANCE</span>
                </div>
              </div>

              <div style={{ borderTop: "1px dashed var(--lush-gray-medium)", paddingTop: "10px" }}>
                <strong style={{ color: "#333", textTransform: "uppercase", fontSize: "0.8rem", display: "block", marginBottom: "2px" }}>
                  3. CONDITION - Làm Mượt Biểu Bì
                </strong>
                Sử dụng các hoạt chất chống tĩnh điện tự nhiên giúp khép chặt vảy biểu bì tóc, ngăn ngừa xơ rối tức thì.
                <div style={{ marginTop: "4px" }}>
                  <span className="lush-tag dark" style={{ fontSize: "0.7rem", padding: "1px 5px" }}>Sản phẩm tiêu biểu: HAPPY HAPPY JOY JOY</span>
                </div>
              </div>
            </div>
          </div>

          {/* Core Herbal Ingredients */}
          <div className="lush-card" style={{ display: "flex", flexDirection: "column", gap: "16px", height: "100%" }}>
            <h3 style={{ fontSize: "1.2rem", borderBottom: "2px solid #000", paddingBottom: "10px", display: "flex", alignItems: "center", gap: "8px" }}>
              <span>🌿</span> Thành Phần Thảo Mộc Cốt Lõi & Lợi Ích
            </h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "14px", fontSize: "0.85rem" }}>
              <div>
                <strong style={{ color: "var(--lush-red)", textTransform: "uppercase", fontSize: "0.8rem", display: "block", marginBottom: "2px" }}>
                  🍂 Thanh Quế (Cinnamon)
                </strong>
                Kích thích các mạch máu tuần hoàn dưới da đầu, kích hoạt nang tóc hoạt động mạnh mẽ để thúc đẩy mọc tóc nhanh và khỏe mạnh.
                <div style={{ marginTop: "4px" }}>
                  <span className="lush-tag dark" style={{ fontSize: "0.7rem", padding: "1px 5px", background: "var(--lush-red)", borderColor: "var(--lush-red)" }}>Bánh gội mọc tóc: NEW SHAMPOO BAR</span>
                </div>
              </div>

              <div style={{ borderTop: "1px dashed var(--lush-gray-medium)", paddingTop: "10px" }}>
                <strong style={{ color: "var(--lush-green)", textTransform: "uppercase", fontSize: "0.8rem", display: "block", marginBottom: "2px" }}>
                  🍃 Bạc Hà Tươi (Peppermint)
                </strong>
                Sát trùng tự nhiên, làm sạch gàu nấm và bã nhờn, đem lại cảm giác mát lạnh sảng khoái và ngăn ngừa rụng chân tóc rõ rệt.
                <div style={{ marginTop: "4px" }}>
                  <span className="lush-tag green" style={{ fontSize: "0.7rem", padding: "1px 5px" }}>Mặt nạ da đầu: ROOTS</span>
                </div>
              </div>

              <div style={{ borderTop: "1px dashed var(--lush-gray-medium)", paddingTop: "10px" }}>
                <strong style={{ color: "var(--lush-gold)", textTransform: "uppercase", fontSize: "0.8rem", display: "block", marginBottom: "2px" }}>
                  🌸 Hoa Oải Hương (Lavender)
                </strong>
                Làm dịu và cân bằng lượng dầu tự nhiên vùng da đầu đỏ nhạy cảm, viêm ngứa, mang lại cảm giác thư thái dễ chịu.
                <div style={{ marginTop: "4px" }}>
                  <span className="lush-tag gold" style={{ fontSize: "0.7rem", padding: "1px 5px" }}>Dầu xả làm dịu: VEGANESE</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
