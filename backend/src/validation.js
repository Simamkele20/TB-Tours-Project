const { z } = require("zod");

const bookingSchema = z.object({
  fullName: z.string().trim().min(2),
  email: z.string().trim().email(),
  phone: z.string().trim().min(7),
  pickupLocation: z.string().trim().min(2),
  dropoffLocation: z.string().trim().min(2),
  travelDate: z.string().trim().min(4),
  passengers: z.number().int().min(1).max(60),
  serviceId: z.string().trim().min(2),
  notes: z.string().trim().max(1000).optional().default("")
});

const contactMessageSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email(),
  phone: z.string().trim().min(7).max(40),
  service: z.string().trim().min(2).max(120).optional(),
  message: z.string().trim().min(5).max(1500)
});

module.exports = { bookingSchema, contactMessageSchema };
