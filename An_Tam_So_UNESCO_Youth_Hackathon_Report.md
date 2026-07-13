**AN TÂM SỐ**

**SilverTrust MIL Companion**

*Trợ lý AI nâng cao Năng lực Thông tin & Truyền thông cho người cao tuổi Việt Nam*

Báo cáo xác định vấn đề & định hướng MVP theo framework Problem Identification

**UNESCO Youth Hackathon 2026 | Play Your Part: Youth Designing the Future of MIL**

Team: Beyond Limits | Version: July 7, 2026

| Executive answer Nên chuyển hoàn toàn sang hướng người cao tuổi, nhưng phải thu hẹp MVP vào “decision moment”: khi người cao tuổi nhận một tin nhắn, hình ảnh, đường link, voice note hoặc bài đăng đáng nghi và cần quyết định có nên tin, chia sẻ, bấm link hay chuyển tiền hay không.  Giải pháp đề xuất không phải một “fake news detector” chung chung. Nó là một AI MIL Companion: giải thích dấu hiệu rủi ro, dạy một bài học MIL nhỏ ngay sau tình huống thật, và cho phép người dùng chủ động hỏi Trusted Circle trước khi ra quyết định. |
| :---- |

# **Mục lục**

1\. Kết luận chiến lược

2\. Bối cảnh cuộc thi UNESCO Youth Hackathon 2026

3\. Problem Identification Framework theo ảnh đính kèm

4\. Evidence base: dữ liệu cập nhật đến 07/2026

5\. Causal chain logic và issue tree

6\. Problem statement đã chọn

7\. Lý do chọn hướng người cao tuổi

8\. Giải pháp: An Tâm Số / SilverTrust MIL

9\. MVP scope, kiến trúc kỹ thuật và demo flow

10\. Fit với tiêu chí chấm của UNESCO

11\. Kế hoạch triển khai, đo lường và bền vững

12\. Rủi ro, đạo đức và giới hạn

13\. Phân công team

14\. Tài liệu tham khảo APA 7th

# **1\. Kết luận chiến lược**

| Problem statement nên dùng trong proposal Người cao tuổi Việt Nam đang phải ra quyết định trong một môi trường số nơi tin giả, lừa đảo trực tuyến, nội dung do AI tạo ra và giả mạo người/cơ quan đáng tin cậy xuất hiện dưới dạng tin nhắn, hình ảnh, đường link, voice note và bài đăng mạng xã hội. Tuy nhiên, nhiều giải pháp hiện tại hoặc quá kỹ thuật, hoặc quá tập trung vào giới trẻ, hoặc chỉ cung cấp cảnh báo rời rạc, chưa hỗ trợ đúng “khoảnh khắc ra quyết định” của người cao tuổi: có nên tin, chia sẻ, bấm link, gọi lại, cung cấp thông tin hay chuyển tiền hay không. Hệ quả là họ dễ chịu thiệt hại tài chính, sức khỏe tinh thần, sự tự chủ và niềm tin vào môi trường số. |
| :---- |

**Chiến lược chọn vấn đề:** Không đi theo hướng phát hiện deepfake/fake news thuần kỹ thuật, vì hướng đó dễ bị so sánh với các detector lớn, khó chứng minh độ chính xác trong thời gian hackathon, và có rủi ro sai số cao. Thay vào đó, chọn hướng “AI-assisted MIL decision support for older adults”: dùng AI để làm chậm phản ứng, giải thích red flags, hướng dẫn kiểm chứng, tạo micro-learning và kết nối người thân/cộng đồng khi cần.

* **Target user:** Người cao tuổi 55/60+ tại Việt Nam có dùng smartphone, Zalo/Facebook/YouTube, nhưng chưa có kỹ năng kiểm chứng thông tin ổn định.  
* **Decision moment:** Khi họ nhận thông tin đáng nghi và cần quyết định ngay.  
* **MVP wedge:** Ảnh chụp màn hình/tin nhắn/link/voice note về lừa đảo, tin giả sức khỏe, giả mạo cơ quan chức năng hoặc lời mời đầu tư/ưu đãi bất thường.  
* **Core promise:** “Không thay ông/bà quyết định; giúp ông/bà hiểu, kiểm chứng và quyết định an toàn hơn.”

# **2\. Bối cảnh cuộc thi UNESCO Youth Hackathon 2026**

**UNESCO Youth Hackathon 2026** có chủ đề “Play Your Part: Youth Designing the Future of Media and Information Literacy (MIL)”. Tính đến bản cập nhật 5/7/2026, cuộc thi cho phép đội 2–6 thành viên, độ tuổi 18–30, đề xuất các giải pháp như ứng dụng/web, toolkit giáo dục, campaign hoặc intervention cộng đồng. Các track phù hợp nhất cho ý tưởng này là AI and MIL, MIL Education, Community Impact và Youth Engagement (UNESCO, 2026).

| Tiêu chí UNESCO | Cách An Tâm Số đáp ứng |
| ----- | ----- |
| Consistency with Theme | Tập trung trực tiếp vào MIL: truy cập, đánh giá, kiểm chứng, sử dụng và chia sẻ thông tin an toàn trong môi trường AI. |
| Innovation & Creativity | Kết hợp AI companion \+ micro-learning theo tình huống thật \+ trusted family/community layer, thay vì detector một chiều. |
| Feasibility & Sustainability | MVP có thể demo bằng web app/chat interface, dữ liệu cảnh báo công khai, kịch bản mẫu và quy trình kiểm chứng. Mở rộng bằng hợp tác Hội Người cao tuổi, thư viện, trường đại học, đoàn thanh niên. |
| Impact & Inclusion | Tập trung nhóm người cao tuổi, một nhóm có nguy cơ bị loại trừ số và chịu tác động tài chính/tâm lý cao từ lừa đảo và tin giả. |
| Clarity of Presentation | Có story rõ: người cao tuổi nhận tin đáng nghi → AI phân tích → học mini lesson → hỏi người thân → ra quyết định an toàn. |

