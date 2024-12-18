


import React, { useState, useEffect } from "react";
import "./../styles/AdminDashboard.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const navigate = useNavigate();

  // Fetch feedback data from the backend
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/feedback");
        setFeedbackList(response.data);
      } catch (error) {
        console.error("Error fetching feedback:", error);
      }
    };

    fetchFeedback();
  }, []);

  // Handle View Feedback
  const handleView = (feedback) => {
    alert(`Feedback Details:\n\n${feedback.feedback}\nDate: ${feedback.date}`);
  };

  // Handle Edit Feedback
  const handleEdit = async (id) => {
    const newFeedback = prompt("Edit the feedback:");
    if (newFeedback) {
      try {
        await axios.put(`http://localhost:8080/api/feedback/${id}`, { feedback: newFeedback });
        setFeedbackList((prev) =>
          prev.map((item) => (item.id === id ? { ...item, feedback: newFeedback } : item))
        );
        alert("Feedback updated successfully!");
      } catch (error) {
        console.error("Error updating feedback:", error);
        alert("Failed to update feedback.");
      }
    }
  };

  // Handle Delete Feedback
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this feedback?")) {
      try {
        await axios.delete(`http://localhost:8080/api/feedback/${id}`);
        setFeedbackList((prev) => prev.filter((item) => item.id !== id));
        alert("Feedback deleted successfully!");
      } catch (error) {
        console.error("Error deleting feedback:", error);
        alert("Failed to delete feedback.");
      }
    }
  };

  // Handle Log Out
  const handleLogout = () => {
    // Clear any authentication tokens if stored
    localStorage.removeItem("authToken");
    alert("Logged out successfully!");
    navigate("/"); // Redirect to login page
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Feedback Dashboard</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Feedback</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {feedbackList.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.feedback}</td>
              <td>{item.date}</td>
              <td>
                <button onClick={() => handleView(item)}>View</button>
                <button onClick={() => handleEdit(item.id)}>Edit</button>
                <button onClick={() => handleDelete(item.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="logout" onClick={handleLogout}>
        Log Out
      </button>
    </div>
  );
};

export default AdminDashboard;
