const CURRENCY = "INR";
const LOCALE = "en-IN";

export const formatCurrency = (n) =>
  new Intl.NumberFormat(LOCALE, { style: "currency", currency: CURRENCY }).format(n ?? 0);

const parseDate = (value) => {
  if (!value) return null; 
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
};

export const formatDate = (iso) => {
  const d = parseDate(iso);
  return d
    ? d.toLocaleDateString("en-GB", {
      day: "2-digit", month: "short", year: "numeric", timeZone: "UTC",
    })
    : "—";
};

export const toInputDate = (iso) => {
  const d = parseDate(iso);
  return d ? d.toISOString().slice(0, 10) : todayInput();
};

export const todayInput = () => {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};


export const formatMonth = (key) => {
  const [y, m] = key.split("-");
  return new Date(Date.UTC(Number(y), Number(m) - 1, 1)).toLocaleDateString("en-GB", {
    month: "short", year: "2-digit", timeZone: "UTC",
  });
};