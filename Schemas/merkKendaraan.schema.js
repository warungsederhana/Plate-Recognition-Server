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
  kode_negara_asal: z.string({
    required_error: "Kode negara asal is required",
    invalid_type_error: "Kode negara asal must be a string",
  }),
});

module.exports = merkKendaraanSchema;
