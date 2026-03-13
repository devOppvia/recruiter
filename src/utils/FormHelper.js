// Helper function
export const saveFormData = (step, data) => {
  localStorage.setItem(step, JSON.stringify(data));
};

// Helper to load
export const loadFormData = (step) => {
  const saved = localStorage.getItem(step);
  return saved ? JSON.parse(saved) : null;
};


