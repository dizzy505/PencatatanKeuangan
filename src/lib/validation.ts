export interface ValidationError {
  field: string;
  message: string;
}

export const validateTransaction = (data: {
  tanggal?: string;
  kategori?: string;
  nominal?: string;
  keterangan?: string;
}): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!data.tanggal) {
    errors.push({ field: "tanggal", message: "Tanggal harus diisi" });
  } else {
    const date = new Date(data.tanggal);
    if (isNaN(date.getTime())) {
      errors.push({ field: "tanggal", message: "Tanggal tidak valid" });
    }
  }

  if (!data.kategori) {
    errors.push({ field: "kategori", message: "Kategori harus dipilih" });
  }

  if (!data.nominal) {
    errors.push({ field: "nominal", message: "Nominal harus diisi" });
  } else {
    const amount = parseFloat(data.nominal);
    if (isNaN(amount) || amount <= 0) {
      errors.push({ field: "nominal", message: "Nominal harus lebih dari 0" });
    }
  }

  if (data.keterangan && data.keterangan.length > 500) {
    errors.push({
      field: "keterangan",
      message: "Keterangan maksimal 500 karakter",
    });
  }

  return errors;
};

export const validateRecurringDate = (
  endDate: string | null,
  startDate: string,
): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end < start) {
      errors.push({
        field: "recurring_end_date",
        message: "Tanggal akhir harus lebih besar dari tanggal mulai",
      });
    }
  }

  return errors;
};
