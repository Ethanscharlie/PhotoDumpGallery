import { useEffect, useState } from "react";

export default function LogIn({ closeLoginCallback = () => { } }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login successful")
        localStorage.setItem('token', data.token);
        window.location.reload();
      } else {
        console.log("Login failed")
      }
    } catch (error) {
      console.error('Error:', error);
      console.log("Login failed, server error")
    }

  };

  return (
    <div className="absolute bg-white p-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-xl/50">
      <button className="absolute top-0 right-0 p-3 text-3xl hover:text-red-500" onClick={closeLoginCallback} >x</button>

      <form onSubmit={handleSubmit} method="POST">
        <h1 className="text-2xl font-semibold">Log In</h1>

        <br />

        <label>Username</label>
        <br />
        <input className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" type="text" placeholder="Enter Username" name="uname" value={username} onChange={(e) => setUsername(e.target.value)} required />

        <br />

        <label>Password</label>
        <br />
        <input className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" type="password" placeholder="Enter Password" name="psw" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <br />

        <button className="text-white text-center bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 text-white" type="submit">Login</button>
      </form>
    </div>
  )
}
