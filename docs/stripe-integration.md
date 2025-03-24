# Stripe Integration Guide

This document outlines how to implement Stripe for our marketplace platform, covering both seller onboarding via Stripe Connect and customer payment processing.

## Table of Contents

1. [Overview](#overview)
2. [Stripe Connect for Sellers](#stripe-connect-for-sellers)
3. [Customer Payment Processing](#customer-payment-processing)
4. [Handling Sensitive Data](#handling-sensitive-data)
5. [Testing](#testing)
6. [Going Live](#going-live)
7. [Resources](#resources)

## Overview

Our platform needs to handle two main payment flows:
1. **Sellers/Caterers**: Onboard through Stripe Connect to receive payments
2. **Customers**: Make payments for orders, with options to save payment methods

The key principle is that **no sensitive payment data should be stored in our database**. All payment information is handled and stored by Stripe.

## Stripe Connect for Sellers

Stripe Connect allows us to facilitate payments between customers and sellers while taking a platform fee.

### Implementation Steps

1. **Seller Onboarding**:
   - Create a Stripe Connect account for each seller
   - Use the Connect Onboarding flow to collect seller information
   - Store only the Stripe account ID (`stripe_account_id`) in your database

   ```javascript
   // Sample code for creating a Connect account
   const account = await stripe.accounts.create({
     type: 'express', // or 'standard' or 'custom' depending on your needs
     email: seller.email,
     capabilities: {
       card_payments: {requested: true},
       transfers: {requested: true},
     },
     business_type: 'individual', // or 'company'
     metadata: {
       seller_id: seller.id
     }
   });
   
   // Save only the account ID in your database
   await db.sellers.update({
     id: seller.id,
     stripe_account_id: account.id
   });
   ```

2. **Onboarding Link**:
   - Generate an onboarding link to allow sellers to complete their Stripe verification

   ```javascript
   const accountLink = await stripe.accountLinks.create({
     account: seller.stripe_account_id,
     refresh_url: `${YOUR_DOMAIN}/seller/stripe/refresh`,
     return_url: `${YOUR_DOMAIN}/seller/stripe/complete`,
     type: 'account_onboarding',
   });
   
   // Redirect the seller to this URL
   res.redirect(accountLink.url);
   ```

3. **Verification Webhook**:
   - Set up webhooks to be notified when a seller completes onboarding
   - Listen for `account.updated` events

   ```javascript
   app.post('/webhook', (req, res) => {
     const event = stripe.webhooks.constructEvent(
       req.body,
       req.headers['stripe-signature'],
       process.env.STRIPE_WEBHOOK_SECRET
     );
     
     if (event.type === 'account.updated') {
       const account = event.data.object;
       // Update seller status in your database
       if (account.details_submitted) {
         // The seller has completed onboarding
         await db.sellers.update({
           stripe_account_id: account.id,
           onboarding_complete: true
         });
       }
     }
     
     res.json({received: true});
   });
   ```

## Customer Payment Processing

There are two approaches for handling customer payments:

### 1. Payment Intents API (Recommended)

This approach gives you more control over the checkout flow while keeping it secure.

```javascript
// Creating a Payment Intent on your server
const paymentIntent = await stripe.paymentIntents.create({
  amount: calculateOrderAmount(order),
  currency: 'usd',
  payment_method_types: ['card'],
  application_fee_amount: calculateFee(order), // Your platform fee
  transfer_data: {
    destination: seller.stripe_account_id, // Automatically transfer to seller
  },
  metadata: {
    order_id: order.id,
    customer_id: customer.id
  }
});

// Return client_secret to your frontend
return { clientSecret: paymentIntent.client_secret };
```

On the frontend:
```javascript
const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
  payment_method: {
    card: cardElement,
    billing_details: {
      name: customer.name,
    },
  },
});
```

### 2. Checkout Sessions API

This approach uses Stripe's hosted checkout page.

```javascript
const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  line_items: [
    {
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Order #123',
        },
        unit_amount: amount,
      },
      quantity: 1,
    },
  ],
  mode: 'payment',
  success_url: `${YOUR_DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${YOUR_DOMAIN}/cancel`,
  payment_intent_data: {
    application_fee_amount: fee,
    transfer_data: {
      destination: seller.stripe_account_id,
    },
  },
});

// Redirect to checkout
res.redirect(session.url);
```

## Saving Payment Methods

To allow customers to save payment methods for future use:

1. **Setup Intents**:
   - Create a Setup Intent to securely collect and save payment details

   ```javascript
   const setupIntent = await stripe.setupIntents.create({
     customer: customer.stripe_customer_id, // Create this if it doesn't exist
     payment_method_types: ['card'],
   });
   
   // Return client_secret to your frontend
   return { clientSecret: setupIntent.client_secret };
   ```

2. **Creating Stripe Customers**:
   - Create a Stripe Customer object for each user who wants to save payment methods

   ```javascript
   // Create a customer in Stripe if they don't have one
   if (!user.stripe_customer_id) {
     const customer = await stripe.customers.create({
       email: user.email,
       name: user.name,
       metadata: {
         user_id: user.id
       }
     });
     
     // Save only the customer ID in your database
     await db.users.update({
       id: user.id,
       stripe_customer_id: customer.id
     });
   }
   ```

3. **Using Saved Payment Methods**:
   - Retrieve saved payment methods and allow customers to select one

   ```javascript
   // List saved payment methods
   const paymentMethods = await stripe.paymentMethods.list({
     customer: customer.stripe_customer_id,
     type: 'card',
   });
   
   // Use a saved payment method with Payment Intents
   await stripe.paymentIntents.create({
     amount: calculateOrderAmount(order),
     currency: 'usd',
     customer: customer.stripe_customer_id,
     payment_method: selectedPaymentMethodId,
     off_session: true, // Used for recurring or future payments
     confirm: true,
     // ... other options
   });
   ```

## Handling Sensitive Data

The key principle is that **no sensitive payment data ever touches your servers**:

1. **Use Stripe Elements** on the frontend to collect card information
2. **Use Payment Intents** to create an intent on your server, but handle the actual card data on the client side
3. **Store only reference IDs** in your database:
   - `stripe_customer_id` for customers
   - `stripe_account_id` for sellers
   - `payment_intent_id` for transactions
   - Last 4 digits of cards (for display purposes)

## Testing

Stripe provides extensive testing capabilities:

1. **Test Cards**: Use [Stripe's test cards](https://stripe.com/docs/testing#cards) to simulate various scenarios
2. **Test Webhooks**: Use the [Stripe CLI](https://stripe.com/docs/stripe-cli) to test webhooks locally
3. **Test Connect Accounts**: Create test Connect accounts without real identity verification

## Going Live

Before going live:

1. Switch from test to live API keys
2. Set up proper error handling and logging
3. Implement proper security measures (TLS, CORS, etc.)
4. Set up production webhooks
5. Test the entire flow in a staging environment

## Resources

- [Stripe API Documentation](https://stripe.com/docs/api)
- [Stripe Connect Documentation](https://stripe.com/docs/connect)
- [Stripe Elements Documentation](https://stripe.com/docs/js)
- [Stripe Payment Intents Guide](https://stripe.com/docs/payments/payment-intents)
- [Stripe Checkout Documentation](https://stripe.com/docs/payments/checkout)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
