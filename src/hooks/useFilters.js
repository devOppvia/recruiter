import { useSelector, useDispatch } from 'react-redux'


import { selectAppliedFilters,
  selectFilterOptions,
  selectTotalAppliedFilters,
  selectTotalResults,
  selectFilterLoading,
  setAppliedFilters,
  addFilter,
  removeFilter,
  clearAllFilters,
  clearFiltersByType,
  setTotalResults,
  setFilterLoading,
  setDefaultFilters } from '../redux/features/filterSlice/filterSlice'

export const useFilters = () => {
  const dispatch = useDispatch()
  const appliedFilters = useSelector(selectAppliedFilters)
  const filterOptions = useSelector(selectFilterOptions)
  const totalAppliedFilters = useSelector(selectTotalAppliedFilters)
  const totalResults = useSelector(selectTotalResults)
  const isLoading = useSelector(selectFilterLoading)

  // Helper function to check if a specific filter is applied
  const hasFilter = (type, value) => {
    return appliedFilters[type].includes(value)
  }

  // Helper function to get all filters as a query string
  const getFilterQueryString = () => {
    const params = new URLSearchParams()
    
    Object.entries(appliedFilters).forEach(([key, values]) => {
      if (values.length > 0) {
        params.append(key, values.join(','))
      }
    })
    
    return params.toString()
  }

  // Helper function to get active filters count by type
  const getFilterCountByType = (type) => {
    return appliedFilters[type].length
  }

  return {
    // State
    appliedFilters,
    filterOptions,
    totalAppliedFilters,
    totalResults,
    isLoading,
    
    // Actions
    setFilters: (filters) => dispatch(setAppliedFilters(filters)),
    addFilter: (type, value) => dispatch(addFilter({ type, value })),
    removeFilter: (type, value) => dispatch(removeFilter({ type, value })),
    clearAllFilters: () => dispatch(clearAllFilters()),
    clearFiltersByType: (type) => dispatch(clearFiltersByType(type)),
    setTotalResults: (count) => dispatch(setTotalResults(count)),
    setFilterLoading: (loading) => dispatch(setFilterLoading(loading)),
    setDefaultFilters: () => dispatch(setDefaultFilters()),
    
    // Helper functions
    hasFilter,
    getFilterQueryString,
    getFilterCountByType
  }
}