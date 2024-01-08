import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Home from "./pages/homepage";
import Follow from "./components/Follow";
import Login from "./pages/login";
import Profile from "./pages/profile";
import UserProfile from "./pages/userProfile";
import { AuthProvider } from "./contexts/AuthContext";
import { UserProvider } from "./contexts/UserContext";

const App: React.FC = () => {
  return (
    
    <UserProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <div className="flex flex-col md:flex-row bg-gray-800 h-full">
                  <Sidebar />
                  <Home />
                  <Follow />
                </div>
              }
            />

            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/users/:userId" element={<UserProfile />} />
          </Routes>
        </Router>
      </AuthProvider>
    </UserProvider>
  );
};

export default App;
