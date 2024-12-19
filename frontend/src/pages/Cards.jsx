import React from 'react'
import Navbar from '../components/Navbar'

const Cards = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            {/* <div className="py-8"> */}
            <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white ml-8 mt-5">
                {/* <img
                        className="w-full"
                        src="https://via.placeholder.com/400x200"
                        alt="Placeholder"
                    /> */}
                <div className="px-6 py-4">
                    <div className="font-bold text-xl mb-2">Card Title</div>
                    <p className="text-gray-700 text-base">
                        This is a basic card example in Tailwind CSS. Add content here.
                    </p>
                </div>
                <div className="px-6 pt-4 pb-2">
                    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                        #Example
                    </span>
                    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                        #TailwindCSS
                    </span>
                </div>
            </div>
            {/* </div> */}
        </div>

    )
}

export default Cards
