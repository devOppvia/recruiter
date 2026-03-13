import React from 'react'

const IconCircle = ({ icon }) => {
    const Icon = icon;
    return (
        <div className="border border-[#DBE2EB] bg-white rounded-lg  flex items-center justify-center w-7 h-7 sm:w-7 sm:h-7 text-gray-400">

            <Icon className={`w-4 h-4 object-contain text-[#25314C] `} />

        </div>
    )
}

export default IconCircle