# **3\. Problem Identification Framework theo ảnh đính kèm**

Ảnh framework trong workshop cho thấy một luồng tư duy tương tự Double Diamond: từ vấn đề tổng quát → thu thập thông tin → tái cấu trúc vấn đề → lên ý tưởng → tạo mẫu giải pháp. Báo cáo này follow đúng logic đó nhưng chuyển thành ngôn ngữ proposal/hackathon.

*Hình 1\. Framework xác định vấn đề được nhóm sử dụng làm khung tư duy.*

| Giai đoạn trong ảnh | Ý nghĩa | Áp dụng cho An Tâm Số |
| ----- | ----- | ----- |
| Mục tiêu | Đặt giả thuyết vấn đề tổng quát | Người cao tuổi cần năng lực MIL để tự chủ hơn trong xã hội số do AI dẫn dắt. |
| Thông tin / Quan sát | Khám phá qua research, phỏng vấn, phân chia nhóm, persona, journey map | Thu thập dữ liệu về scam, misinformation, kỹ năng số, hành vi tin tưởng gia đình, lớp học offline. |
| Vấn đề | Tái cấu trúc insight thành problem statement hẹp, có thể giải quyết | Không giải quyết “mọi fake news”; tập trung vào khoảnh khắc quyết định khi gặp thông tin đáng nghi. |
| Ý tưởng | Lên ý tưởng, đánh giá, chọn hướng | So sánh detector, lớp học offline, alert center, family surveillance, AI companion. Chọn AI companion \+ micro-learning \+ trusted circle. |
| Giải pháp / Tạo mẫu | Xây dựng thử nghiệm, đánh giá, cải tiến | MVP web/chat app: nhận screenshot/link/voice → phân tích red flags → lesson → share Trusted Circle → alert/resources. |

## **3.1 Mục tiêu và giả thuyết ban đầu**

* **Mục tiêu xã hội:** Giúp người cao tuổi Việt Nam an toàn, tự tin, độc lập hơn khi tiếp nhận thông tin số trong bối cảnh AI tạo sinh.  
* **Mục tiêu MIL:** Tăng năng lực kiểm chứng nguồn, nhận diện thao túng cảm xúc, phân biệt nội dung đáng tin/nghi ngờ, và biết khi nào cần hỏi người thân/cơ quan chính thống.  
* **Giả thuyết 1:** Vấn đề không nằm hoàn toàn ở “không biết thật/giả”, mà ở việc thiếu một quy trình kiểm chứng đơn giản đúng lúc.  
* **Giả thuyết 2:** Người cao tuổi sẽ dễ chấp nhận giải pháp hơn nếu AI đóng vai trò giải thích và hỗ trợ tự chủ, không phán xét hoặc giám sát.  
* **Giả thuyết 3:** Mạng lưới người thân và hoạt động offline là tài sản văn hóa/xã hội cần tích hợp vào sản phẩm, không nên thay thế bằng AI.

## **3.2 Thông tin / Quan sát: nghiên cứu cần thực hiện**

| Hoạt động nghiên cứu | Câu hỏi cần trả lời | Deliverable cho proposal |
| ----- | ----- | ----- |
| Desk research | Quy mô scam/tin giả; người cao tuổi bị ảnh hưởng thế nào; giải pháp hiện có thiếu gì? | Evidence table, competitor gap, causal chain. |
| 5–8 phỏng vấn nhanh người cao tuổi | Họ gặp tin đáng nghi ở đâu? Họ hỏi ai? Khi nào họ bấm link/chuyển tiền/chia sẻ? | Quotes/insights, journey map. |
| 3–5 phỏng vấn người thân | Con cháu hiện hỗ trợ thế nào? Họ thấy gánh nặng nào? Họ có muốn nhận cảnh báo không? | Trusted Circle requirement. |
| 2–3 trao đổi với cán bộ cộng đồng | Hội người cao tuổi/lớp smartphone/văn hóa địa phương có thể triển khai ra sao? | Community Hub and sustainability plan. |
| Prototype test | Người dùng có hiểu output AI không? Tone có gây khó chịu không? Có biết bước tiếp theo không? | Before/after MIL mini-test and usability notes. |

## **3.3 Personas và journey map**

| Persona | Hành vi hiện tại | Pain point | Nhu cầu thiết kế |
| ----- | ----- | ----- | ----- |
| Cô Mai, 62, dùng Zalo/Facebook mỗi ngày | Nhận tin khuyến mãi, tin sức khỏe, cảnh báo ngân hàng; thường hỏi con khi nghi ngờ. | Sợ làm phiền con; không biết link nào đáng tin; khó đọc tiếng Anh/ký hiệu bảo mật. | Giao diện chữ lớn, giải thích đơn giản, nút “hỏi con/cháu”. |
| Chú Hùng, 68, đã về hưu, có tiền tiết kiệm | Theo dõi nhóm đầu tư, du lịch, sức khỏe; bị hấp dẫn bởi “ưu đãi đặc biệt”. | Dễ bị social proof, urgency, lời hứa lợi nhuận/quà tặng. | AI cần chỉ ra red flags về tài chính, deadline giả, chuyển tiền trước. |
| Bà Lan, 74, sống cùng gia đình | Ít dùng search; tin người quen và các hội nhóm địa phương. | Nếu thông tin đến từ người quen thì ít kiểm chứng; ngại bị nói là “không biết dùng điện thoại”. | Tone không phán xét; bài học nhỏ; cộng đồng offline. |

