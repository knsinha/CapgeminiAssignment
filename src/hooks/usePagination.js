import { useState, useMemo, useCallback } from 'react';
import logger from '../logger';

export function usePagination(items = [], itemsPerPage = 5) {
  const [currentPage, setCurrentPage] = useState(1);

  logger.debug('usePagination: Hook initialized', {
    itemCount: items.length,
    itemsPerPage,
  });

  const paginationData = useMemo(() => {
    try {
      const totalPages = Math.ceil(items.length / itemsPerPage);
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const currentItems = items.slice(startIndex, endIndex);

      logger.debug('usePagination: Pagination data computed', {
        currentPage,
        totalPages,
        itemsPerPage,
        currentItemsCount: currentItems.length,
      });

      return {
        currentPage,
        totalPages,
        currentItems,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
        startIndex: startIndex + 1,
        endIndex: Math.min(endIndex, items.length),
        totalItems: items.length,
      };
    } catch (error) {
      logger.error('usePagination: Error computing pagination', {
        error: error.message,
      });
      return {
        currentPage: 1,
        totalPages: 1,
        currentItems: [],
        hasNextPage: false,
        hasPreviousPage: false,
        startIndex: 0,
        endIndex: 0,
        totalItems: 0,
      };
    }
  }, [items, itemsPerPage, currentPage]);

  const goToPage = useCallback(
    (pageNumber) => {
      const maxPage = Math.ceil(items.length / itemsPerPage);
      if (pageNumber >= 1 && pageNumber <= maxPage) {
        logger.debug('usePagination: Navigating to page', { pageNumber });
        setCurrentPage(pageNumber);
      } else {
        logger.warn('usePagination: Invalid page number', {
          pageNumber,
          maxPage,
        });
      }
    },
    [items.length, itemsPerPage]
  );

  const nextPage = useCallback(() => {
    const maxPage = Math.ceil(items.length / itemsPerPage);
    if (currentPage < maxPage) {
      logger.debug('usePagination: Moving to next page', {
        from: currentPage,
        to: currentPage + 1,
      });
      setCurrentPage((prev) => prev + 1);
    }
  }, [currentPage, items.length, itemsPerPage]);

  const previousPage = useCallback(() => {
    if (currentPage > 1) {
      logger.debug('usePagination: Moving to previous page', {
        from: currentPage,
        to: currentPage - 1,
      });
      setCurrentPage((prev) => prev - 1);
    }
  }, [currentPage]);

  const reset = useCallback(() => {
    logger.debug('usePagination: Resetting to first page');
    setCurrentPage(1);
  }, []);

  return {
    ...paginationData,
    goToPage,
    nextPage,
    previousPage,
    reset,
  };
}