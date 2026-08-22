const Stripe = require("stripe");

const createStripeClient = (stripeSecret) => (stripeSecret ? new Stripe(stripeSecret) : null);

module.exports = { createStripeClient };