| Bước hành trình | Cảm xúc / hành vi | Điểm can thiệp MVP |
| ----- | ----- | ----- |
| 1\. Tiếp xúc thông tin | Nhận tin qua Zalo/Facebook/YouTube/voice call: “khẩn cấp”, “quà tặng”, “đầu tư”, “cơ quan chức năng”. | Upload screenshot/link/voice note vào AI Decision Companion. |
| 2\. Tạo niềm tin | Tin vì người gửi quen, logo giống thật, giọng nói giống người thân, hoặc có nhiều bình luận tích cực. | AI chỉ ra trust cues giả: logo, tên miền, nguồn, yêu cầu chuyển tiền, lời hứa cao bất thường. |
| 3\. Áp lực ra quyết định | Bị thúc giục bấm link, nhập OTP, chuyển khoản, chia sẻ bài, gọi lại số lạ. | AI đưa “pause protocol”: Dừng – Kiểm chứng – Xác nhận với nguồn độc lập. |
| 4\. Hỏi người khác | Có thể hỏi con/cháu nhưng ngại làm phiền hoặc không biết giải thích tình huống. | Trusted Circle tạo bản tóm tắt ngắn gửi người thân do người dùng chủ động bấm. |
| 5\. Học sau tình huống | Nếu chỉ nhận cảnh báo, bài học dễ bị quên. | Micro MIL Learning: bài học 60 giây dựa trên tình huống vừa gặp. |

# **4\. Evidence base: dữ liệu cập nhật đến 07/2026**

## **4.1 Dữ liệu tài chính và xã hội**

| Nguồn | Số liệu / phát hiện | Ý nghĩa với proposal |
| ----- | ----- | ----- |
| FTC, 2025 | Người tiêu dùng Mỹ báo cáo mất hơn 12.5 tỷ USD vì fraud năm 2024, tăng 25%; investment scams gây thiệt hại 5.7 tỷ USD; bank transfer và crypto là các kênh thanh toán thiệt hại lớn. | Scam không phải vấn đề nhận thức nhỏ; nó là rủi ro tài chính lớn và đang hiệu quả hơn. |
| FBI IC3, 2025 | Nhóm 60+ tại Mỹ nộp 147,127 complaint trong 2024, thiệt hại 4.885 tỷ USD; investment loss ở nhóm 60+ là 1.834 tỷ USD; tech support scam 982 triệu USD; crypto-related loss nhóm over 60 là 2.839 tỷ USD. | Người cao tuổi chịu thiệt hại đặc biệt lớn; cần thiết kế cho nhóm này, không chỉ cho thanh niên. |
| VietNamNet / Bộ Công an, 04/07/2026 | Vụ holiday contract fraud đang được điều tra tại Hà Nội và TP.HCM có khoảng 2,500 tố giác, 525 nghi phạm, thiệt hại sơ bộ 2.6 nghìn tỷ VND; nhắm tới người có tài chính, gồm trung niên và người cao tuổi; tactics gồm quà tặng, lợi nhuận cao, khẩn cấp, trả tiền trước. | Có bằng chứng rất mới tại Việt Nam về scam nhắm vào trung niên/người cao tuổi và sử dụng thao túng tâm lý. |
| World Bank WDI, 2026 | Dữ liệu WDI cung cấp chỉ báo dân số 65+ của Việt Nam, nguồn từ UN Population Division, cập nhật đến 2025\. | Dân số già hóa làm quy mô nhóm đích tăng; nhu cầu inclusive digital ageing là dài hạn. |

**Cách dùng số liệu trong proposal:** Không nên nói “giải pháp sẽ giảm X tỷ VND” như một cam kết. Nên dùng impact scenario: nếu pilot 3,000 người cao tuổi giúp 1–3% người dùng tránh một hành vi rủi ro có giá trị 500,000–5,000,000 VND, giá trị thiệt hại tránh được có thể nằm trong khoảng 15–450 triệu VND. Đây là ước tính kịch bản để minh họa impact, không phải kết quả đã đo lường.

## **4.2 Evidence về hành vi người cao tuổi và thiết kế chatbot**

| Nguồn nghiên cứu | Phát hiện chính | Hàm ý thiết kế |
| ----- | ----- | ----- |
| Baines, Hargittai, & Palfrey, 2025 | Khảo sát 2,000 người 60+ cho thấy nhiều người cao tuổi có chiến lược kiểm chứng như đọc bình luận, kiểm tra nguồn; người dùng internet ít và kỹ năng social media thấp ít dùng chiến lược này hơn. | Không giả định người cao tuổi “không biết gì”. Thiết kế phải nâng năng lực hiện có, không phán xét. |
| Peng, Lee, & Lim, 2024 | Participatory design với người cao tuổi chỉ ra chatbot cần vượt khỏi fact-checking; vấn đề misinformation liên quan đến quan hệ giữa người với người, tự chủ và niềm tin vào nguồn. Người cao tuổi muốn công cụ dạy họ tự kết luận, không thay họ quyết định. | MVP cần giải thích “vì sao nghi ngờ”, dạy quy trình kiểm chứng và có Trusted Circle, thay vì chỉ gắn nhãn đúng/sai. |
| LaRubbio et al., 2025 | Nghiên cứu deepfake scams cho thấy người cao tuổi thường dựa vào quan hệ tin cậy, và youth có thể là đối tác hỗ trợ an toàn số liên thế hệ. | Trusted Circle là lợi thế lớn của ý tưởng, đồng thời rất hợp track Youth Engagement của UNESCO. |
| UNESCO, 2026 | Hackathon ưu tiên AI and MIL, MIL Education, Community Impact, Youth Engagement, impact & inclusion. | Giải pháp cho người cao tuổi có fit mạnh với inclusion, community impact và youth-as-MIL-change-agents. |

# **5\. Causal chain logic và issue tree**

