import React, { useContext, useRef, useState } from "react";
import SpaceContext from "../Hooks/SpaceContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const spaceIdRef = useRef("");
  const { dispatch } = useContext(SpaceContext);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSpaceIdChange = (event) => {
    spaceIdRef.current = event.target.value;
  };

  const submitSpaceId = async (event) => {
    event.preventDefault();
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:3001/space/getSpace?id=${spaceIdRef.current}`
      );
      if (response.status === 200) {
        const { space } = await response.json();
        dispatch({
          type: "setSpace",
          data: space,
        });
        navigate("/");
      } else if (response.status === 404) {
        setError("No parking space found for the space Id.");
      } else {
        setError("Invalid parking space ID.");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="login__main">
      <div className="login__form__container">
        <h1 className="login__header">Park It</h1>
        <form onSubmit={submitSpaceId} className="login__form">
          <label className="spaceIdInputLabel" htmlFor="spaceIdInput">
            Parking Space Id:{" "}
          </label>
          <input
            type="text"
            required
            name="spaceId"
            defaultValue={""}
            onChange={handleSpaceIdChange}
            id="spaceIdInput"
            className="spaceIdInput"
          />
          <input type="submit" value={"Submit"} className="spaceIdSubmit" />
          {error && <p className="login__spaceError">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;
