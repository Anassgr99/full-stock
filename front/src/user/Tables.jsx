import React, { useEffect, useState, Fragment, useRef } from "react";
import { motion } from "framer-motion";
import { Dialog, Transition } from "@headlessui/react";
import { UserIcon } from "@heroicons/react/24/outline";
import { useDispatch } from "react-redux";
import { addCustomer } from "./store/customerSlice";
import axios from "axios";

const Tables = ({ onClick }) => {
  const [tables, setTables] = useState([]); // Store fetched tables here
  const dispatch = useDispatch();
  const [selectedId, setSelectedId] = useState(null);
  const [customers, setCustomers] = useState([]); // Store customers list
  const [selectedCustomer, setSelectedCustomer] = useState(null); // Store selected customer
  const [open, setOpen] = useState(false); // Modal open state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const bgarr = [
    "#203688",
    "#5b45b0",
    "#8a9dad",
    "#1d2569",
    "#EB6440",
    "#f987c4",
    "#4C0033",
    "#434242",
    "#5b45b0",
    "#1d2569",
    "#00a183",
    "#3C2A21",
    "#7F167F",
    "#9C254D",
    "#735F32",
    "#285430",
  ];
  //console.log("tables", tables);

  const customerDetails = {
    name: name,
    phone: phone,
    email: email,
    tableNum: tables[selectedId]?.store_name,
    idStoreSelected: tables[selectedId]?.id,
  };
  //console.log("customerDetails", customerDetails);

  const cancelButtonRef = useRef(null);

  const allEvents = (id) => {
    setOpen(true);
    setSelectedId(id);
    fetchCustomers();
  };

  const next = () => {
    if (tables) {
      const selectedCustomerDetails = {
        ...tables,
        tableNum: tables[selectedId]?.store_name,
        idStoreSelected: tables[selectedId]?.id,
      };

      // Save the selected customer details in Redux
      dispatch(addCustomer(selectedCustomerDetails));

      // Save the selected customer details in localStorage
      localStorage.setItem(
        "selectedStore",
        JSON.stringify(selectedCustomerDetails)
      );

      // Call onClick handler and close the modal
      onClick();
      setOpen(false);
    } else {
      //console.error("No customer selected!");
    }
  };

  // Fetch tables from the backend
  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await axios.get("https://api.simotakhfid.ma:3000/api/stores");
        setTables(response.data); // Assuming the backend returns a list of tables
      } catch (error) {
        //console.error("Error fetching table data:", error);
      }
    };

    fetchTables();
  }, []);
  // Fetch customers from the backend
  const fetchCustomers = async () => {
    try {
      const response = await axios.get("https://api.simotakhfid.ma:3000/api/customers");
      //console.log("Fetched customers data:", response.data);
      if (Array.isArray(response.data)) {
        setCustomers(response.data); // Update state with the customers array
      } else {
        //console.error(
          'Invalid data structure: Expected an array of customers inside "customers" key'
        );
      }
    } catch (error) {
      //console.error("Error fetching customer data:", error);
    }
  };

  // Debug state updates
  useEffect(() => {
    //console.log("Modal Open state has changed:", open);
  }, [open]);
  const handleCustomerSelect = (customer) => {
    if (customer && customer.name && customer.id) {
      setSelectedCustomer(customer); // Update selected customer state

      // Store the customer's name in localStorage
      localStorage.setItem("customerId", customer.id);

      //console.log("Selected customer:", customer.id, customer.name); // Log customer id and name
    } else {
      //console.error("Invalid customer object:", customer);
    }
  };

  // Set a default customer if none is stored in localStorage
  useEffect(() => {
    const storedCustomer = localStorage.getItem("customerName");

    if (!storedCustomer) {
      // If no customer is in localStorage, set a default one
      const defaultCustomer = {
        id: 1,
        name: "Default Customer",
        phone: "000-000-0000",
      };
      localStorage.setItem("customerName", defaultCustomer.name);
      setSelectedCustomer(defaultCustomer); // Set default customer
    } else {
      // If a customer is stored, fetch the full customer details
      const customer = customers.find((cust) => cust.name === storedCustomer);
      if (customer) {
        setSelectedCustomer(customer); // Set the stored customer
      }
    }
  }, [customers]); // Make sure this effect runs when customers are loaded

  return (
    <div>
      {/* Tables List */}

      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-1 gap-2 p-3"
      >
        {tables.map((curr, i) => (
          <motion.div
            key={i}
            style={{ backgroundColor: `${bgarr[i % bgarr.length]}` }}
            whileHover={{ backgroundColor: "#1f2544" }}
            onClick={() => allEvents(i)}
            className="flex justify-between p-3 cursor-pointer text-[#dfe3f4]"
          >
            <div className="flex flex-col items-start justify-between pl-4 font-bold h-[135px] space-y-5">
              <div>
                <h3 className="text-2xl">{curr.store_name}</h3>
              </div>
              <div className="flex flex-row items-center space-x-2">
                <p className="text-xs font-normal">Status</p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                  />
                </svg>
                <p className="text-xs font-bold">Active</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Modal */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
          {/* Background Overlay */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* Modal Content */}
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                  <div>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                      <UserIcon
                        className="h-6 w-6 text-green-600"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        Détails du client{" "}
                        <small>of {tables[selectedId]?.store_name}</small>
                      </Dialog.Title>
                      <div className="mt-2">
                        <label
                          htmlFor="customer-select"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Sélectionner un client
                        </label>
                        <select
                          className="block w-full mt-1 text-gray-700 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                          value={
                            selectedCustomer
                              ? selectedCustomer.name
                              : customers.length > 0
                              ? customers[0].name
                              : ""
                          } // Set the first customer if none is selected
                          onChange={(e) => {
                            const selectedCustomer = customers.find(
                              (cust) => cust.name === e.target.value
                            );
                            handleCustomerSelect(selectedCustomer);
                          }}
                        >
                          <option value="">Sélectionner un client</option>
                          {customers.map((customer) => (
                            <option key={customer.id} value={customer.name}>
                              {customer.name} --- {customer.phone}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
                      onClick={next}
                    >
                      Suivant
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
};

export default Tables;
