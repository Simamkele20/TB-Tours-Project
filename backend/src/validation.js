const { z } = require("zod");

const contactMessageSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().min(7).max(40),
  message: z.string().min(5).max(1500)
});

module.exports = { contactMessageSchema };