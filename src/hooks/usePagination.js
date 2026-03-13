import { useState, useEffect, useMemo } from 'react';

const usePagination = ({ 
  data = [], 
  initialItemsPerPage = 10, 
  initialPage = 1 
}) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  // Calculate pagination values
  const paginationData = useMemo(() => {
    const totalItems = data.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = data.slice(startIndex, endIndex);

    return {
      currentData,
      totalItems,
      totalPages,
      startIndex,
      endIndex,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    };
  }, [data, currentPage, itemsPerPage]);

  // Reset to first page when data length changes significantly
  useEffect(() => {
    // Only reset if current page is beyond available pages
    if (currentPage > paginationData.totalPages && paginationData.totalPages > 0) {
      setCurrentPage(1);
    }
  }, [data.length, paginationData.totalPages, currentPage]);

  // Reset to first page when items per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  // Handle page change
  const goToPage = (page) => {
    console.log('goToPage called with:', page, 'totalPages:', paginationData.totalPages);
    const pageNumber = Number(page);
    if (pageNumber >= 1 && pageNumber <= paginationData.totalPages) {
      setCurrentPage(pageNumber);
      console.log('Page changed to:', pageNumber);
    } else {
      console.log('Invalid page number:', pageNumber);
    }
  };

  // Handle next page
  const nextPage = () => {
    if (paginationData.hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  };

  // Handle previous page
  const previousPage = () => {
    if (paginationData.hasPreviousPage) {
      setCurrentPage(prev => prev - 1);
    }
  };

  // Handle items per page change
  const changeItemsPerPage = (newItemsPerPage) => {
    console.log('changeItemsPerPage called with:', newItemsPerPage);
    setItemsPerPage(Number(newItemsPerPage));
  };

  // Go to first page
  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  // Go to last page
  const goToLastPage = () => {
    setCurrentPage(paginationData.totalPages);
  };

  return {
    ...paginationData,
    currentPage,
    itemsPerPage,
    goToPage,
    nextPage,
    previousPage,
    changeItemsPerPage,
    goToFirstPage,
    goToLastPage,
  };
};

export default usePagination;