| Causal chain Già hóa dân số \+ adoption smartphone/mạng xã hội tăng → người cao tuổi tiếp xúc nhiều hơn với thông tin từ Zalo/Facebook/YouTube/link lạ → AI tạo sinh làm nội dung giả, giọng nói giả, ảnh/video giả và tin nhắn lừa đảo rẻ hơn, cá nhân hóa hơn → scammer dùng urgency, authority, quà tặng, lợi nhuận cao, sợ hãi và quan hệ quen biết để tạo áp lực → người cao tuổi thiếu một quy trình kiểm chứng đơn giản đúng lúc và không muốn mất tự chủ → quyết định rủi ro: bấm link, nhập thông tin, chia sẻ tin giả, chuyển tiền → thiệt hại tài chính, stress, mất niềm tin, phụ thuộc vào gia đình và lan truyền sai lệch trong cộng đồng. |
| :---- |

| Root cause | Observable symptom | Why existing solutions miss it | Design response |
| ----- | ----- | ----- | ----- |
| MIL/digital skills gap | Không biết kiểm tra nguồn, tên miền, bằng chứng, deepfake cues; khó phân biệt quảng cáo/tin thật. | Nhiều chương trình MIL nhắm học sinh/sinh viên; tài liệu dài; ít cá nhân hóa. | Micro MIL Learning sau tình huống thật; ngôn ngữ dễ hiểu; lesson 60–90 giây. |
| Trust gap | Tin người quen, bác sĩ giả, công an giả, logo giả, giọng nói giống người thân. | Detector kỹ thuật không xử lý được niềm tin xã hội và tâm lý. | Trusted Circle \+ verify with official source \+ safe word/check question templates. |
| Decision pressure | Bị thúc giục “làm ngay”, “hết hạn”, “chuyển trước”, “bí mật”. | Fact-check sau khi sự việc xảy ra là quá muộn. | AI Decision Companion can thiệp trước hành động: Dừng – Kiểm chứng – Xác nhận. |
| AI-amplified content | Ảnh/voice/video/text ngày càng giống thật; người dùng không có năng lực forensic. | Deepfake detector khó chính xác, khó demo, có false positive/negative. | Tập trung vào decision-layer defense: red flags, nguồn độc lập, xác nhận qua trusted channel. |
| Intervention gap | Có alert center và lớp offline, nhưng không hỗ trợ 24/7 trong tình huống thật. | Offline thiếu scale; alert rời rạc; app kỹ thuật khó dùng. | AI companion 24/7 \+ community hub offline \+ alert center cá nhân hóa. |

## **5.1 McKinsey-style issue tree**

| Question | Sub-question | Answer for An Tâm Số |
| ----- | ----- | ----- |
| Where is the highest-impact problem? | Nhóm nào chịu tổn thất và bị bỏ quên? | Người cao tuổi: thiệt hại tài chính lớn, thiếu chương trình MIL phù hợp, dễ bị target bằng authority/urgency/health/finance scams. |
|  | Khoảnh khắc nào có thể can thiệp? | Trước khi tin/chia sẻ/bấm link/chuyển tiền. Đây là “moment of decision”, không phải sau khi bị lừa. |
| What solution creates differentiated value? | Detector, lớp học, alert hay companion? | Companion thắng vì kết hợp hỗ trợ tức thời \+ học từng tình huống \+ người thân/cộng đồng. |
|  | Tại sao AI là bắt buộc nhưng không lạm dụng AI? | AI xử lý đa dạng input và cá nhân hóa giải thích; nhưng quyết định cuối thuộc người dùng, có nguồn và Trusted Circle. |
| Why can this team build it? | Team có gì hơn đội khác? | Có AI/software, product, business, marketing, finance/quant; phù hợp cả technical prototype và impact/business case. |

# **6\. Problem statement đã chọn**

| Final problem statement \- English proposal version Older adults in Vietnam are increasingly exposed to misinformation, online scams, and AI-generated deceptive content through social media and messaging apps. Existing media and information literacy interventions are often designed for youth, while existing scam tools are either technical, fragmented, or reactive. As a result, older adults lack simple, trusted, and context-aware support at the exact moment they need to decide whether to trust, share, click, call back, provide information, or transfer money. This creates preventable financial loss, emotional distress, reduced digital autonomy, and further spread of misinformation within families and communities. |
| :---- |

| Final problem statement \- Vietnamese version Người cao tuổi Việt Nam ngày càng tiếp xúc với tin giả, lừa đảo trực tuyến và nội dung đánh lừa do AI tạo ra qua mạng xã hội và ứng dụng nhắn tin. Trong khi đó, phần lớn chương trình MIL hiện nay tập trung vào người trẻ, còn các công cụ chống lừa đảo hiện có thường thiên về kỹ thuật, rời rạc hoặc chỉ phản ứng sau khi rủi ro đã xuất hiện. Vì vậy, người cao tuổi thiếu một cơ chế hỗ trợ đơn giản, đáng tin cậy và phù hợp ngữ cảnh ngay tại khoảnh khắc họ cần quyết định: có nên tin, chia sẻ, bấm link, gọi lại, cung cấp thông tin hay chuyển tiền hay không. Điều này gây ra thiệt hại tài chính, căng thẳng tâm lý, giảm sự tự chủ số và làm tin sai lệch tiếp tục lan truyền trong gia đình/cộng đồng. |
| :---- |

## **6.1 Scope boundaries để tránh quá rộng**

| Trong scope MVP | Ngoài scope MVP |
| ----- | ----- |
| Tin nhắn, screenshot, link, voice note hoặc bài đăng đáng nghi. | Forensic deepfake detection có độ chính xác pháp lý. |
| Các tình huống có rủi ro hành động: bấm link, chia sẻ, nhập thông tin, gọi lại, chuyển tiền. | Xác minh mọi tin tức chính trị/xã hội theo thời gian thực ở quy mô toàn quốc. |
| Ba nhóm nội dung demo: giả mạo cơ quan/ngân hàng; scam đầu tư/quà tặng/du lịch/sức khỏe; health misinformation phổ biến. | Tư vấn y tế, pháp lý hoặc tài chính chuyên sâu. |
| Giải thích red flags, hướng dẫn kiểm chứng, micro lesson, Trusted Circle. | Giám sát điện thoại người cao tuổi hoặc gửi dữ liệu cho người thân khi chưa được đồng ý. |

