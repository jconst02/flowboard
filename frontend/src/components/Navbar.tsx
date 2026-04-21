import { UserButton } from "@clerk/react";
import { Link } from "react-router-dom";

function Navbar() {
    return (
      <nav className="flex items-center justify-between px-6 py-4 bg-gray-900 text-white border-b border-gray-800">
        <Link to="/" className="text-xl font-bold text-white">Flowboard</Link>
        <UserButton />
      </nav>
    )
}

export default Navbar;