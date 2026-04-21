import { useAuth, RedirectToSignIn, UserButton } from "@clerk/react"
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Board from "./pages/Board";

function App() {

  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return null;
  
  return (
    <div className="bg-gray-950 text-white h-screen flex flex-col overflow-hidden">
      <Navbar />
      <div className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={isSignedIn ? <Home /> : <RedirectToSignIn />} />
          <Route path="/board/:boardId" element={
            isSignedIn ? <Board /> : <RedirectToSignIn />
          } />
        </Routes>
      </div>
    </ div>
  )
}

export default App