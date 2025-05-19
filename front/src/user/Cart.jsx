import React from "react";
import CartItems from "./CartItems";
import RightDivTop from "./RightDivTop";
import { useSelector, useDispatch } from "react-redux";

const Cart = () => {
  const customer = useSelector((state) => state.customer);
  const dispatch = useDispatch();
  //console.log("customer", customer);

  return (
    <div>
      <RightDivTop />
      {/* Customer Place */}
      <div className="border-b border-black text-sm">
        <div className="flex items-center justify-between px-4 py-4 space-x-5">
          <div className="flex flex-1 items-center justify-between text-white ">
            <div className="leading-none">
              <p className="text-md font-semibold">
                {customer.length > 0 ? customer[0]?.tableNum : "Table"}
              </p>
              <small className="p">
                {customer.length > 0 ? customer[0]?.name : "Customer name"}
              </small>
            </div>
            {/* <div className='flex items-center space-x-2'>Test</div> */}
          </div>
        </div>
      </div>
      <CartItems />
    </div>
  );
};

export default Cart;
