const { z } = require("zod");

const contactMessageSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email(),
  phone: z.string().trim().min(7).max(40),
  message: z.string().trim().min(5).max(1500)
});

module.exports = { contactMessageSchema };
