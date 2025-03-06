export const generatePages = (totalPages: number, currentPage: number) => {
  const pages: (number | string)[] = [];
  const maxVisibleButtons = 5;
  if (totalPages <= maxVisibleButtons) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    if (currentPage <= 3) {
      for (let i = 1; i <= 5; i++) pages.push(i);
      pages.push("...");
      pages.push(totalPages);
    } else if (currentPage > 3 && currentPage < totalPages - 2) {
      pages.push(1, "...");
      pages.push(currentPage - 1, currentPage, currentPage + 1);
      pages.push("...");
      pages.push(totalPages);
    } else {
      pages.push(1, "...");
      for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
    }
  }
  return pages;
};
