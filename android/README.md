# SudaHub Android Native Project

هذا المجلد يحتوي على مشروع Android الأصيل الكامل لمنصة **SudaHub**.

## متطلبات البناء
- Android Studio Hedgehog (2023.1.1) أو أحدث
- JDK 17 أو أحدث
- Android SDK 34

## خطوات إنشاء ملف APK في Android Studio:
1. افتح مجلد `android` في برنامج Android Studio.
2. انتظر اكتمال مزامنة Gradle Sync.
3. من القائمة العلوية اضغط على: `Build` > `Build Bundle(s) / APK(s)` > `Build APK(s)`.
4. ستجد ملف الـ APK جاهزاً في:
   `app/build/outputs/apk/debug/app-debug.apk`

## أوامر البناء عبر Terminal:
```bash
./gradlew assembleDebug
```
ملف الـ APK الناتج:
`app/build/outputs/apk/debug/app-debug.apk`
