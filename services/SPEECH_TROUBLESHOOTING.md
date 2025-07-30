# Troubleshooting Guide - Rozpoznawanie Mowy w Produkcji

## Najczęstsze problemy i rozwiązania

### 1. "Nie rozpoznano mowy" w wersji produkcyjnej

**Możliwe przyczyny:**

- Zbyt krótkie nagranie (mniej niż 1 sekundy)
- Zbyt ciche nagranie lub hałas w tle
- Problemy z kluczem API w środowisku produkcyjnym
- Różne ustawienia audio między deweloperską a produkcyjną wersją
- Problemy z połączeniem internetowym

**Debugowanie:**

1. Sprawdź logi z dodanymi informacjami:

   ```
   adb logcat | grep -E "(ReactNativeJS|SpeechRecognition)"
   ```

2. Sprawdź czy plik audio jest tworzony i ma odpowiedni rozmiar:
   - Szukaj w logach: "Rozmiar pliku audio"
   - Plik powinien mieć więcej niż 0 bajtów

3. Sprawdź odpowiedź z Google API:
   - Szukaj w logach: "Pełna odpowiedź z Google API"
   - Sprawdź czy są błędy API

### 2. Błędy uprawnień do mikrofonu

**Rozwiązanie:**

```javascript
// Sprawdź uprawnienia przed rozpoczęciem
const availability = await SpeechRecognitionService.checkServiceAvailability()
if (!availability.available) {
	// Pokaż dialog z instrukcjami dla użytkownika
}
```

### 3. Problemy z kluczem API

**Sprawdzenie w logach:**

- Szukaj: "Brak klucza API Google Speech-to-Text!"
- Lub: "Błąd API: 401" / "Błąd API: 403"

**Rozwiązanie:**

- Sprawdź czy klucz API jest poprawnie skonfigurowany w .env
- Upewnij się, że klucz ma włączone uprawnienia do Speech-to-Text API
- Sprawdź limity API w Google Console

### 4. Problemy z jakością audio

**Ulepszenia w kodzie:**

- Dodano `bufferSize: 8192` dla lepszej jakości
- Sprawdzanie rozmiaru pliku przed wysłaniem
- Lepsze ustawienia API (maxAlternatives, profanityFilter)

### 5. Problemy z połączeniem internetowym

**Debugowanie:**

- Sprawdź logi pod kątem błędów Network
- Test połączenia z API jest wykonywany w `checkServiceAvailability()`

## Nowe funkcje debugowania

### 1. Szczegółowe logowanie

Dodano rozszerzone logowanie, które pomoże zdiagnozować problemy:

- Informacje o pliku audio (ścieżka, rozmiar, istnienie)
- Status odpowiedzi HTTP z Google API
- Pełną odpowiedź z API (dla debugowania)

### 2. Sprawdzenie dostępności usługi

```javascript
const availability = await SpeechRecognitionService.checkServiceAvailability()
console.log(availability) // { available: boolean, reason: string }
```

### 3. Lepsze komunikaty błędów

- Rozróżnienie między różnymi typami błędów
- Sugestie rozwiązań dla użytkownika
- Zachowanie oryginalnego błędu dla debugowania

## Monitorowanie w produkcji

### Polecane logi do obserwowania:

```bash
# Wszystkie logi związane z rozpoznawaniem mowy
adb logcat | grep -E "(SpeechRecognition|audio|mikrofon|Google API)"

# Tylko błędy
adb logcat | grep -E "ERROR.*Speech"

# Sprawdzenie rozmiaru plików audio
adb logcat | grep "Rozmiar pliku audio"
```

### Metryki do śledzenia:

- Procent udanych rozpoznań
- Średni rozmiar plików audio
- Czas odpowiedzi API
- Częstotliwość różnych błędów

## Szybkie budowanie bez EAS (z aktualnych plików)

### ⚠️ Rozwiązywanie problemów z budowaniem

#### Problem z react-native-reanimated (długa ścieżka Windows)

