# 💳 Quick Stripe Payment Gateway Setup

## ⚡ 5-Minute Quick Start

### 1. Create Stripe Account
```
Visit: https://stripe.com/register
Sign up → Verify email → Done
```

### 2. Get API Keys
```
Login to Stripe Dashboard
→ Developers → API Keys
→ Copy Publishable Key (pk_test_...)
→ Copy Secret Key (sk_test_...)
```

### 3. Configure Netlify
```
Your Site → Site Settings → Build & Deploy → Environment
Add Variables:
  STRIPE_PUBLISHABLE_KEY = pk_test_...
  STRIPE_SECRET_KEY = sk_test_...
Redeploy
```

### 4. Test Payment
```
Go to: https://stardust.netlify.app
Click product → Buy Now
Select "Credit/Debit Card"
Use: 4242 4242 4242 4242
Expiry: 12/25, CVC: 123
Complete payment
```

### 5. Check Stripe Dashboard
```
Payments → Successful payment shown
Customers → Your customer listed
Payouts → When funds will arrive
```

---

## 🔐 Payment Flow Diagram

```
Customer          Your Website        Stripe API          Bank
    |                 |                   |               |
    |--Click Buy Now->|                   |               |
    |                 |<-Get Public Key---|               |
    |                 |                   |               |
    |<-Show Form------|                   |               |
    |                 |                   |               |
    |-Enter Card----->|                   |               |
    |                 |--Create Intent--->|               |
    |                 |<-Client Secret----|               |
    |                 |                   |               |
    |                 |--Confirm Payment->|               |
    |                 |                   |--Tokenize---->|
    |                 |<-Success---------|<-Auth--------|
    |                 |                   |               |
    |<-Success Msg----|                   |               |
    |                 |                   |               |
    |                 |--Verify Payment-->|               |
    |                 |<-Confirmed--------|               |
    |                 |                   |               |
    |<-Order Confirmed|                   |               |
```

---

## 💰 Money Flow

```
Customer Payment
      ↓
Stripe Processing
      ↓
2.9% + ₹30 Fee (Stripe keeps)
      ↓
Remaining Amount
      ↓
Your Stripe Account (2-3 days)
      ↓
Bank Transfer (when you withdraw)
      ↓
Your Bank Account
```

---

## 🧪 Test Cards

| Card Number | Type | Result |
|---|---|---|
| 4242 4242 4242 4242 | Visa | ✅ Success |
| 5555 5555 5555 4444 | Mastercard | ✅ Success |
| 4000 0000 0000 0002 | Visa | ❌ Decline |
| 3782 822463 10005 | Amex | ✅ Success |

**Expiry**: Any future date (e.g., 12/25)  
**CVC**: Any 3 digits (e.g., 123)

---

## 📍 Environment Variables

**.env (Local Testing)**
```env
STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_key_here
PORT=3000
NODE_ENV=development
```

**Netlify (Production)**
```
Site Settings → Build & Deploy → Environment
Add variables above
Redeploy site
```

---

## ✅ Checklist

- [ ] Stripe account created
- [ ] Publishable key copied
- [ ] Secret key copied
- [ ] Keys added to Netlify
- [ ] Site redeployed
- [ ] Test payment completed (card: 4242 4242 4242 4242)
- [ ] Payment shown in Stripe Dashboard
- [ ] Switched to live mode (when ready)
- [ ] Live keys configured
- [ ] Site redeployed with live keys

---

## 🔗 Useful Links

- **Stripe Dashboard**: https://dashboard.stripe.com
- **API Documentation**: https://stripe.com/docs/api
- **Support**: https://support.stripe.com
- **Your Repo**: https://github.com/urbancartcomshop-ui/flipkart-clone

---

## ❓ Quick FAQ

**Q: Is my customer's card data safe?**  
A: Yes! Stripe is PCI compliant. Card data never touches your server.

**Q: How do I get money?**  
A: Go to Stripe Dashboard → Payouts → Request payout to your bank

**Q: What are the fees?**  
A: 2.9% + ₹30 per transaction (you don't pay, customer pays)

**Q: How long for money to arrive?**  
A: 2-3 business days to Stripe account, then same day if you withdraw

**Q: Can I test payments?**  
A: Yes! Use test cards above in test mode before going live

**Q: How do I go live?**  
A: In Stripe Dashboard, switch from Test Mode to Live Mode, get live keys, update Netlify, deploy

---

## 🎯 Your Customer's Payment Experience

1. **Customer sees product** at ₹299
2. **Clicks "Buy Now"**
3. **Enters email** for receipt
4. **Selects payment method** (Card, UPI, etc.)
5. **Enters card details** (4242 4242 4242 4242)
6. **Sees "Processing..."**
7. **Gets ✅ Success message**
8. **Receives email receipt** from Stripe
9. **Product added to cart**
10. **Money goes to your account** 💰

---

🚀 **You're all set! Start accepting payments today!**
