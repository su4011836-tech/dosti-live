# Google Play Billing Setup Guide

Google Play Billing implementation requires steps taken on the Google Play Developer Console before the code can be finalized. This application has scaffolded the `GooglePlayPurchase` database tracking model to prepare for this.

## 1. Google Play Console Configuration
1. Your app must be uploaded as a signed AAB (Android App Bundle) to the Google Play Console (Internal Testing track is sufficient).
2. Go to **Monetize > Products > In-app products**.
3. Create your Coin Packages here.
    - e.g., Product ID: `coins_500`
    - Name: 500 Coins
    - Set your price.
4. Activate the products.

## 2. API & Service Account Configuration
To securely verify purchases on the backend (so users can't use fake hacking apps like Lucky Patcher to get free coins), you must verify the purchase token.
1. In Google Cloud Console, create a Service Account with access to the Google Play Android Developer API.
2. Download the `service-account.json` key file.
3. Keep this file secure on your production backend server.

## 3. Necessary Code Implementation
Once you have your Developer Account configured, you will need to:
1. Update `CoinPackage` database records (via Prisma Studio or an API) to include the `playStoreId` field (e.g., `coins_500`) matching your Play Console products.
2. In the React Native / Android Wrapper side (or using a PWA billing wrapper if supported), trigger the native `purchase()` flow.
3. Pass the resulting `purchaseToken` and `productId` to a new backend endpoint (e.g., `/api/payments/google-play/verify`).
4. In that endpoint, use the `googleapis` npm package along with your Service Account to hit the Google Play Developer API.
5. If Google's API returns `purchaseState === 0` (Purchased), execute an atomic database transaction that updates the `GooglePlayPurchase` table, acknowledges the purchase with Google, and increments the user's `Wallet.balance`.