import React from "react";

const Loader = () => {
  return (
    <div className="flex justify-center items-center  min-h-screen">
      <div className="flex space-x-2">
        <div className="w-4 h-4 bg-gray-700 rounded-full animate-bounce delay-100"></div>
        <div className="w-4 h-4 bg-gray-700 rounded-full animate-bounce delay-200"></div>
        <div className="w-4 h-4 bg-gray-700 rounded-full animate-bounce delay-300"></div>
      </div>
    </div>
  );
};

export default Loader;
