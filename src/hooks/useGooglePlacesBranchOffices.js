import { useEffect, useRef, useCallback } from "react";

const useGooglePlacesBranchOffices = (formData, setFormData, inputRefs) => {
  const autocompleteRefs = useRef([]);
  
  const initializeAutocomplete = useCallback((index) => {
    if (!window.google) {
      console.warn("❌ Google API not available");
      return;
    }

    const inputElement = inputRefs.current[index]; // This is now the DOM element directly
    if (!inputElement) return;

    // Clear existing autocomplete if it exists
    if (autocompleteRefs.current[index]) {
      window.google.maps.event.clearInstanceListeners(inputElement);
    }

    const autocomplete = new window.google.maps.places.Autocomplete(inputElement, {
      fields: ["place_id", "formatted_address", "geometry"],
      types: ["establishment", "geocode"],
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      
      if (!place.formatted_address) {
        console.warn("No address found for selected place");
        return;
      }

      setFormData((prev) => {
        const updatedBranches = [...prev.branchLocations];
        updatedBranches[index] = place.formatted_address;
        return {
          ...prev,
          branchLocations: updatedBranches,
        };
      });
    });

    autocompleteRefs.current[index] = autocomplete;
  }, [inputRefs, setFormData]);

  useEffect(() => {
    if (!window.google) return;

    // Initialize autocomplete for all current branch inputs
    formData.branchLocations.forEach((_, index) => {
      if (inputRefs.current[index]) {
        initializeAutocomplete(index);
      }
    });

    // Cleanup function
    return () => {
      autocompleteRefs.current.forEach((autocomplete, index) => {
        if (autocomplete && inputRefs.current[index]) {
          window.google.maps.event.clearInstanceListeners(inputRefs.current[index]);
        }
      });
    };
  }, [formData.branchLocations.length, initializeAutocomplete]);

  return null;
};

export default useGooglePlacesBranchOffices;