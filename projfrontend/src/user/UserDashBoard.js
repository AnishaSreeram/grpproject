import React from "react";
import Base from "../core/Base";
import { Link } from "react-router-dom";

const UserDashBoard = () => {
  return (
    <Base title="UserDashBoard page">
      <h1>Click <Link to="/">here</Link> to look at our products!</h1>
    </Base>
  );
};

export default UserDashBoard;