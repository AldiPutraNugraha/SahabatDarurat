# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

# 🚑 SahabatDarurat - Emergency Ambulance App

Aplikasi panggilan ambulans darurat dengan tracking real-time dan layanan medis lengkap.

## 🚀 Fitur Utama

### Tahap 1: Fitur Dasar ✅
- **Pemanggilan Ambulans Darurat**: Tombol emergency untuk panggilan cepat
- **Tracking Real-time**: Pantau lokasi ambulans secara langsung
- **Live ETA**: Perkiraan waktu kedatangan ambulans
- **Riwayat Layanan**: History lengkap semua panggilan darurat

### Tahap 2: Fitur Tambahan 🔧
- **Notifikasi Status**: Update real-time status ambulans
- **Pilihan Jenis Layanan**: Darurat, non-darurat, transportasi
- **Profil User & Driver**: Data lengkap dan rating layanan
- **Chat/Telepon**: Komunikasi langsung dengan driver
- **Integrasi Rumah Sakit**: Pencarian RS terdekat

## 🎨 Tema & Desain

- **Warna Utama**: Merah (#DC2626) untuk emergency
- **Warna Sekunder**: Putih dan biru medis
- **UI/UX**: Clean, responsive, mudah digunakan saat darurat
- **Dark/Light Mode**: Mendukung tema gelap dan terang

## 📱 Screenshot

*Screenshot akan ditambahkan setelah development selesai*

## 🛠️ Tech Stack

- **Framework**: React Native dengan Expo
- **Navigation**: Expo Router
- **Maps**: React Native Maps
- **Location**: Expo Location
- **Notifications**: Expo Notifications
- **Storage**: AsyncStorage
- **Language**: TypeScript

## 🚀 Instalasi & Setup

1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd SahabatDarurat
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Setup Expo CLI** (jika belum terinstall)
   ```bash
   npm install -g @expo/cli
   ```

4. **Jalankan Aplikasi**
   ```bash
   npm start
   ```

5. **Testing**
6. **Konfigurasi Environment (.env)**
   - Buat file `.env` di root project berisi:
     ```env
     EXPO_PUBLIC_FIREBASE_API_KEY=...
     EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
     EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
     EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=...
     EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
     EXPO_PUBLIC_FIREBASE_APP_ID=...
     ```
   - File `.env` sudah di-ignore oleh Git.

   - Android: `npm run android`
   - iOS: `npm run ios`  
   - Web: `npm run web`

## 📂 Struktur Project

```
SahabatDarurat/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx          # Home screen
│   │   ├── explore.tsx        # Services screen
│   │   └── _layout.tsx        # Tab layout
│   └── _layout.tsx            # Root layout
├── components/
│   ├── EmergencyButton.tsx    # Tombol darurat utama
│   ├── ServiceCard.tsx        # Card untuk layanan
│   ├── AmbulanceTracking.tsx  # Tracking ambulans
│   └── ServiceHistory.tsx     # Riwayat layanan
├── constants/
│   └── Colors.ts              # Tema warna aplikasi
├── types/
│   └── emergency.ts           # TypeScript definitions
└── assets/                    # Images & fonts
```

## 🔧 Konfigurasi

### Permissions yang Diperlukan:
- **Location**: Untuk tracking dan emergency calls
- **Camera**: Untuk dokumentasi darurat
- **Microphone**: Untuk komunikasi darurat
- **Phone**: Untuk panggilan langsung
- **Contacts**: Untuk kontak darurat
- **Notifications**: Untuk update status

### Environment Variables:
```env
EXPO_PUBLIC_API_BASE_URL=your_api_url
EXPO_PUBLIC_MAPS_API_KEY=your_maps_key
```

## 🚀 Development Roadmap

### Phase 1: Core Features (SELESAI)
- [x] Emergency button & UI
- [x] Basic navigation
- [x] Service cards
- [x] Tracking interface
- [x] History screen
- [x] Location permissions

### Phase 2: Advanced Features (COMING SOON)
- [ ] Real map integration
- [ ] Push notifications
- [ ] Chat functionality
- [ ] Driver profiles
- [ ] Hospital integration
- [ ] Payment system

### Phase 3: Premium Features (PLANNED)
- [ ] AI-powered emergency detection
- [ ] Medical records integration
- [ ] Insurance integration
- [ ] Multi-language support
- [ ] Offline mode

## 🔒 Security & Privacy

- Data pengguna dienkripsi end-to-end
- Lokasi hanya diakses saat diperlukan
- Tidak ada penyimpanan data sensitif di device
- Compliance dengan regulasi kesehatan

## 🧪 Testing

```bash
# Run tests
npm test

# Run type checking
npm run type-check

# Run linting
npm run lint
```

## 📱 Build & Deployment

### Development Build
```bash
eas build --platform android --profile development
```

### Production Build
```bash
eas build --platform all --profile production
```

### App Store Submission
```bash
eas submit --platform ios
eas submit --platform android
```

## 🤝 Contributing

1. Fork the project
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Contact & Support

- **Developer**: Tim SahabatDarurat
- **Email**: support@sahabatdarurat.com
- **Emergency Hotline**: 119

## 🆘 Emergency Numbers

- **Ambulans**: 119
- **Polisi**: 110
- **Pemadam Kebakaran**: 113
- **SAR**: 115

---

**⚠️ IMPORTANT**: Aplikasi ini tidak menggantikan panggilan darurat langsung ke 119. Untuk situasi mengancam jiwa, segera hubungi layanan darurat resional.

**Made with ❤️ for emergency response in Indonesia**

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