# **7\. Lý do chọn hướng người cao tuổi**

* **Impact & Inclusion mạnh hơn:** UNESCO chấm impact và inclusion. Người cao tuổi là nhóm dễ bị bỏ qua trong thiết kế MIL, trong khi tổn thất tài chính/tâm lý có thể nghiêm trọng.  
* **Không cạnh tranh trực diện với detector lớn:** Fake news/deepfake detector thuần kỹ thuật cần dataset lớn, benchmark và độ chính xác cao. Companion tập trung vào hành vi quyết định và giáo dục, phù hợp hackathon hơn.  
* **Tận dụng bản sắc Việt Nam:** Người cao tuổi thường tin vào gia đình, người quen, hội nhóm địa phương và hoạt động offline. Trusted Circle \+ Community Hub khai thác đúng mạng lưới xã hội này.  
* **Tận dụng năng lực team:** Cường phụ trách AI/software; Trúc/Duy Anh phụ trách product/strategy; Thịnh phụ trách BMC/financial/marketing; Thanh hỗ trợ dữ liệu, risk scoring, financial impact và logic định lượng.  
* **Có story pitch tốt:** Một người lớn tuổi nhận tin giả/lừa đảo; AI không phán xét mà giải thích; người dùng học một bài nhỏ; nếu chưa chắc thì hỏi người thân; sau đó tham gia lớp cộng đồng. Story dễ hiểu, giàu cảm xúc, có tác động xã hội.

| Alternative | Strength | Weakness | Decision |
| ----- | ----- | ----- | ----- |
| General fake news detector | Rõ kỹ thuật, dễ demo binary output. | Quá rộng; khó đạt accuracy; ít khác biệt; thiếu community angle. | Không chọn làm core. |
| Deepfake detector | AI factor mạnh. | Cần model/dataset; false negative nguy hiểm; không giải quyết scam text/link/voice. | Chỉ dùng như risk signal, không làm sản phẩm chính. |
| Offline MIL classes only | Phù hợp người cao tuổi, tin cậy. | Không 24/7, khó scale, không hỗ trợ lúc gặp tin thật. | Dùng như Community Hub, không làm core. |
| Scam Alert Center only | Dễ làm, cập nhật nhanh. | Passive; người dùng phải tự tìm; không cá nhân hóa. | Làm module phụ. |
| AI MIL Companion \+ Trusted Circle | Can thiệp đúng moment of decision, dạy kỹ năng, tận dụng family/community, có AI và inclusion. | Cần thiết kế kỹ để tránh over-trust AI. | Chọn làm core MVP. |

# **8\. Giải pháp: An Tâm Số / SilverTrust MIL**

**Product concept:** An Tâm Số là một AI-powered Media & Information Literacy Companion dành cho người cao tuổi. Ứng dụng không chỉ trả lời “đúng/sai”, mà tạo một quy trình ra quyết định an toàn: phân tích dấu hiệu rủi ro, giải thích bằng ngôn ngữ đơn giản, đưa bước kiểm chứng, tạo bài học MIL nhỏ và cho phép người dùng chủ động hỏi người thân/cộng đồng khi cần.

## **8.1 Value proposition**

| One-sentence value proposition An Tâm Số giúp người cao tuổi dừng lại, hiểu rủi ro, kiểm chứng nguồn và hỏi người tin cậy trước khi tin, chia sẻ, bấm link hoặc chuyển tiền trong môi trường số do AI dẫn dắt. |
| :---- |

| Module | Mục tiêu | MVP version |
| ----- | ----- | ----- |
| AI Decision Companion | Nhận văn bản, ảnh, link, voice note; phát hiện red flags; giải thích “vì sao đáng nghi”; đề xuất bước kiểm chứng. | Chat/web app nhận text \+ screenshot \+ link; voice có thể demo bằng transcript hoặc speech-to-text đơn giản. |
| Micro MIL Learning | Biến mỗi tình huống thành bài học nhỏ để tăng năng lực dài hạn. | Sau mỗi phân tích, sinh 1 lesson card: “3 dấu hiệu cần nhớ”, quiz 1 câu. |
| Trusted Circle | Cho người dùng chủ động hỏi người thân/bác sĩ/tình nguyện viên khi rủi ro cao. | Nút “Gửi tóm tắt cho người thân” tạo message share qua Zalo/Messenger hoặc copy link. |
| Community Hub | Kết nối lớp/hội thảo offline, Hội Người cao tuổi, đoàn thanh niên, thư viện, địa phương. | Trang static/mock calendar với 3 sự kiện mẫu \+ partner concept. |
| Scam Alert Center | Cập nhật thủ đoạn lừa đảo/tin giả mới và checklist phòng tránh. | Feed curated thủ công từ cảnh báo công khai; phân loại theo scam, deepfake, health misinformation, fake authority. |

## **8.2 Design principles**

* **Autonomy-first:** AI không ra lệnh, không thay người cao tuổi quyết định; nó cung cấp lý do, câu hỏi kiểm chứng và lựa chọn tiếp theo.  
* **Plain Vietnamese:** Không dùng thuật ngữ kỹ thuật như “phishing URL entropy” trong output; dùng “đường link này có tên miền lạ, không phải trang chính thức”.  
* **Calm-by-design:** Output tránh gây hoảng loạn; luôn có bước “Dừng lại 2 phút – Không chuyển tiền ngay – Xác nhận qua kênh độc lập”.  
* **Trusted-source transparency:** Mỗi kết luận nên có nguồn hoặc lý do rõ; nếu AI không chắc, phải nói không chắc.  
* **Intergenerational support:** Người thân là lớp hỗ trợ, không phải công cụ giám sát. Mọi chia sẻ do người cao tuổi chủ động kích hoạt.  
* **Offline-compatible:** Sản phẩm phải có đường ra offline: lớp học, hotline/cơ quan, Hội Người cao tuổi, tình nguyện viên. Có như vậy mới phù hợp Việt Nam.

