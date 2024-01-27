const { z } = require("zod");

const tagihanPajakSchema = z.object({
  id: z.string({
    required_error: "ID tagihan pajak is required",
    invalid_type_error: "ID tagihan pajak must be a string",
  }),

  id_kendaraan: z.string({
    required_error: "ID kendaraan is required",
    invalid_type_error: "ID kendaraan must be a string",
  }),

  id_user: z.string({
    required_error: "ID user is required",
    invalid_type_error: "ID user must be a string",
  }),

  jumlah_tagihan: z.string({
    required_error: "Jumlah tagihan is required",
    invalid_type_error: "Jumlah tagihan must be a string",
  }),

  tanggal_terbit: z.date({
    required_error: "Tanggal terbit is required",
    invalid_type_error: "Tanggal terbit must be a date",
  }),

  tanggal_jatuh_tempo: z.date({
    required_error: "Tanggal jatuh tempo is required",
    invalid_type_error: "Tanggal jatuh tempo must be a date",
  }),

  status: z.string({
    required_error: "Status is required",
    invalid_type_error: "Status must be a string",
  }),
});

module.exports = tagihanPajakSchema;
