# Zakhmi Mahi - Manual Payment Setup Guide

This guide details how to configure manual payments (JazzCash & Easypaisa) within the Zakhmi Mahi Admin Panel.

## Configuring Settings in the Admin Panel
1. Log in to the Zakhmi Mahi application using an account that has `ADMIN` role privileges.
2. Navigate to the **Admin Panel** (`/admin`).
3. Click on **Settings** in the top navigation toggle.
4. You will see configuration blocks for both **JazzCash** and **Easypaisa**.

### To Enable a Payment Method:
- Check the box labeled **Enable JazzCash** or **Enable Easypaisa**.
- Enter your **Account Name** (e.g., *Ali Raza*).
- Enter your **Account Number** (e.g., *03001234567*).
- Click **Save Payment Settings** at the bottom of the page.

*Note: As soon as a payment method is checked and saved, it will dynamically appear on the user's Recharge screen (`/recharge`). Conversely, unchecking it will hide it from the users immediately.*

## Managing Manual Payment Requests
When a user submits a manual payment through the app, they must provide the amount, transaction ID (TID) from their SMS, and upload a screenshot of the receipt.

1. In the Admin Panel, click on **Payments**.
2. This screen will list all requests, with the newest at the top.
3. Review the uploaded screenshot and verify that the TID matches the one they provided, and that the money has arrived in your actual JazzCash/Easypaisa account.
4. Click **Approve** or **Reject**:
    - **Approve:** Will securely process an atomic database transaction that increases the user's coin wallet balance by the requested package amount.
    - **Reject:** Will decline the transaction. The user receives no coins.
*Note: Due to database safety measures, duplicate Transaction IDs are rejected at the time of submission by the user to prevent double-charging or double-crediting.*