# **9\. MVP scope, kiến trúc kỹ thuật và demo flow**

## **9.1 MVP phải tập trung vào 3 core modules**

| Priority | Feature | Must-have trong demo | Không làm ở MVP |
| ----- | ----- | ----- | ----- |
| P0 | AI Decision Companion | Upload/paste screenshot hoặc text/link; output risk level \+ red flags \+ verification steps. | Real-time video/deepfake forensic model. |
| P0 | Micro MIL Learning | Tạo lesson card ngắn sau phân tích; có 1 quiz/checklist. | Learning management system đầy đủ. |
| P0 | Trusted Circle | Tạo bản tóm tắt ngắn để gửi người thân qua copy/share \--\> Telegram | Tích hợp Zalo official API thật nếu chưa có quyền. |
| P1 | Scam Alert Center | Trang cảnh báo với 5–10 case mẫu có nguồn. \--\> học đủ số case \--\> đỡ strict\--\> DN liên hệ với  bên mình để lấy cert chứng nhận đã qua kiểm duyệt scam | Realtime news crawling phức tạp. |
| P1 | Community Hub | Mock calendar/partner map để trình bày sustainability. | Hệ thống quản lý sự kiện hoàn chỉnh. |

## **9.2 Technical architecture MVP**

| Layer | Components | Implementation suggestion |
| ----- | ----- | ----- |
| Input layer | Text paste, screenshot upload, URL input, optional voice transcript. | React/Next.js or Streamlit prototype; large buttons, high contrast, Vietnamese text. |
| Pre-processing | OCR for screenshot, URL parser, transcript normalization. | Tesseract/EasyOCR for hackathon; simple regex for URLs/phone/account numbers. |
| Risk reasoning | Rule-based red flags \+ LLM explanation \+ RAG from trusted sources. | Hybrid scoring: urgency, payment request, authority impersonation, mismatched domain, too-good-to-be-true, request OTP/personal data. |
| Evidence layer | Curated alerts and trusted sources. | Static JSON/CSV for demo: official warnings, VietNamNet case, FTC/FBI patterns, local scam patterns. |
| Output layer | Risk level, reasons, what to do next, lesson card, Trusted Circle summary. | Output format: “An toàn / Cần cẩn trọng / Rủi ro cao / Chưa đủ dữ liệu”. Avoid absolute true/false. |
| Privacy & safety | Consent before sharing; no sensitive data retention by default. | Ephemeral session; redact phone/ID/account numbers in summaries; explicit user confirmation before sending. |
| Analytics | Usage, lesson completion, safe decision feedback. | Pilot dashboard for team/jury: number of analyzed cases, top risk types, learning completion. |

## **9.3 Risk scoring logic cho MVP**

| Signal | Example | Weight in MVP | User-facing explanation |
| ----- | ----- | ----- | ----- |
| Urgency / time pressure | “Chỉ còn 10 phút”, “làm ngay”, “bí mật”. | High | Tin nhắn đang ép cô/chú quyết định nhanh. Lừa đảo thường dùng áp lực thời gian. |
| Upfront payment / transfer | Yêu cầu chuyển tiền trước, đặt cọc, phí xử lý, phí nhận quà. | High | Yêu cầu chuyển tiền trước khi có xác minh là dấu hiệu rủi ro cao. |
| Authority impersonation | Tự xưng công an, ngân hàng, bệnh viện, cơ quan nhà nước. | High | Cơ quan chính thức thường không yêu cầu OTP/mật khẩu/chuyển tiền qua tin nhắn lạ. |
| Suspicious URL/domain | Tên miền lạ, rút gọn link, không phải domain chính thức. | Medium/High | Đường link không giống trang chính thức; cần mở qua app/website chính thống thay vì bấm link trong tin nhắn. |
| Too-good-to-be-true | Lợi nhuận cao, quà tặng lớn, ưu đãi đặc biệt, việc nhẹ lương cao. | Medium/High | Lời hứa lợi ích quá hấp dẫn là trigger thường gặp trong scam. |
| Personal data request | OTP, CCCD, ảnh mặt, tài khoản ngân hàng. | High | Không cung cấp mã OTP/thông tin định danh cho người lạ hoặc link lạ. |
| Social proof manipulation | Nhiều bình luận khen, ảnh chuyển khoản, testimonial. | Medium | Bình luận và ảnh lợi nhuận có thể bị tạo giả hoặc dàn dựng. |

## **9.4 Demo flow nên dùng trong pitch video 3 phút**

1. Bà Lan nhận một tin Zalo giả mạo ngân hàng/cơ quan chức năng: “Tài khoản/VNeID của cô sắp bị khóa, bấm link xác minh trong 10 phút.”  
2. Bà chụp màn hình và gửi vào An Tâm Số.  
3. AI trả lời bằng tiếng Việt đơn giản: “Rủi ro cao. Có 4 dấu hiệu: link lạ, tạo áp lực thời gian, yêu cầu thông tin cá nhân, giả mạo cơ quan.”  
4. AI đưa bước hành động: “Không bấm link. Mở app chính thức hoặc gọi số hotline trên website chính thức. Nếu chưa chắc, hỏi người thân.”  
5. Bà bấm “Hỏi con/cháu”. Ứng dụng tạo bản tóm tắt đã ẩn bớt thông tin nhạy cảm để gửi qua Zalo/Messenger.  
6. Sau đó AI tạo một micro lesson: “3 dấu hiệu lừa đảo giả mạo cơ quan nhà nước”, kèm quiz 1 câu.  
7. Scam Alert Center hiển thị các vụ tương tự và Community Hub đề xuất lớp học MIL ở phường/thư viện/hội người cao tuổi.

