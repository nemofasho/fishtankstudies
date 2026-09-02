import { Routes, Route } from "react-router-dom";
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import TankPage from "./pages/TankPage";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import CreateTank from "./pages/CreateTank";

function App() {

  const currentUserId = 1;

  return (

    <>
      <Navbar />

    <Routes>

      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/dashboard"
        element={<Dashboard />}
      />

      <Route
        path="/tanks/:tankId"
        element={<TankPage currentUserId={1} />}
      />

      <Route
        path="/tanks/create"
        element={<CreateTank />}
      />

      <Route
        path="*"
        element={<NotFound />}
      />

    </Routes>
    </>
  );
}

export default App
