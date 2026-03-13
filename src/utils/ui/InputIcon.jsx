import React from 'react'

const InputIcon = ({ icon }) => {
    const Icon = icon;
    return (
        <div className="absolute left-3 border border-[#DBE2EB] bg-white rounded-lg top-1/2 transform -translate-y-1/2 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 text-gray-400">

            <Icon className={`w-4 h-4 object-contain `} />

        </div>
    )
}

export default InputIcon