## **9.5 Dữ liệu và nguồn có thể dùng**

| Use case | Candidate data/source | Notes |
| ----- | ----- | ----- |
| Scam patterns | Cảnh báo công khai từ cơ quan chức năng, báo chính thống, FTC/FBI consumer alerts, case VietNamNet 04/07/2026. | Dùng làm examples và red-flag taxonomy; không cần scrape realtime cho MVP. |
| Phishing/domain check | Google Safe Browsing, PhishTank, OpenPhish, local community blocklists such as ChongLuaDao nếu có quyền/điều khoản phù hợp. | Dùng optional; proposal nên ghi “candidate integrations subject to API access”. |
| Health misinformation | Nguồn y tế chính thống: Bộ Y tế, WHO, bệnh viện/trường y đáng tin cậy. | Không đưa lời khuyên điều trị; chỉ hướng dẫn kiểm chứng và khuyến nghị hỏi bác sĩ. |
| MIL measurement | DMILS-style pre/post quiz hoặc checklist MIL rút gọn. | Dùng để chứng minh outcome, không chỉ số lượt dùng. |
| Community events | Hội Người cao tuổi, thư viện, Đoàn Thanh niên, trường đại học, UBND phường/xã. | Có thể mock trong MVP; partner plan cho sustainability. |

# **10\. Fit với tiêu chí chấm của UNESCO**

| Criterion | Score potential | Rationale |
| ----- | ----- | ----- |
| Theme alignment | Very high | MIL là năng lực cốt lõi của giải pháp; AI được dùng để tăng năng lực đánh giá và kiểm chứng thông tin, không chỉ để phát hiện tự động. |
| Innovation | High | Tập trung decision-layer defense \+ Trusted Circle \+ micro-learning. Khác với detector hoặc lớp học truyền thống. |
| Feasibility | High | MVP có thể build bằng web/chat prototype, OCR/link parser, rule-based risk score và LLM explanation. Không cần model deepfake riêng. |
| Sustainability | Medium-high | Có thể mở rộng bằng đối tác cộng đồng, trường đại học, Hội Người cao tuổi, thư viện, cơ quan truyền thông/ATTT. |
| Impact & Inclusion | Very high | Người cao tuổi là nhóm dễ bị tổn thương trong digital ageing; impact có thể đo bằng kỹ năng MIL, safe decisions, referral to trusted circle và avoided risky actions. |
| Clarity | High | Story pitch trực quan: nhận tin đáng nghi → AI phân tích → học mini lesson → hỏi người thân → tham gia cộng đồng. |

## **10.1 Why this can win**

* **It is not just AI:** UNESCO sẽ không chỉ thích “AI detector”. Họ cần MIL, inclusion, education và community. An Tâm Số có cả bốn.  
* **It is not just education:** Micro-learning diễn ra ngay sau tình huống thật, nên learning is contextual and memorable.  
* **It is not just family support:** Trusted Circle có quyền riêng tư, chỉ kích hoạt khi người dùng muốn, tránh biến giải pháp thành surveillance.  
* **It is measurable:** Có thể đo before/after MIL score, số safe decisions, số referral, lesson completion và qualitative confidence.

# **11\. Kế hoạch triển khai, đo lường và bền vững**

## **11.1 10-hour build plan cho hackathon/proposal sprint**

| Timebox | Owner | Output |
| ----- | ----- | ----- |
| 0–1h | All | Finalize problem statement, persona, demo scenario. |
| 1–2.5h | Thanh \+ Thịnh | Evidence table, impact estimate, BMC/sustainability logic. |
| 1–4h | Cường \+ Trúc | Prototype flow: input screen, risk output, lesson card, Trusted Circle summary. |
| 3–5h | Duy Anh \+ Trúc | User journey, pitch narrative, competitor gap, UI copy. |
| 5–7h | Cường | Mock AI logic: rule-based red flags \+ LLM prompt \+ sample cases. |
| 7–8.5h | All | Test with 2–3 people, refine tone and clarity. |
| 8.5–10h | All | Proposal deck/report, 3-minute pitch script, demo recording. |

## **11.2 Pilot roadmap**

| Phase | Duration | Goal | Metric |
| ----- | ----- | ----- | ----- |
| Prototype | 1 week | Clickable prototype \+ 10 scam/misinformation cases \+ 3 lesson cards. | Completion of demo, clarity score from 5 testers. |
| Micro-pilot | 1 month | Test with 20–30 older adults and 10 family members. | Pre/post MIL quiz; % users who understand next step; Trusted Circle usage. |
| Community pilot | 3 months | Run with a local senior club/library/university volunteer group. | Number of workshops, active users, recurring lessons, case reports. |
| Scale | 6–12 months | Partner with community organizations and verified information sources. | Monthly active users, avoided risky actions, partner coverage. |

## **11.3 Impact measurement logic model**

| Inputs | Activities | Outputs | Short-term outcomes | Long-term outcomes |
| ----- | ----- | ----- | ----- | ----- |
| AI prototype, red-flag taxonomy, public alerts, volunteers, family contacts. | Analyze suspicious content, create micro lessons, share trusted summaries, connect offline events. | Cases analyzed, lessons completed, trusted-circle referrals, workshops listed. | Better source checking, fewer unsafe clicks/transfers, more confidence, less panic. | Higher MIL resilience, safer digital participation, stronger intergenerational support, reduced misinformation spread. |

# **12\. Rủi ro, đạo đức và giới hạn**

