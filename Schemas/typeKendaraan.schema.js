const { z } = require("zod");

const typeKendaraanSchema = z.object({
  id: z.string({
    required_error: "ID type kendaraan is required",
    invalid_type_error: "ID type kendaraan must be a string",
  }),
  nama_type_kendaraan: z.string({
    required_error: "Nama type kendaraan is required",
    invalid_type_error: "Nama type kendaraan must be a string",
  }),
  nama_type_kendaraan_eri: z.string({
    required_error: "Nama type kendaraan eri is required",
    invalid_type_error: "Nama type kendaraan eri must be a string",
  }),
  id_jenis_kendaraan: z.string({
    required_error: "ID jenis kendaraan is required",
    invalid_type_error: "ID jenis kendaraan must be a string",
  }),
  id_merk_kendaraan: z.string({
    required_error: "ID merk kendaraan is required",
    invalid_type_error: "ID merk kendaraan must be a string",
  }),
  kode_negara_asal: z.string({
    required_error: "Kode negara asal is required",
    invalid_type_error: "Kode negara asal must be a string",
  }),
});

module.exports = typeKendaraanSchema;
