const InputTabs = ({
  name,
  options,
  value,
  onChange,
  multiple = false,
  customBenefits = [],
  onDeleteCustomBenefit,
  showDeleteOption = false, // 👈 NEW optional prop
}) => {
  const handleToggle = (option) => {
    if (!multiple) {
      onChange(option);
      return;
    }

    // Multiple selection logic
    if (value.includes(option)) {
      onChange(value.filter((v) => v !== option));
    } else {
      onChange([...value, option]);
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      {options.map((option) => (
        <div key={option} className="relative">
          <label
            className={`flex relative items-center gap-1.5 sm:gap-2 px-3 py-2 rounded-[8px] cursor-pointer transition
              ${
                multiple
                  ? value.includes(option)
                    ? "bg-gradient-to-b from-[#2B5F60] to-[#245556] text-white border border-white/10 shadow-md shadow-black/10 before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/20 before:to-transparent before:opacity-100"
                    : "bg-white text-[#7E7E7E] border border-[#DBE2EB] hover:bg-gray-50"
                  : value === option
                  ? "bg-gradient-to-b from-[#2B5F60] to-[#245556] text-white border border-white/10 shadow-md shadow-black/10 before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/20 before:to-transparent before:opacity-100"
                  : "bg-white text-[#7E7E7E] border border-[#DBE2EB] hover:bg-gray-50"
              }
            `}
          >
            <input
              type={multiple ? "checkbox" : "radio"}
              name={name}
              value={option}
              checked={multiple ? value.includes(option) : value === option}
              onChange={() => handleToggle(option)}
              className="hidden"
            />

            {multiple ? (
              value.includes(option) ? (
                <svg
                  className="sm:w-6 sm:h-6 w-5 h-5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ) : (
                <span className="w-5 h-5 rounded-full border border-[#DBE2EB]"></span>
              )
            ) : value === option ? (
              <svg
                className="sm:w-6 sm:h-6 w-5 h-5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            ) : (
              <span className="w-5 h-5 rounded-full border border-[#DBE2EB]"></span>
            )}

            <span className="text-sm font-medium">{option}</span>
          </label>

          {/* 👇 Delete only if allowed + it's a custom benefit */}
          {showDeleteOption &&
            customBenefits.includes(option) &&
            onDeleteCustomBenefit && (
              <button
                type="button"
                onClick={() => onDeleteCustomBenefit(option)}
                className="absolute -top-1.5 -right-1.5 cursor-pointer bg-[#1e3a3b] border border-[#215052] text-white rounded-full w-4 h-4 flex items-center justify-center text-xs hover:bg-[#0c1c1d]"
                title="Delete"
              >
                ×
              </button>
            )}
        </div>
      ))}
    </div>
  );
};

export default InputTabs;
