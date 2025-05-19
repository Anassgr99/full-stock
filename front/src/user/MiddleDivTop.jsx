import React from "react";
import Avatar from "react-avatar";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
const MiddleDivTop = ({ menuComp, sendBack }) => {
  const customer = useSelector((state) => state.customer);
  return (
    <div>
      <div className="flex text-white items-center justify-between border-b border-black pb-5 px-5">
        <div className="flex items-center  space-x-3 leading-none tracking-normal ">
          {customer.length > 0 ? (
            <svg
              onClick={sendBack}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6 cursor-pointer"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75"
              />
            </svg>
          ) : (
            <svg
              onClick={sendBack}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6 cursor-pointer"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75"
              />
            </svg>
          )}
          <div className="flex items-center space-x-6">
            <div>
              <motion.h3
                inital={{ x: 30 }}
                animate={{ x: 0 }}
                className="font-semibold"
              >
                {menuComp ? "Menus" : "STORES"}
              </motion.h3>
              <small className="text-xs text-gray-400 font-medium">
                {menuComp ? "Items" : "2 STORES"}
              </small>
            </div>
            {/* <div className='flex items-center space-x-6'>
                            <p className='bg-green-500 px-5 py-2 text-white'>0 Booked</p>
                            <p className='bg-green-800 px-8 py-2 text-white'>15 Vacant</p>
                        </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiddleDivTop;
