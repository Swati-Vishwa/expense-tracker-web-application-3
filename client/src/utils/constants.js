export const EXPENSE_CATEGORIES = [
  "Food", "Rent", "Transport", "Shopping", "Bills",
  "Health", "Entertainment", "Education", "Other",
];
export const INCOME_CATEGORIES = ["Salary", "Freelance", "Business", "Investment", "Gift", "Other"];
export const ALL_CATEGORIES = [...new Set([...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES])];