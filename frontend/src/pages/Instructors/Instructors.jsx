import React, { useEffect, useState } from 'react';
import useAxiosFetch from '../../hooks/useAxiosFetch';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';
import Footer from '../Home/Footer/Footer';

const Instructors = () => {
  const [instructors, setInstructors] = useState([]);
  const AxiosFetch = useAxiosFetch();

  useEffect(() => {
    AxiosFetch.get('/users')
      .then((data) => {
        setInstructors(data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  console.log(instructors);
  return (

    <>
    <div className="md:w-[80%] mx-auto my-36">
    <div>
      <h1 className="text-5xl font-bold text-center">
        Our <span className="text-secondary">Best</span> Instructors
      </h1>
      <div className="w-[40%] text-center mx-auto my-4">
        <p className="text-gray-500">
          Explore Our Popular Classes. Here are some popular classes based on how many students enrolled.
        </p>
      </div>
    </div>

    {instructors.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {instructors.map((instructor, i) => (
          <div key={i} className="border p-4 rounded-lg shadow-lg">
            {instructor && instructor.photoUrl ? (
              <img
                src={instructor.photoUrl}
                alt={`${instructor.name}'s photo`}
                className="rounded-full border-4 border-gray-300 h-24 w-24 mx-auto"
              />
            ) : (
              <div className="w-full h-96 bg-gray-200 rounded-t-lg flex items-center justify-center">
                No Image
              </div>
            )}
            <div className="p-4 text-center">
              <h2 className="font-medium text-lg dark:text-white">Name: {instructor.name}</h2>
              <p className="font-medium text-lg dark:text-white">Email: {instructor.email}</p>
              <p className="font-medium text-lg dark:text-white">Address: {instructor.address}</p>
              <p className="font-medium text-lg dark:text-white">Phone: {instructor.phone}</p>
              <div className="flex justify-center mt-4 space-x-4">
                {instructor.socialMedia && instructor.socialMedia.facebook && (
                  <a href={instructor.socialMedia.facebook} target="_blank" rel="noopener noreferrer">
                    <FaFacebook className="text-blue-600" />
                  </a>
                )}
                {instructor.socialMedia && instructor.socialMedia.twitter && (
                  <a href={instructor.socialMedia.twitter} target="_blank" rel="noopener noreferrer">
                    <FaTwitter className="text-blue-400" />
                  </a>
                )}
                {instructor.socialMedia && instructor.socialMedia.linkedin && (
                  <a href={instructor.socialMedia.linkedin} target="_blank" rel="noopener noreferrer">
                    <FaLinkedin className="text-blue-700" />
                  </a>
                )}
                {instructor.socialMedia && instructor.socialMedia.instagram && (
                  <a href={instructor.socialMedia.instagram} target="_blank" rel="noopener noreferrer">
                    <FaInstagram className="text-pink-600" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center">
        <p className="text-gray-600 mb-2">No instructors available</p>
      </div>
    )}
  </div>
   <section className='mt-10'>
   <Footer/>

   </section>
 
  </>
  
  )
}

export default Instructors;
