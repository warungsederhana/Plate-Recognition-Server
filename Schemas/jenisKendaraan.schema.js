const { z } = require("zod");

const jenisKendaraanSchema = z.object({
  id: z.string({
    required_error: "ID jenis kendaraan is required",
    invalid_type_error: "ID jenis kendaraan must be a string",
  }),
  nama_jenis_kendaraan: z.string({
    required_error: "Nama jenis kendaraan is required",
    invalid_type_error: "Nama jenis kendaraan must be a string",
  }),
  kode_jenis_kendaraan: z.string({
    required_error: "Kode jenis kendaraan is required",
    invalid_type_error: "Kode jenis kendaraan must be a string",
  }),
  jumlah_sumbu: z.string({
    required_error: "Jumlah sumbu is required",
    invalid_type_error: "Jumlah sumbu must be a string",
  }),
  id_jenis_mapping: z
    .string({
      invalid_type_error: "ID jenis mapping must be a string",
    })
    .optional(),
  id_model_kendaraan: z
    .string({
      invalid_type_error: "ID model kendaraan must be a string",
    })
    .optional(),
  kategori_jenis: z.string({ invalid_type_error: "Kategori jenis must be a string" }).optional(),
});

module.exports = jenisKendaraanSchema;
