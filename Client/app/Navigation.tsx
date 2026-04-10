import LogIn from "./LogIn";
import { useCallback, useEffect, useState } from "react"

export default function Navigation() {
  const [show, setShow] = useState(false)
  const [isTokenValid, setIsTokenValid] = useState(false);

  const closeLogin = useCallback(() => setShow(false), [show]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return

    fetch('/api/checkToken', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then(jsonData => {
        setIsTokenValid(jsonData.valid);
      })
      .catch(error => console.error('Fetch failed:', error));
  }, []);


  return (
    <nav className="bg-gray-200 text-black">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          <div className="flex-shrink-0 text-xl font-bold">
            PhotoDumpGallery
          </div>

          <div className="hidden md:flex space-x-6">
            <a href="/" className="hover:text-blue-300">Home</a>
            <a href="#" className="hover:text-blue-300">Search</a>
          </div>

          <div className="flex items-center space-x-4">
            {(!isTokenValid) ? <button onClick={() => { setShow(true) }} className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">Log in</button>
              : <button onClick={() => { localStorage.removeItem("token"); window.location.reload(); }} className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">Log out</button>}
          </div>

        </div>
      </div>

      {show && <LogIn closeLoginCallback={closeLogin} />}
    </nav >
  )
}
