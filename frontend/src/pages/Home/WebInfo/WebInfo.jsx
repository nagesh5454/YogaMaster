import React from 'react';

const WebInfo = () => {
  return (
    <div className="bg-blue-800 text-white py-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
        <div>
          <h2 className="text-4xl font-bold">35M+</h2>
          <p className="mt-2 text-lg">Visitor</p>
        </div>
        <div>
          <h2 className="text-4xl font-bold">5M+</h2>
          <p className="mt-2 text-lg">Subscriber</p>
        </div>
        <div>
          <h2 className="text-4xl font-bold">950k+</h2>
          <p className="mt-2 text-lg">Students</p>
        </div>
        <div>
          <h2 className="text-4xl font-bold">90%</h2>
          <p className="mt-2 text-lg">Success stories</p>
        </div>
      </div>
    </div>
  );
};

export default WebInfo;
