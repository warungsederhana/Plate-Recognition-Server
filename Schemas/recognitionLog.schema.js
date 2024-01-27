import { z } from "zod";

const recognitionLogSchema = z.object({
  id: z.string({
    required_error: "ID recognition log is required",
    invalid_type_error: "ID recognition log must be a string",
  }),

  id_kendaraan: z.string({
    required_error: "ID kendaraan is required",
    invalid_type_error: "ID kendaraan must be a string",
  }),

  lat: z
    .number({
      invalid_type_error: "Latitude must be a number",
    })
    .optional(),

  lng: z
    .number({
      invalid_type_error: "Longitude must be a number",
    })
    .optional(),

  tanggal: z.date({
    required_error: "Tanggal is required",
    invalid_type_error: "Tanggal must be a date",
  }),

  image: z.string({
    required_error: "Image is required",
    invalid_type_error: "Image must be a string",
  }),
});

module.exports = recognitionLogSchema;
