import { Github, Linkedin, Twitter } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-primary-foreground text-primary py-6">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* First Section: General Links or Information */}
        <div className="mb-4 md:mb-0 md:mx-5">
          <h3 className="text-lg font-bold mb-2">Carpooling App</h3>
          <ul>
            <li className="my-2">
              <Link
                to="/"
                className="text-gray-500 hover:text-secondary-foreground"
              >
                About Us
              </Link>
            </li>
            <li className="my-2">
              <Link
                to="/"
                className="text-gray-500 hover:text-secondary-foreground"
              >
                FAQ
              </Link>
            </li>
            <li className="my-2">
              <Link
                to="/"
                className="text-gray-500 hover:text-secondary-foreground"
              >
                Contact Us
              </Link>
            </li>
            <li className="my-2">
              <Link
                to="/"
                className="text-gray-500 hover:text-secondary-foreground"
              >
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Second Section: Social Media Links */}
        <div className="flex justify-center md:justify-end items-center space-x-4 mx-5">
          <Link
            to=""
            className="flex flex-col items-center hover:text-sky-500 duration-200 ease-in-out"
          >
            <Twitter />
            <p>Twitter</p>
          </Link>
          <Link
            to=""
            className="flex flex-col items-center hover:text-gray-500 duration-200 ease-in-out"
          >
            <Github />
            <p>GitHub</p>
          </Link>
          <Link
            to=""
            className="flex flex-col items-center hover:text-sky-700 duration-200 ease-in-out"
          >
            <Linkedin />
            <p>LinkedIn</p>
          </Link>
        </div>
      </div>
      <div className="text-center mt-4 text-gray-400">
        &copy; {new Date().getFullYear()} Wheel Share App. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
