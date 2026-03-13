import { useState, useEffect, useCallback } from 'react';

const useApiPagination = ({ 
  initialItemsPerPage = 9, 
  initialPage = 1,
  dependencies = [] // Dependencies that should trigger API refetch
}) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
  const [paginationInfo, setPaginationInfo] = useState({
    totalItems: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  // Reset to first page when dependencies change (filters, search, etc.)
  useEffect(() => {
    setCurrentPage(1);
  }, dependencies);

  // Handle page change
  const goToPage = useCallback((page) => {
    if (page >= 1 && page <= paginationInfo.totalPages) {
      setCurrentPage(page);
    }
  }, [paginationInfo.totalPages]);

  // Handle next page
  const nextPage = useCallback(() => {
    if (paginationInfo.hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  }, [paginationInfo.hasNextPage]);

  // Handle previous page
  const previousPage = useCallback(() => {
    if (paginationInfo.hasPrevPage) {
      setCurrentPage(prev => prev - 1);
    }
  }, [paginationInfo.hasPrevPage]);

  // Handle items per page change
  const changeItemsPerPage = useCallback((newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  }, []);

  // Go to first page
  const goToFirstPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  // Go to last page
  const goToLastPage = useCallback(() => {
    setCurrentPage(paginationInfo.totalPages);
  }, [paginationInfo.totalPages]);

  // Update pagination info from API response
  const updatePaginationInfo = useCallback((apiPaginationData) => {
    setPaginationInfo({
      totalItems: apiPaginationData.totalItems || 0,
      totalPages: apiPaginationData.totalPages || 0,
      hasNextPage: apiPaginationData.hasNextPage || false,
      hasPrevPage: apiPaginationData.hasPrevPage || false
    });
  }, []);

  return {
    currentPage,
    itemsPerPage,
    ...paginationInfo,
    goToPage,
    nextPage,
    previousPage,
    changeItemsPerPage,
    goToFirstPage,
    goToLastPage,
    updatePaginationInfo
  };
};

export default useApiPagination;