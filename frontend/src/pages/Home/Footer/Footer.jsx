import React from 'react';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-white py-12">
      <div className="container mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">
          Want us to email you with the latest blockbuster news?
        </h2>
        <div className="flex justify-center mb-8">
          <input
            type="email"
            placeholder="example@company.com"
            className="p-2 border border-gray-300 rounded-l-md focus:outline-none"
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded-r-md">
            Subscribe
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
          <div>
            <p className="text-gray-600 mb-4">
              Our experienced instructors will guide you through structured lessons, helping you develop a solid foundation while nurturing your creativity and musical expression.
            </p>
            <div className="flex space-x-4">
              <a href="#"><FaFacebook className="text-gray-600" size="24" /></a>
              <a href="#"><FaInstagram className="text-gray-600" size="24" /></a>
              <a href="#"><FaTwitter className="text-gray-600" size="24" /></a>
              <a href="#"><FaYoutube className="text-gray-600" size="24" /></a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Services</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600">Rock and Yoga</a></li>
              <li><a href="#" className="text-gray-600">Healthy Diet</a></li>
              <li><a href="#" className="text-gray-600">Fit to Health</a></li>
              <li><a href="#" className="text-gray-600">Exercise</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">About</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600">About</a></li>
              <li><a href="#" className="text-gray-600">Careers</a></li>
              <li><a href="#" className="text-gray-600">History</a></li>
              <li><a href="#" className="text-gray-600">Our Team</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600">FAQs</a></li>
              <li><a href="#" className="text-gray-600">Contact</a></li>
              <li><a href="#" className="text-gray-600">Live Chat</a></li>
            </ul>
          </div>
        </div>
        <div className="text-gray-600 mt-8">
          &copy; Company 2024. All rights reserved.
        </div>
        <div className="text-gray-600">
          Created by <a href="https://www.linkedin.com/in/nagesh-mane/" className="text-blue-500">Nagesh Mane</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
