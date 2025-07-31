import Invoice from "../models/Invoice";

export const generateInvoiceId = async (): Promise<string> => {
  const count = await Invoice.countDocuments();
  const nextNumber = count + 1;
  const padded = String(nextNumber).padStart(5, "0");

  return `INV-${padded}`;
};