```
ninja: error: mkdir(src/main/cpp/reanimated/CMakeFiles/reanimated.dir/C_/Users/HP/Desktop/Projekty_Bartek/audytArch/node_modules/react-native-reanimated): No such file or directory
```

**Rozwiązania:**

1. **Przenieś projekt do krótszej ścieżki:**

```powershell
# Przenieś projekt do C:\dev\audytArch zamiast C:\Users\HP\Desktop\Projekty_Bartek\audytArch
```

2. **Włącz długie ścieżki Windows (jako Administrator):**

```powershell
# Uruchom PowerShell jako Administrator
New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force
```

3. **Wyczyść cache Gradle i node_modules:**

```powershell
cd android
.\gradlew clean
cd ..
rm -rf node_modules
rm package-lock.json  # lub yarn.lock
npm install  # lub yarn install
```

4. **Alternatywnie - użyj EAS dla release:**

```bash
eas build --platform android --profile production
```

### Opcja 1: Gradle bezpośrednio (najszybsza)

```bash
cd android
./gradlew assembleRelease
# APK będzie w: android/app/build/outputs/apk/release/
```

### Opcja 2: Gradle z bundlem (zalecane dla Google Play)

```bash
cd android
./gradlew bundleRelease
# AAB będzie w: android/app/build/outputs/bundle/release/
```

### Opcja 3: React Native CLI

```bash
npx react-native build-android --mode=release
```

### Sprawdzenie czy APK jest gotowy do produkcji:

```bash
# Sprawdź czy APK jest podpisany
aapt dump badging android/app/build/outputs/apk/release/app-release.apk | grep "package:"

# Sprawdź rozmiar APK
ls -lh android/app/build/outputs/apk/release/
```

### Instalacja APK na urządzeniu:

```bash
adb install android/app/build/outputs/apk/release/app-release.apk
```

### Opcja 3: Android Studio

1. Otwórz folder `android/` w Android Studio
2. Build → Generate Signed Bundle/APK
3. Wybierz APK → Release

### Różnice między metodami budowania:

- **Lokalne budowanie**: Używa aktualnych plików (z niezcommitowanymi zmianami)
- **EAS Build**: Używa ostatniego commita (ignoruje niezcommitowane zmiany)

### Typ aplikacji według metody budowania:

| Metoda            | Typ APK                      | Gotowość do produkcji | Czas budowania |
| ----------------- | ---------------------------- | --------------------- | -------------- |
| `assembleRelease` | **Pełnoprawny release APK**  | ✅ Tak                | 2-5 min        |
| `assembleDebug`   | Debug APK (tylko testowanie) | ❌ Nie                | 1-2 min        |
| EAS Build         | **Pełnoprawny release APK**  | ✅ Tak                | 10-30 min      |

### Kiedy używać lokalnego `assembleRelease`:

- ✅ **Szybkie testy w środowisku produkcyjnym**
- ✅ **Dystrybucja wewnętrzna** (beta testing)
- ✅ **Debugging problemów produkcyjnych**
- ✅ **Instalacja na urządzeniach testowych**

### Kiedy używać EAS Build:

- ✅ **Oficjalne wydanie** na Google Play Store
- ✅ **Automatyczne CI/CD**
- ✅ **Spójne środowisko** budowania
- ✅ **Archiwizacja** wersji

### Zalety lokalnego budowania:

- ✅ Natychmiastowe testowanie zmian
- ✅ Bez oczekiwania w kolejce EAS
- ✅ Debugowanie w czasie rzeczywistym
- ✅ Kontrola nad środowiskiem budowania

## Zalecenia dla środowiska produkcyjnego

1. **Zawsze sprawdzaj dostępność usługi** przed użyciem
2. **Implementuj retry logic** dla błędów sieciowych
3. **Dodaj timeout** dla długich operacji
4. **Czyszczenie plików tymczasowych** jest teraz automatyczne
5. **Monitoruj użycie API** w Google Console
6. **Używaj lokalnego budowania** dla szybkich testów w produkcji
