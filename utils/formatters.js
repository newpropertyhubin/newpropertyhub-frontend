// src/utils/formatters.js
export const formatCurrency = (amount) => {
  // यह एक सरल उदाहरण है
  return `₹ ${new Intl.NumberFormat('en-IN').format(amount)}`;
};