| Risk | Why it matters | Mitigation |
| ----- | ----- | ----- |
| AI hallucination | Nếu AI tự tin sai, người dùng có thể tin sai. | RAG \+ source transparency \+ “không chắc” category \+ no medical/legal/financial advice. |
| Over-reliance on AI | Mục tiêu là tăng tự chủ, không tạo phụ thuộc mới. | Micro-learning and verification steps; explain why; ask user to confirm with official/trusted channels. |
| Privacy leakage | Screenshot có CCCD, số tài khoản, số điện thoại. | Redaction before share; no retention by default; explicit consent before Trusted Circle. |
| Family surveillance | Người cao tuổi có thể thấy bị kiểm soát. | User-initiated sharing only; choose trusted contacts; no background monitoring. |
| False positives | Cảnh báo sai có thể làm giảm niềm tin và gây hoang mang. | Use risk level not binary true/false; provide reason and next verification steps. |
| Accessibility | Người cao tuổi có thể khó đọc/nhập liệu. | Large font, voice input, one-tap actions, simple Vietnamese, high contrast. |
| Scope creep | Nếu ôm scam, deepfake, fake news, health, finance quá rộng sẽ khó trình bày. | MVP focuses on suspicious-message decision support; other modules are supporting ecosystem. |

# **13\. Phân công team**

| Thành viên / năng lực | Vai trò trong proposal | Deliverables |
| ----- | ----- | ----- |
| Trúc – coding \+ business strategy | Product lead / UX logic / positioning | User flow, feature prioritization, pitch clarity, prototype copy. |
| Duy Anh – business strategy \+ product development | Market and product strategy | Problem framing, competitor landscape, user validation plan. |
| Cường – AI/software | Technical lead | MVP architecture, AI decision flow, OCR/link parser/rule-based risk demo. |
| Thịnh – digital business, BMC, financial/marketing plan Non-profit freemium model \+ ADS. | Sustainability and go-to-community | Business model canvas, community hub, partner plan, marketing/impact story. |
| Thanh – finance/quant \+ code \+ code | Data and impact analyst | Financial loss data, risk scoring logic, impact estimate, evaluation metrics. |

## **13.1 Proposal structure gợi ý để nộp UNESCO**

| Section | Content |
| ----- | ----- |
| 1\. Team and motivation | Beyond Limits, youth-led, interdisciplinary, why team cares about the elders and MIL. **App name: El-Ed.** |
| 2\. Problem statement | Use final statement in Section 6\. |
| Objective |  |
| 3\. Target audience | Older adults 55/60+ in Vietnam, plus family members and community volunteers as support layer. |
| 4\. Solution concept | An Tâm Số: AI Decision Companion \+ Micro MIL Learning \+ Trusted Circle \+ Community Hub \+ Scam Alert Center. |
| 5\. Prototype | Screenshots/wireframes/demo flow; one concrete story. |
| 6\. Innovation/ Creativity | Decision-layer defense, autonomy-first, family/community-based, not just fact-checking. |
| 7\. Feasibility | **BMC**, MVP build plan and technical architecture. |
| 8\. Impact and inclusion | Older adults, intergenerational support, measurable MIL outcomes. |
| 9\. Sustainability | Partnerships with senior associations, libraries, schools/universities, public-source alerts. |
| 10\. Scalability | ASEAN, Countries with increasing elders, EU,  |

# **14\. Tài liệu tham khảo APA 7th**

Baines, A., Hargittai, E., & Palfrey, J. (2025). Older adults’ response strategies to misinformation on social media. Social Media \+ Society. https://doi.org/10.1177/20563051251386360

Federal Bureau of Investigation, Internet Crime Complaint Center. (2025). 2024 IC3 annual report. https://www.ic3.gov/AnnualReport/Reports/2024\_IC3Report.pdf

Federal Trade Commission. (2025, March 10). New FTC data show a big jump in reported losses to fraud to $12.5 billion in 2024\. https://www.ftc.gov/news-events/news/press-releases/2025/03/new-ftc-data-show-big-jump-reported-losses-fraud-125-billion-2024

LaRubbio, K., Lanter, A., Lee, S., Ramesh, M., & Freed, D. (2025). Intergenerational support for deepfake scams targeting older adults. arXiv. https://arxiv.org/abs/2508.11579

Peng, W., Lee, H. R., & Lim, S. (2024). Leveraging chatbots to combat health misinformation for older adults: Participatory design study. JMIR Formative Research, 8, e60712. https://doi.org/10.2196/60712

UNESCO. (2026, June 10; updated July 5). UNESCO Youth Hackathon 2026\. https://www.unesco.org/en/articles/unesco-youth-hackathon-2026

VietNamNet. (2026, July 4). Vietnam intensifies probe into holiday contract fraud scheme. https://vietnamnet.vn/en/vietnam-intensifies-probe-into-holiday-contract-fraud-scheme-2532442.html

World Bank. (2026). Population ages 65 and above (% of total population) \- Viet Nam. World Development Indicators. https://data.worldbank.org/indicator/SP.POP.65UP.TO.ZS?locations=VN

World Bank. (2026). Population, total \- Viet Nam. World Development Indicators. https://data.worldbank.org/indicator/SP.POP.TOTL?locations=VN

# **Phụ lục A. 3-minute pitch script outline**

* **0:00–0:30:** Hook: “Một tin nhắn giả mạo chỉ cần 30 giây để lấy tiền, nhưng người cao tuổi lại cần một cách kiểm chứng đơn giản, không phán xét.”  
* **0:30–1:00:** Problem: scam, misinformation and AI-generated content target older adults; existing tools miss the decision moment.  
* **1:00–2:00:** Demo: screenshot → AI red flags → verification steps → micro lesson → trusted circle share.  
* **2:00–2:30:** Why unique: autonomy-first, intergenerational, online-to-offline, MIL not just detection.  
* **2:30–3:00:** Impact: safer decisions, higher MIL, stronger family/community resilience; feasible MVP and scalable partnerships.