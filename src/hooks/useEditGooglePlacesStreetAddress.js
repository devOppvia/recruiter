import { useEffect, useRef, useCallback } from "react";


const useEditGooglePlacesStreetAddress = (formData, setFormData, inputRef) => {
    const autocompleteRef = useRef(null);

    const initializeAutocomplete = useCallback(() => {
        console.log("🧩 initializeAutocomplete called");
        if (!window.google) {
            console.warn("❌ Google API not available (window.google is undefined)");
            return;
        }

        if (!inputRef.current) {
            console.warn("❌ inputRef is not attached");
            return;
        }

        console.log("✅ Google and inputRef are available");

        if (autocompleteRef.current) {
            autocompleteRef.current.unbindAll?.();
            autocompleteRef.current = null;
        }



        autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
            fields: ["place_id", "name", "address_components", "geometry", "formatted_address"],
            types: ["establishment"],
            // componentRestrictions: { country: "ca" },
        });


        autocompleteRef.current.addListener("place_changed", () => {
            const place = autocompleteRef.current.getPlace();
            if (!place.geometry) return;

            setFormData(prev => {
                const updatedForm = {
                    ...prev,
                    headOfficeAddress: place.formatted_address || "",
                    city: "",
                    state: "",
                    country: "",
                    pincode: "",
                   
                };
 
                

                place.address_components.forEach((component) => {
                    const types = component.types;

                    if (types.includes("country")) {
                        updatedForm.country = component.long_name;
                    }

                    if (types.includes("locality")) {
                        updatedForm.city = component.long_name;
                    }

                    if (types.includes("administrative_area_level_1")) {
                        updatedForm.state = component.long_name;
                    }

                    if (types.includes("postal_code")) {
                        updatedForm.pincode = component.long_name;
                    }
                });

                return updatedForm;
            });

        });


    }, [formData, setFormData, inputRef]);

    useEffect(() => {
        console.log("📦 useEffect triggered");
        if (window.google && inputRef.current && !autocompleteRef.current) {
            initializeAutocomplete();
        }
    }, [initializeAutocomplete]);

    return { initializeAutocomplete };
};

export default useEditGooglePlacesStreetAddress;
