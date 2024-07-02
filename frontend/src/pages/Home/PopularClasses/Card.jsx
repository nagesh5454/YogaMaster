
import React from 'react';
import {Link} from "react-router-dom";

const Card = (props) => {
  console.log(props);
  const { item } = props;
  const { _id, name, image, availableSeats, price, totalEnrolled } = item;

  return (
    <div className='shadow-lg rounded-lg p-3 flex flex-col justify-between border border-secondary overflow-hidden m-4'>
      <img src={image} alt={name} />
      <div className='p-4'>
        <h2 className='text-xl font-semibold mb-2 dark:text-white'>{name}</h2>
        <p className='text-gray-600 mb-2'>Available Seats: {availableSeats}</p>
        <p className='text-gray-600 mb-2'>Price: {price}</p>
        <p className='text-gray-600 mb-2'>Total Students: {totalEnrolled}</p>
        <Link to={`class/${_id}`} className='text-center '>
          <button className='px-2 w-full py-1 bg-secondary rounded-xl text-white font-bold mt-2'>Select Course</button>
        </Link>
      </div>
    </div>
  );
};

export default Card;
