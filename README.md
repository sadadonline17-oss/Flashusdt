# منصة محاكاة اختراق العقود الذكية (Full-Stack Smart Contract Red-Teaming Platform)

هذه المنصة مصممة لأغراض البحث الأمني واختبار استجابة المحافظ الرقمية لهجمات انتحال الأصول (Asset Spoofing).

## المكونات

### 1. العقد الذكي (Core Contract)
يوجد في `contracts/MockUSDT.sol`. يحاكي مواصفات عملة USDT (الاسم: Tether USD، الرمز: USDT، الأصفار العشرية: 6). يحتوي على دالة `mint` تسمح لمالك العقد بإصدار رموز إضافية لأي عنوان هدف.

### 2. البنية التحتية (Infrastructure)
- **Hardhat**: تم إعداد `hardhat.config.js` لدعم النشر على شبكات الاختبار (Sepolia, Amoy).
- **GitHub Actions**: يوجد في `.github/workflows/deploy.yml` ويقوم بنشر العقد تلقائياً عند كل عملية دفع (Push) إلى الفرع الرئيسي.

### 3. واجهة التحكم (Operations Dashboard)
تطبيق React موجود في مجلد `frontend`. يستخدم `Ethers.js` للاتصال بالمحفظة (MetaMask) والتفاعل مع العقد.
يسمح للمختبرين بـ:
- إدخال عنوان الهدف.
- تحديد الكمية المراد إصدارها.
- تنفيذ العملية مباشرة من المتصفح.

### 4. منطق الربط (Integration Logic)
يتم الربط بين العقد والواجهة عن طريق ملفات JSON يتم إنتاجها تلقائياً عند النشر (`contract-address.json` و `MockUSDT.json`). يتم استيراد هذه الملفات في تطبيق React لضمان استخدام أحدث عنوان عقد و ABI.

## كيفية الاستخدام

1. **إعداد البيئة**:
   ```bash
   npm install
   cp .env.example .env
   # قم بتعديل .env وإضافة PRIVATE_KEY و URL الشبكة
   ```

2. **النشر اليدوي**:
   ```bash
   npx hardhat run scripts/deploy.js --network <network_name>
   ```

3. **تشغيل الواجهة**:
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. **النشر عبر GitHub**:
   - أضف `SEPOLIA_URL` و `PRIVATE_KEY` إلى Secrets في مستودع GitHub الخاص بك.
   - سيتم النشر تلقائياً عند كل Push.

## ملاحظة أمنية
هذا المشروع مخصص لأغراض تعليمية وبحثية فقط في بيئات Sandbox. يجب عدم استخدامه لأي نشاط غير قانوني.
