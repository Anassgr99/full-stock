import React from "react";
import HomeDashboard from "../user/HomeDashboard";
import { Provider } from "react-redux";
import store from "../user/store/store";

const IsUser = () => {
  return (
    <div>
      {/* <h1>Welcome User</h1>
      <p>You are a regular user with limited access.</p>
       */}
      {/* Sign Out Button */}

      <Provider store={store}>
        <HomeDashboard />
      </Provider>
    </div>
  );
};

export default IsUser;
