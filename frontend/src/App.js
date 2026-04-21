import React, { useState, useEffect } from "react";
import "@/App.css";
import Dashboard from "./components/Dashboard";
import LoginPage from "./components/LoginPage";
import { WealthProvider } from "./context/WealthContext";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("access_token")
  );

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setIsAuthenticated(false);
  };

  return (
    <div className="App">
      {isAuthenticated ? (
        <WealthProvider onSessionExpired={handleLogout}>
          <Dashboard onLogout={handleLogout} />
        </WealthProvider>
      ) : (
        <LoginPage onLogin={() => setIsAuthenticated(true)} />
      )}
    </div>
  );
}

export default App;
