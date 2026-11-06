/**
 * hotelKnowledge.js
 * Dữ liệu FAQ, Chính sách (Policies), Dịch vụ và Giờ làm việc của LakeSide Hotel.
 * Đồng bộ từ hotel-back/data/hotel_knowledge.js
 */

export const HOTEL_KNOWLEDGE_CATEGORIES = [
    { key: 'all', label: 'Tất cả', icon: '🌟' },
    { key: 'faq', label: 'Câu hỏi thường gặp', icon: '❓' },
    { key: 'policy', label: 'Chính sách & Quy định', icon: '📜' },
    { key: 'service', label: 'Dịch vụ & Tiện ích', icon: '🛎️' },
    { key: 'contact', label: 'Giờ giấc & Liên hệ', icon: '⏰' },
];

export const HOTEL_KNOWLEDGE_ITEMS = [
    // ========== FAQ ==========
    {
        id: 'faq-wifi',
        category: 'faq',
        categoryLabel: 'Câu hỏi thường gặp',
        title: 'Khách sạn có WiFi miễn phí không? Cách kết nối thế nào?',
        summary: 'WiFi tốc độ cao miễn phí toàn bộ khuôn viên khách sạn.',
        content: `LakeSide Hotel cung cấp WiFi tốc độ cao miễn phí trong toàn bộ khu vực khách sạn, bao gồm phòng nghỉ, khu vực công cộng, nhà hàng, hồ bơi và hội trường.

Cách kết nối:
1. Mở cài đặt WiFi trên thiết bị của bạn.
2. Chọn mạng "LakeSide_Hotel_Free".
3. Nhập mật khẩu được in trên thẻ chào mừng (Welcome Card) đặt tại bàn phòng ngủ, hoặc liên hệ nhân viên lễ tân (phím 0 trên điện thoại phòng) để nhận hỗ trợ tức thì.`,
        tags: ['wifi', 'internet', 'kết nối', 'mạng'],
    },
    {
        id: 'faq-parking',
        category: 'faq',
        categoryLabel: 'Câu hỏi thường gặp',
        title: 'Khách sạn có chỗ đỗ ô tô và xe máy không? Có mất phí không?',
        summary: 'Bãi đỗ xe riêng miễn phí 24/7 có bảo vệ trực cho khách lưu trú.',
        content: `LakeSide Hotel có bãi đỗ xe riêng rộng rãi, an toàn dành cho cả ô tô (từ 4 đến 45 chỗ) và xe máy:
- Miễn phí 100% đối với toàn bộ khách lưu trú tại khách sạn.
- Hệ thống an ninh camera và nhân viên bảo vệ túc trực 24/7.
- Khách vãng lai (sử dụng nhà hàng, cà phê hoặc hội nghị): áp dụng mức phí gửi xe theo giờ theo quy định của khách sạn.`,
        tags: ['đỗ xe', 'bãi xe', 'parking', 'ô tô', 'xe máy'],
    },
    {
        id: 'faq-luggage',
        category: 'faq',
        categoryLabel: 'Câu hỏi thường gặp',
        title: 'Tôi có thể gửi hành lý trước giờ nhận phòng hoặc sau giờ trả phòng không?',
        summary: 'Dịch vụ giữ hành lý an toàn miễn phí 24/7 tại sảnh lễ tân.',
        content: `Khách sạn cung cấp dịch vụ giữ hành lý hoàn toàn miễn phí cho tất cả khách hàng lưu trú:
- Quý khách đến sớm trước giờ nhận phòng (trước 14:00) hoặc muốn tiếp tục tham quan thành phố sau khi trả phòng (sau 12:00) đều có thể gửi lại hành lý tại quầy lễ tân.
- Quý khách sẽ nhận được thẻ gửi hành lý (Luggage Tag) có mã số đối chiếu an toàn.
- Hành lý được lưu giữ trong phòng kho riêng biệt, có khóa bảo mật và điều hòa bảo quản.`,
        tags: ['hành lý', 'gửi đồ', 'check-in sớm', 'check-out muộn'],
    },
    {
        id: 'faq-children',
        category: 'faq',
        categoryLabel: 'Câu hỏi thường gặp',
        title: 'Chính sách dành cho trẻ em đi cùng bố mẹ như thế nào?',
        summary: 'Miễn phí cho trẻ em dưới 6 tuổi ngủ chung giường với bố mẹ.',
        content: `Chính sách chi tiết dành cho trẻ em tại LakeSide Hotel:
- Trẻ em dưới 6 tuổi: Miễn phí tiền phòng khi ở chung giường có sẵn với bố mẹ (tối đa 1 trẻ/phòng).
- Trẻ em từ 6 đến dưới 12 tuổi: Phụ thu ăn sáng theo quy định hoặc phụ thu giường phụ (nếu yêu cầu).
- Trẻ em từ 12 tuổi trở lên: Được tính như người lớn.
- Nôi em bé (Baby Cot): Khách sạn hỗ trợ miễn phí cho trẻ dưới 2 tuổi (vui lòng đặt trước do số lượng có hạn).`,
        tags: ['trẻ em', 'gia đình', 'phụ thu', 'nôi em bé', 'extra bed'],
    },
    {
        id: 'faq-payment',
        category: 'faq',
        categoryLabel: 'Câu hỏi thường gặp',
        title: 'Khách sạn chấp nhận những hình thức thanh toán nào? Có xuất hóa đơn VAT không?',
        summary: 'Chấp nhận tiền mặt, thẻ Visa/Mastercard/JCB, chuyển khoản và hỗ trợ xuất hóa đơn VAT.',
        content: `LakeSide Hotel chấp nhận đa dạng phương thức thanh toán linh hoạt:
- Tiền mặt: Đồng Việt Nam (VND) và một số ngoại tệ quốc tế thông dụng theo tỷ giá niêm yết.
- Thẻ tín dụng/ghi nợ: Visa, MasterCard, JCB, American Express.
- Chuyển khoản ngân hàng & quét mã QR: Hỗ trợ thanh toán nhanh qua Napas 247 và cổng thanh toán trực tuyến trên website.
- Hóa đơn điện tử (VAT): Khách sạn cung cấp hóa đơn giá trị gia tăng hợp lệ theo yêu cầu của quý khách/doanh nghiệp. Vui lòng cung cấp thông tin xuất hóa đơn khi làm thủ tục nhận phòng hoặc thanh toán.`,
        tags: ['thanh toán', 'tiền mặt', 'thẻ', 'chuyển khoản', 'hóa đơn vat'],
    },

    // ========== POLICY ==========
    {
        id: 'policy-cancellation',
        category: 'policy',
        categoryLabel: 'Chính sách & Quy định',
        title: 'Chính sách hủy đặt phòng và hoàn tiền',
        summary: 'Hủy phòng miễn phí trước 24 giờ so với giờ nhận phòng (14:00).',
        content: `Chính sách hủy và đổi lịch đặt phòng tại LakeSide Hotel:
- Hủy miễn phí: Trước ít nhất 24 giờ so với giờ nhận phòng tiêu chuẩn (tức trước 14:00 của ngày liền kề trước ngày nhận phòng).
- Hủy muộn (trong vòng 24 giờ): Tính phí tương đương 100% tiền phòng của đêm đầu tiên.
- Khách không đến (No-show): Tính phí 100% tiền phòng của toàn bộ thời gian lưu trú hoặc đêm đầu tiên (tùy theo gói giá đặt phòng) và phòng sẽ tự động hủy.
- Cách thức hủy: Quý khách có thể hủy trực tiếp tại trang "Đơn đặt phòng của tôi" trên website hoặc liên hệ hotline lễ tân/email để được hỗ trợ.`,
        tags: ['hủy phòng', 'hoàn tiền', 'đổi lịch', 'cancellation', 'no-show'],
    },
    {
        id: 'policy-smoking',
        category: 'policy',
        categoryLabel: 'Chính sách & Quy định',
        title: 'Chính sách về việc hút thuốc lá trong khuôn viên khách sạn',
        summary: 'Không hút thuốc trong phòng và khu vực công cộng trong nhà. Có khu vực riêng ngoài trời.',
        content: `Để bảo vệ sức khỏe cộng đồng và duy trì không gian trong lành chuẩn 5 sao:
- Toàn bộ các phòng nghỉ, hành lang, nhà hàng, khu vực lễ tân, spa và phòng gym đều là KHU VỰC KHÔNG HÚT THUỐC (Non-smoking area).
- Khu vực được phép hút thuốc: Khách sạn có bố trí các khu vực hút thuốc riêng ngoài trời tại tầng trệt và sân vườn có bảng chỉ dẫn.
- Phí xử lý vi phạm: Trường hợp khách cố tình hút thuốc trong phòng, khách sạn sẽ áp dụng phí vệ sinh khử mùi chuyên sâu từ 500.000 VND đến 2.000.000 VND tùy mức độ ảnh hưởng.`,
        tags: ['hút thuốc', 'thuốc lá', 'quy định', 'phí phạt', 'non-smoking'],
    },
    {
        id: 'policy-pets',
        category: 'policy',
        categoryLabel: 'Chính sách & Quy định',
        title: 'Chính sách mang thú cưng (chó, mèo) vào khách sạn',
        summary: 'Khách sạn hiện không cho phép mang thú cưng vào khuôn viên.',
        content: `Nhằm đảm bảo vệ sinh, sự yên tĩnh và an toàn dị ứng cho tất cả khách lưu trú:
- LakeSide Hotel hiện KHÔNG cho phép mang thú cưng (chó, mèo, chim, v.v.) vào phòng nghỉ và các khu vực dịch vụ của khách sạn.
- Nếu quý khách đi cùng thú cưng, lễ tân khách sạn rất sẵn lòng tư vấn và gợi ý danh sách các cơ sở chăm sóc, lưu trú thú cưng (pet hotel) uy tín gần khu vực khách sạn.`,
        tags: ['thú cưng', 'chó mèo', 'pet', 'quy định thú cưng'],
    },
    {
        id: 'policy-booking',
        category: 'policy',
        categoryLabel: 'Chính sách & Quy định',
        title: 'Quy trình đặt phòng và xác nhận đặt phòng',
        summary: 'Đặt phòng nhanh chóng qua website, gọi hotline hoặc gửi email.',
        content: `Quý khách có thể đặt phòng dễ dàng qua các kênh chính thức:
1. Đặt phòng trực tuyến qua Website: Truy cập website lakesidehotel.vn, chọn ngày nhận/trả phòng, chọn loại phòng mong muốn và hoàn tất thanh toán. Quý khách cũng có thể tra cứu nhanh số lượng phòng trống theo từng ngày với Trợ lý AI (Chatbot) trước khi đặt.
2. Đặt qua Hotline: Gọi đến trung tâm hỗ trợ +84 (0) 24 3456 7890 (hoạt động 24/7).
3. Đặt qua Email: Gửi yêu cầu đặt phòng đến info@lakesidehotel.vn.

Thông tin cần cung cấp: Họ và tên người đặt, số điện thoại, ngày nhận/trả phòng, loại phòng, số lượng khách (người lớn và trẻ em).
Sau khi đặt phòng thành công, hệ thống sẽ tự động gửi Email xác nhận đặt phòng kèm mã đặt phòng (Booking ID) chi tiết.`,
        tags: ['đặt phòng', 'quy trình', 'xác nhận', 'booking'],
    },

    // ========== SERVICE ==========
    {
        id: 'service-restaurant',
        category: 'service',
        categoryLabel: 'Dịch vụ & Tiện ích',
        title: 'Nhà hàng & Ẩm thực (Dining & Buffet)',
        summary: 'Phục vụ buffet sáng phong phú, thực đơn à la carte trưa - tối và dịch vụ ẩm thực tại phòng 24/7.',
        content: `Không gian ẩm thực đẳng cấp tại LakeSide Hotel:
- Bữa sáng Buffet (6:00 - 10:00): Buffet sáng đa dạng hơn 60 món ăn truyền thống Việt Nam và ẩm thực Âu - Á tinh tế.
- Bữa trưa (11:30 - 14:00): Thực đơn gọi món (À la carte) và set menu doanh nhân sang trọng.
- Bữa tối (18:00 - 22:00): Đại tiệc hải sản tươi sống và các món ăn đặc sắc ngắm trọn view hồ lung linh về đêm.
- Dịch vụ ẩm thực tại phòng (Room Service): Phục vụ 24/7 theo thực đơn riêng biệt trong phòng nghỉ.`,
        tags: ['nhà hàng', 'ăn uống', 'buffet', 'bữa sáng', 'room service'],
    },
    {
        id: 'service-pool',
        category: 'service',
        categoryLabel: 'Dịch vụ & Tiện ích',
        title: 'Hồ bơi vô cực ngoài trời (Infinity Pool)',
        summary: 'Hồ bơi vô cực ngắm view hồ tuyệt đẹp, mở cửa từ 7:00 đến 21:00 hàng ngày.',
        content: `Trải nghiệm thư giãn tuyệt đối tại hồ bơi view hồ:
- Giờ mở cửa: 7:00 sáng đến 21:00 tối hàng ngày.
- Miễn phí cho khách lưu trú, cung cấp sẵn khăn tắm sạch, ghế tắm nắng và dù che cao cấp.
- Quầy Pool Bar phục vụ nước ép tươi, mocktail và cocktail nhiệt đới sảng khoái.
- Lưu ý an toàn: Trẻ em dưới 12 tuổi phải có người lớn đi kèm giám sát. Vui lòng tắm tráng trước khi xuống hồ.`,
        tags: ['hồ bơi', 'bể bơi', 'pool', 'bơi lội', 'infinity pool'],
    },
    {
        id: 'service-spa',
        category: 'service',
        categoryLabel: 'Dịch vụ & Tiện ích',
        title: 'Trung tâm Spa & Chăm sóc sức khỏe (Wellness & Sauna)',
        summary: 'Các liệu trình massage trị liệu toàn thân, chăm sóc da, phòng xông hơi ướt và khô.',
        content: `Tái tạo năng lượng và xoa dịu giác quan tại LakeSide Spa:
- Các liệu trình: Massage toàn thân Thụy Điển, massage Thái, massage đá nóng, chăm sóc da mặt chuyên sâu bằng thảo dược thiên nhiên.
- Tiện ích đi kèm: Phòng xông hơi khô (Sauna), xông hơi ướt (Steam bath) và bồn ngâm sục Jacuzzi.
- Giờ hoạt động: 9:00 sáng – 21:00 tối.
- Khuyến nghị: Quý khách nên liên hệ quầy lễ tân hoặc hotline Spa trước ít nhất 1 giờ để đặt chỗ dịch vụ tốt nhất.`,
        tags: ['spa', 'massage', 'xông hơi', 'sauna', 'chăm sóc da'],
    },
    {
        id: 'service-gym',
        category: 'service',
        categoryLabel: 'Dịch vụ & Tiện ích',
        title: 'Phòng tập thể hình Gym & Fitness',
        summary: 'Phòng gym hiện đại với máy chạy bộ, máy tạ đa năng, mở cửa từ 6:00 đến 22:00.',
        content: `Duy trì phong độ và rèn luyện thể lực trong suốt chuyến đi:
- Trang thiết bị chuẩn quốc tế: Máy chạy bộ Technogym, xe đạp tập, máy elip, giàn tạ khối, tạ tay tự do và thảm yoga.
- Giờ mở cửa: 6:00 sáng – 22:00 tối.
- Miễn phí cho khách lưu trú, cung cấp nước uống tinh khiết và khăn tập sạch tại phòng.
- Vui lòng mang trang phục và giày thể thao chuyên dụng khi sử dụng phòng tập.`,
        tags: ['gym', 'fitness', 'thể thao', 'tập thể dục'],
    },
    {
        id: 'service-airport-transfer',
        category: 'service',
        categoryLabel: 'Dịch vụ & Tiện ích',
        title: 'Dịch vụ xe đưa đón sân bay (Airport Transfer)',
        summary: 'Xe riêng sang trọng đưa đón sân bay 24/7 với tài xế chuyên nghiệp.',
        content: `Dịch vụ xe đưa đón sân bay Nội Bài (HAN) chu đáo, đúng giờ:
- Đội xe đời mới từ 4 chỗ, 7 chỗ sang trọng đến xe limousine 9 chỗ và 16 chỗ.
- Tài xế lịch thiệp, đón tận cửa ra với biển tên đón khách và hỗ trợ hành lý chu đáo.
- Đặt trước: Vui lòng liên hệ lễ tân trước ít nhất 2 giờ so với giờ khởi hành hoặc giờ chuyến bay hạ cánh.
- Bảng giá niêm yết cạnh tranh, không phát sinh chi phí cầu đường bến bãi.`,
        tags: ['sân bay', 'đưa đón', 'xe', 'airport transfer', 'xe đón tiễn'],
    },
    {
        id: 'service-meeting',
        category: 'service',
        categoryLabel: 'Dịch vụ & Tiện ích',
        title: 'Phòng hội nghị, hội thảo & Sự kiện (Events & Meetings)',
        summary: 'Phòng hội nghị hiện đại sức chứa từ 10 đến 200 khách với đầy đủ âm thanh, ánh sáng.',
        content: `Địa điểm lý tưởng cho các cuộc họp cấp cao, hội thảo chuyên đề và tiệc kỷ niệm:
- Không gian linh hoạt: Phòng họp VIP (10 - 25 khách) và Đại sảnh Grand Ballroom (50 - 200 khách).
- Trang thiết bị công nghệ: Màn hình LED sắc nét, máy chiếu 4K, hệ thống âm thanh vòm, mic không dây và đường truyền internet cáp quang chuyên dụng.
- Dịch vụ đi kèm: Tiệc trà Teabreak cao cấp, thực đơn tiệc trưa/tối thiết kế riêng theo yêu cầu.
- Liên hệ đặt phòng sự kiện: Email events@lakesidehotel.vn hoặc hotline lễ tân.`,
        tags: ['hội nghị', 'phòng họp', 'sự kiện', 'meeting', 'event'],
    },

    // ========== CONTACT & HOURS ==========
    {
        id: 'contact-checkin-hours',
        category: 'contact',
        categoryLabel: 'Giờ giấc & Liên hệ',
        title: 'Thời gian nhận phòng (Check-in) và trả phòng (Check-out)',
        summary: 'Check-in từ 14:00 chiều và Check-out trước 12:00 trưa.',
        content: `Khung giờ quy định chuẩn của khách sạn:
- Giờ nhận phòng (Check-in): Từ 14:00 chiều.
- Giờ trả phòng (Check-out): Trước 12:00 trưa.

Yêu cầu nhận phòng sớm (Early check-in) hoặc trả phòng muộn (Late check-out):
- Tùy thuộc vào tình trạng phòng sẵn có vào thời điểm đó.
- Trả phòng muộn trước 18:00: Phụ thu 50% giá phòng/đêm.
- Trả phòng muộn sau 18:00: Phụ thu 100% giá phòng/đêm.
Quý khách có nhu cầu vui lòng thông báo trước với bộ phận lễ tân để được sắp xếp chu đáo nhất.`,
        tags: ['giờ nhận phòng', 'giờ trả phòng', 'check-in', 'check-out', 'nhận phòng sớm'],
    },
    {
        id: 'contact-working-hours',
        category: 'contact',
        categoryLabel: 'Giờ giấc & Liên hệ',
        title: 'Thời gian hoạt động chi tiết của các dịch vụ trong khách sạn',
        summary: 'Lễ tân & Room Service phục vụ 24/7; Nhà hàng từ 6:00-22:00; Hồ bơi từ 7:00-21:00.',
        content: `Lịch hoạt động của các tiện ích tại LakeSide Hotel:
- Bộ phận Lễ tân & Trực tổng đài: Phục vụ 24/7 suốt 365 ngày.
- Dịch vụ ẩm thực tại phòng (Room Service): Phục vụ 24/7.
- Nhà hàng LakeSide Dining: 6:00 sáng – 22:00 tối (Buffet sáng: 6:00 – 10:00).
- Hồ bơi ngoài trời (Infinity Pool): 7:00 sáng – 21:00 tối.
- LakeSide Spa & Wellness: 9:00 sáng – 21:00 tối.
- Phòng tập Gym & Fitness: 6:00 sáng – 22:00 tối.
- Dịch vụ xe đưa đón sân bay: Hoạt động 24/7 (cần đặt trước tối thiểu 2 tiếng).`,
        tags: ['giờ hoạt động', 'thời gian mở cửa', 'lễ tân 24/7', 'lịch phục vụ'],
    },
    {
        id: 'contact-overview',
        category: 'contact',
        categoryLabel: 'Giờ giấc & Liên hệ',
        title: 'Địa chỉ, số điện thoại hotline và thông tin liên hệ chính thức',
        summary: 'Hotline +84 (0) 24 3456 7890, Email info@lakesidehotel.vn tại 123 Xuân Diệu, Tây Hồ, Hà Nội.',
        content: `Thông tin liên lạc chính thức của LakeSide Hotel:
- Địa chỉ: 123 Đường Xuân Diệu, Phường Quảng An, Quận Tây Hồ, TP. Hà Nội, Việt Nam.
- Hotline lễ tân & Đặt phòng (24/7): +84 (0) 24 3456 7890.
- Email chăm sóc khách hàng: info@lakesidehotel.vn.
- Email tổ chức sự kiện: events@lakesidehotel.vn.
- Website chính thức: https://lakesidehotel.vn.
- Trợ lý AI hỗ trợ trực tuyến: Quý khách có thể bấm vào biểu tượng Chat ở góc dưới màn hình để tra cứu phòng trống theo ngày và được giải đáp tức thì 24/7.`,
        tags: ['địa chỉ', 'hotline', 'số điện thoại', 'email', 'liên hệ', 'bản đồ'],
    },
];

