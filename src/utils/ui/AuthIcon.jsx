import React from 'react'

const AuthIcon = ({ icon }) => {
    const Icon = icon;
    return (
        <div className="absolute z-20 left-3 border border-[#DBE2EB] bg-white rounded-lg top-1/2 transform -translate-y-1/2 flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 text-[#172A41]">

            <Icon className={`sm:w-5 sm:h-5 w-4 h-4 object-contain `} />

        </div>
    )
}

export default AuthIcon
