export const formatDateYYYYMMDD = (date: Date): string => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0"); // Months are 0-based
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
};
