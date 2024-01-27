const { z } = require("zod");

const kendaraanSchema = z.object({
  id: z.string({
    required_error: "ID kendaraan is required",
    invalid_type_error: "ID kendaraan must be a string",
  }),

  id_user: z.string({
    required_error: "ID user is required",
    invalid_type_error: "ID user must be a string",
  }),

  nama: z.string({
    required_error: "Nama kendaraan is required",
    invalid_type_error: "Nama kendaraan must be a string",
  }),

  nama_pemilik: z.string({
    required_error: "Nama pemilik is required",
    invalid_type_error: "Nama pemilik must be a string",
  }),

  nama_pemilik_lama: z
    .string({
      invalid_type_error: "Nama pemilik lama must be a string",
    })
    .optional(),

  jenis: z.string({
    required_error: "Jenis kendaraan is required",
    invalid_type_error: "Jenis kendaraan must be a string",
  }),

  tipe: z.string({
    required_error: "Tipe kendaraan is required",
    invalid_type_error: "Tipe kendaraan must be a string",
  }),

  nomor_rangka: z.string({
    required_error: "Nomor rangka is required",
    invalid_type_error: "Nomor rangka must be a string",
  }),

  nomor_mesin: z.string({
    required_error: "Nomor mesin is required",
    invalid_type_error: "Nomor mesin must be a string",
  }),

  nomor_bpkb: z.string({
    required_error: "Nomor BPKB is required",
    invalid_type_error: "Nomor BPKB must be a string",
  }),

  nomor_polisi: z.string({
    required_error: "Nomor polisi is required",
    invalid_type_error: "Nomor polisi must be a string",
  }),

  warna: z.string({
    required_error: "Warna kendaraan is required",
    invalid_type_error: "Warna kendaraan must be a string",
  }),

  tahun_pembuatan: z.number({
    required_error: "Tahun pembuatan is required",
    invalid_type_error: "Tahun pembuatan must be a number",
  }),

  bahan_bakar: z.string({
    required_error: "Bahan bakar is required",
    invalid_type_error: "Bahan bakar must be a string",
  }),

  // Relationship

  id_recognition_log: z
    .array(
      z.string({
        invalid_type_error: "ID recognition log must be a string",
      })
    )
    .optional(),

  id_tagihan_pajak: z
    .array(
      z.string({
        invalid_type_error: "ID tagihan pajak must be a string",
      })
    )
    .optional(),
});

module.exports = kendaraanSchema;
