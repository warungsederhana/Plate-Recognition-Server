const { z } = require("zod");

const userSchema = z.object({
  id: z.string({
    required_error: "ID user is required",
    invalid_type_error: "ID user must be a string",
  }),

  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email("Email must be a valid email address"),

  nama: z.string({
    required_error: "Nama user is required",
    invalid_type_error: "Nama user must be a string",
  }),

  nik: z
    .string({
      invalid_type_error: "NIK must be a string",
    })
    .length(16, "NIK must be 16 characters long")
    .optional(),

  alamat: z
    .string({
      invalid_type_error: "Alamat must be a string",
    })
    .optional(),

  // Relationship

  id_kendaraan: z
    .array(
      z.string({
        invalid_type_error: "ID kendaraan must be a string",
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

  id_pembayaran_pajak: z
    .array(
      z.string({
        invalid_type_error: "ID pembayaran pajak must be a string",
      })
    )
    .optional(),
});

module.exports = userSchema;
