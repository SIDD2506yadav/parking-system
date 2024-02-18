import { useMemo, useReducer } from "react";
import SpaceContext from "../Hooks/SpaceContext";

const WithSpace = ({ children }) => {
  function reducer(state, action) {
    switch(action.type) {
      case "setSpace":
        return action.data;
      default:
        return state;
    }
  }

  const [space, dispatch] = useReducer(reducer, null);
  
  return <SpaceContext.Provider value={{ space, dispatch }}>{children}</SpaceContext.Provider>;
};

export default WithSpace;
