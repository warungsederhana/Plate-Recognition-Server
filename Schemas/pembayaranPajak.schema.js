const { z } = require("zod");

const pembayaranPajakSchema = z.object({
  id: z.string({
    required_error: "ID pembayaran pajak is required",
    invalid_type_error: "ID pembayaran pajak must be a string",
  }),

  id_tagihan: z.string({
    required_error: "ID tagihan is required",
    invalid_type_error: "ID tagihan must be a string",
  }),

  jumlah_pembayaran: z.string({
    required_error: "Jumlah pembayaran is required",
    invalid_type_error: "Jumlah pembayaran must be a string",
  }),

  tanggal_pembayaran: z.date({
    required_error: "Tanggal pembayaran is required",
    invalid_type_error: "Tanggal pembayaran must be a date",
  }),
});

module.exports = pembayaranPajakSchema;
