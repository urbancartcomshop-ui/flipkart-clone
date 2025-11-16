# Render Environment Variables Setup

## Add UPI Payment Configuration to Render

Your payment system needs these environment variables to work on Render.

### Steps to Configure:

1. **Go to Render Dashboard**
   - Visit: https://dashboard.render.com
   - Find your service: `flipkart-store-2` (or similar)

2. **Navigate to Environment Variables**
   - Click on your service
   - Go to "Environment" tab on the left sidebar
   - Click "Add Environment Variable"

3. **Add These Variables:**

   **Variable 1:**
   ```
   Key:   UPI_ID
   Value: cc.9199915057220975@axisbank
   ```

   **Variable 2:**
   ```
   Key:   MERCHANT_NAME
   Value: Axis Bank Credit Card
   ```

4. **Save and Deploy**
   - Click "Save Changes"
   - Render will automatically redeploy with the new variables
   - Wait 2-3 minutes for deployment to complete

### Verify It's Working:

After deployment completes, test the payment:

1. Visit: `https://flipkart-store-2.onrender.com/payment.html`
2. Click "Pay with UPI"
3. Check if QR code shows your UPI ID: `cc.9199915057220975@axisbank`

### Important Notes:

- ✅ Environment variables are secure and not visible in your code
- ✅ Changes to env vars trigger automatic redeployment
- ✅ If UPI_ID is not set, it defaults to the value in code
- ⚠️ Without env vars, the hardcoded value `cc.9199915057220975@axisbank` will still work

Your payment system will work immediately since the UPI ID is already in the code as a default value!
