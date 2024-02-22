const { z } = require("zod");

const negaraAsalSchema = z.object({
  id: z.string({
    required_error: "ID negara asal is required",
    invalid_type_error: "ID negara asal must be a string",
  }),
  nama_negara: z.string({
    required_error: "Nama negara asal is required",
    invalid_type_error: "Nama negara asal must be a string",
  }),
  kode_negara: z.string({
    required_error: "Kode negara asal is required",
    invalid_type_error: "Kode negara asal must be a string",
  }),
});

module.exports = negaraAsalSchema;
