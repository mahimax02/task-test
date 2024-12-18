import React from "react";
import Registration from "./components/Registration";
import Feedback from "./components/Feedback";
import AdminDashboard from "./components/AdminDashboard";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/Login";
import './App.css'


const route  = createBrowserRouter([
    {
        path:'/',
        element:<Login></Login>
    },
    {
        path:'/register',
        element:<Registration></Registration>
    },
    {
        path:'/feedback',
        element:<Feedback></Feedback>
    },
    {
        path:'/dashboard',
        element:<AdminDashboard></AdminDashboard>
    }
])

function App() {
  return (
    <div>
      <h1>Feedback Management System</h1>
      <RouterProvider router={route}></RouterProvider>
    </div>
  );
}

export default App;
