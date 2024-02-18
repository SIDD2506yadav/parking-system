import { useContext } from "react";
import "./App.css";
import SpaceContext from "./Hooks/SpaceContext";
import WithSpace from "./components/WithSpace";
import Login from "./pages/login";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/home";
import Tickets from "./pages/tickets";
import Navbar from "./components/Navbar";

function App() {
  return (
    <WithSpace>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={
              <>
                <Navbar />
                <Login />
              </>
            }
          />
          <Route
            path="/tickets"
            element={
              <ProtectedRoutes>
                <Navbar />
                <Tickets />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoutes>
                <Navbar />
                <Home />
              </ProtectedRoutes>
            }
          />
        </Routes>
      </Router>
    </WithSpace>
  );
}

const ProtectedRoutes = ({ children }) => {
  const { space } = useContext(SpaceContext);

  if (!space) {
    return <Navigate to={"/login"} replace />;
  }
  return children;
};

export default App;
