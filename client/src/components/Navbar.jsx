import React, { useContext } from "react";
import SpaceContext from "../Hooks/SpaceContext";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { space, dispatch } = useContext(SpaceContext);
  const logout = () => {
    dispatch({
      type: "setSpace",
      data: null,
    });
  };
  return (
    <div className="navbar__main">
      <div className="navbar__container">
        <div className="navbar__content">
          <h1><Link to={"/"}>Park It</Link></h1>
        </div>
        <div className="navbar__content">
          {space ? (
            <>
              <div>
                <Link to={"/tickets"}>Tickets</Link>
              </div>
              <button className="navbar__logout" onClick={logout}>Logout</button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
