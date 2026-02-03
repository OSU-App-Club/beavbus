# BeavBus - Mobile App

## Get started

1. **Get a Google Maps API key**

   - Go to the [_APIs & Services: Credentials_ page in Google Cloud Console](https://console.cloud.google.com/apis/credentials) _-> Create credentials -> API key_

   - You can optionally leave the defaults then click _Create_.

   * Copy your API key and add it to a new `.env` file in `frontend/` following the example in the `.env.example` file.

   Note: This key should remain private. If it's pushed to a repository or shared online, you should delete it from the Google Cloud Console and create a new one.

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the app**
   - Off Campus
   ```bash
   npx expo start
   ```
   - On Campus 
   ```bash
   npx expo start --tunnel
   ```

Once these steps are complete, you can do one of the following to test the app:

- **EASY**: Download and use the **Expo Go** mobile app on your phone.

- Download and setup [**Android Studio**](https://reactnative.dev/docs/set-up-your-environment) to run an Android emulator on your computer (works on Windows and macOS).

- Download and setup [**Xcode**](https://reactnative.dev/docs/set-up-your-environment?os=macos&platform=ios) to run an iPhone emulator on your computer (only works on computers running macOS).
