import { useAuth, RedirectToSignIn, UserButton } from "@clerk/react"
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from "./pages/Home";
import Navbar from "./components/Navbar";

function App() {

  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return null;
  
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={isSignedIn ? <Home /> : <RedirectToSignIn />} />
      </Routes>
    </>
  )
}

export default App