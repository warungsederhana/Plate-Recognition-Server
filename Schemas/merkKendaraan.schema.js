const { z } = require("zod");

const merkKendaraanSchema = z.object({
  id: z.string({
    required_error: "ID merk kendaraan is required",
    invalid_type_error: "ID merk kendaraan must be a string",
  }),
  nama_merk: z.string({
    required_error: "Nama merk kendaraan is required",
    invalid_type_error: "Nama merk kendaraan must be a string",
  }),
  id_negara_asal: z.string({
    required_error: "ID negara asal is required",
    invalid_type_error: "ID negara asal must be a string",
  }),
});

module.exports = merkKendaraanSchema;
