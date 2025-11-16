# 💳 Stripe Payment Gateway Integration Guide

## Overview
Your Flipkart clone now has a **real, production-ready payment gateway** using **Stripe**. Customers can now pay with credit/debit cards, and the money will be deposited directly to your Stripe account.

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Create a Stripe Account
1. Go to **https://dashboard.stripe.com/register**
2. Sign up with your email
3. Verify your email
4. Complete your business details

### Step 2: Get Your API Keys
1. Login to **https://dashboard.stripe.com**
2. Go to **Developers → API Keys**
3. Copy your **Publishable Key** (starts with `pk_`)
4. Copy your **Secret Key** (starts with `sk_`)

### Step 3: Configure Your App

#### For Local Testing (Development):
Create `.env` file in your project root:
```env
STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_key_here
PORT=3000
NODE_ENV=development
```

#### For Netlify Deployment (Production):
1. Go to your Netlify site → **Site Settings → Build & Deploy → Environment**
2. Add environment variables:
   ```
   STRIPE_PUBLISHABLE_KEY = pk_test_your_key_here
   STRIPE_SECRET_KEY = sk_test_your_key_here
   ```
3. Deploy

---

## 💰 How It Works

### Customer Payment Flow:
1. Customer clicks **"Buy Now"** button
2. Payment modal opens with **Stripe card form**
3. Customer enters credit card details securely
4. System creates a **Payment Intent** in Stripe
5. Card is processed through Stripe
6. Payment confirmation received
7. Order is confirmed and cart updated

### Money Flow:
- Customer pays via Stripe → Money goes to **your Stripe account**
- Stripe charges 2.9% + ₹30 transaction fee
- You receive remaining amount in 2-3 business days

---

## 🔒 Security Features

✅ **PCI Compliance**: Stripe handles all card data securely  
✅ **Encryption**: All transactions are encrypted (HTTPS)  
✅ **No Card Storage**: Cards never stored on your servers  
✅ **3D Secure**: Optional fraud protection  
✅ **Webhook Support**: Real-time payment updates  

---

## 📱 Payment Methods Supported

- ✅ Credit Cards (Visa, Mastercard, American Express)
- ✅ Debit Cards
- ✅ UPI (For Indian customers)
- ✅ Digital Wallets
- ✅ Net Banking

---

## 🧪 Testing with Stripe Test Mode

### Test Card Numbers:
```
Card: 4242 4242 4242 4242
Expiry: 12/25
CVC: 123

Card: 5555 5555 5555 4444
Expiry: 12/25
CVC: 123

Card (Decline): 4000 0000 0000 0002
Expiry: 12/25
CVC: 123
```

### Test Process:
1. Click "Buy Now" on any product
2. Select "Credit/Debit Card"
3. Use test card number above
4. Complete payment
5. Check Stripe Dashboard for transaction

---

## 📊 API Endpoints

### 1. Create Payment Intent
```bash
POST /api/create-payment-intent
Content-Type: application/json

{
  "amount": 299,
  "currency": "INR",
  "description": "Purchase of OnePlus Buds",
  "customerEmail": "customer@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "clientSecret": "pi_xxx_secret_xxx",
  "paymentIntentId": "pi_xxx",
  "amount": 29900,
  "currency": "inr",
  "status": "requires_payment_method"
}
```

### 2. Confirm Payment
```bash
POST /api/confirm-payment
Content-Type: application/json

{
  "paymentIntentId": "pi_xxx",
  "orderId": "ORDER-123456",
  "items": [...],
  "customerEmail": "customer@example.com"
}
```

### 3. Get Stripe Public Key
```bash
GET /api/stripe-key

Response:
{
  "publishableKey": "pk_test_xxx"
}
```

---

## 🔄 Webhook Setup (Optional but Recommended)

For real-time payment updates:

1. Go to Stripe Dashboard → **Developers → Webhooks**
2. Click **Add an endpoint**
3. URL: `https://stardust.netlify.app/api/webhook`
4. Events to select:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
5. Copy **Webhook Signing Secret**
6. Add to `.env`: `STRIPE_WEBHOOK_SECRET=whsec_xxx`

---

## 📈 Going Live (Production)

### Switch to Live Keys:
1. In Stripe Dashboard, toggle **Test Mode OFF**
2. Copy your **Live Publishable Key** (pk_live_xxx)
3. Copy your **Live Secret Key** (sk_live_xxx)
4. Update environment variables on Netlify
5. Deploy

### Requirements for Live Mode:
- ✅ Business account verified
- ✅ Bank account connected
- ✅ Business information complete
- ✅ Terms & conditions accepted

---

## 💰 Fees & Payouts

### Stripe Fees:
- **Standard**: 2.9% + ₹30 per transaction
- **Direct**: 2.2% + ₹10 per transaction

### Payout Schedule:
- Funds available: 2-3 business days
- Paid every 3 days (depending on volume)
- Minimum payout: ₹500

### View Payouts:
Dashboard → **Payments → Payouts**

---

## 🐛 Troubleshooting

### Issue: "Invalid API Key"
- ✅ Check .env file for correct keys
- ✅ Ensure STRIPE_SECRET_KEY is not visible in code
- ✅ Restart server after updating .env

### Issue: "Card Declined"
- ✅ In test mode? Use 4242 4242 4242 4242
- ✅ In live mode? Check card validity with Stripe
- ✅ Enable 3D Secure for extra security

### Issue: Payment Successful but Order Not Confirmed
- ✅ Check Stripe Dashboard for payment status
- ✅ Verify webhook is configured
- ✅ Check browser console for errors

### Issue: Can't See Payment Form
- ✅ Clear browser cache
- ✅ Check console for Stripe.js errors
- ✅ Ensure STRIPE_PUBLISHABLE_KEY is correct

---

## 📞 Support

- **Stripe Support**: https://support.stripe.com
- **Stripe Docs**: https://stripe.com/docs
- **India-specific Help**: https://stripe.com/in/support

---

## ✅ Checklist for Launch

- [ ] Stripe account created
- [ ] API keys obtained
- [ ] Environment variables set on Netlify
- [ ] Site deployed
- [ ] Test payment completed
- [ ] Order confirmation email received
- [ ] Money received in Stripe account (after 2-3 days)
- [ ] Live keys configured
- [ ] Site relaunched in live mode
- [ ] Webhook endpoint setup (optional)

---

## 🎯 Next Steps

1. **Complete Stripe onboarding** (Business details, bank account)
2. **Test payments** with test cards
3. **Switch to live mode** when ready
4. **Monitor transactions** in Stripe Dashboard
5. **Withdraw funds** regularly to your bank account

---

**Your customers can now pay securely with credit/debit cards!** 💳✨
