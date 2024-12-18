


// import React, { useState } from "react";
// import "./../styles/Feedback.css";
// import axios from "axios";

// const Feedback = () => {
//   const [feedback, setFeedback] = useState("");
//   const [isEditing, setIsEditing] = useState(false);
//   const [feedbackId, setFeedbackId] = useState(null);

//   // Function to handle adding new feedback
//   const handleAddFeedback = () => {
//     setFeedback(""); 
//     setIsEditing(false);
//     setFeedbackId(null);
//   };

//   // Function to handle editing feedback
//   const handleEditFeedback = (id, existingFeedback) => {
//     setFeedback(existingFeedback);
//     setIsEditing(true);
//     setFeedbackId(id);
//   };

//   // Function to submit feedback
//   const handleSubmit = async () => {
//     if (!feedback) {
//       alert("Feedback cannot be empty!");
//       return;
//     }

//     try {
//       const apiKey = localStorage.getItem("apiKey"); // Retrieve API key from local storage
//       if (!apiKey) {
//         alert("You must be logged in to submit feedback!");
//         return;
//       }

//       if (isEditing && feedbackId) {
//         // Update feedback
//         await axios.put(
//           `http://localhost:8080/api/feedback/${feedbackId}`,
//           feedback, // Send feedback as raw string
//           {
//             headers: {
//               "x-api-key": apiKey, // Include API key in headers
//             },
//           }
//         );
//         alert("Feedback updated successfully!");
//       } else {
//         // Add new feedback
//         await axios.post(
//           "http://localhost:8080/api/feedback",
//           feedback, // Send feedback as raw string
//           {
//             headers: {
//               "x-api-key": apiKey, // Include API key in headers
//             },
//           }
//         );
//         alert("Feedback added successfully!");
//       }

//       // Reset state
//       setFeedback("");
//       setIsEditing(false);
//       setFeedbackId(null);
//     } catch (error) {
//       console.error("Error submitting feedback:", error);
//       alert("Failed to submit feedback.");
//     }
//   };

//   return (
//     <div className="feedback-container">
//       <h2>Feedback</h2>
//       <div className="buttons">
//         <button onClick={handleAddFeedback}>Add Feedback</button>
//         <button onClick={() => handleEditFeedback(1, "Existing Feedback Example")}>
//           Edit Feedback
//         </button>
//       </div>
//       <textarea
//         placeholder="Write your feedback here..."
//         value={feedback}
//         onChange={(e) => setFeedback(e.target.value)}
//       ></textarea>
//       <button className="submit-btn" onClick={handleSubmit}>
//         {isEditing ? "Update" : "Submit"}
//       </button>
//     </div>
//   );
// };

// export default Feedback;

import React, { useState, useEffect } from "react";
import "./../styles/Feedback.css";
import axios from "axios";

const Feedback = () => {
  const [feedback, setFeedback] = useState("");  // State for feedback content
  const [isEditing, setIsEditing] = useState(false);  // State to track if editing
  const [feedbackId, setFeedbackId] = useState(null);  // State for feedback ID (for editing)
  const [loading, setLoading] = useState(false);  // Loading state for async actions
  const [error, setError] = useState("");  // State to store error messages
  const [feedbackList, setFeedbackList] = useState([]);  // State to store all feedbacks

  // Function to handle adding new feedback
  const handleAddFeedback = () => {
    setFeedback(""); 
    setIsEditing(false);  // Set to add mode (not editing)
    setFeedbackId(null);  // Reset feedback ID
    setError("");  // Clear any error
  };

  // Fetch all feedbacks when the component is loaded or when editing
  const fetchFeedbacks = async () => {
    setLoading(true);  // Show loading indicator
    try {
      const apiKey = localStorage.getItem("apiKey");
      if (!apiKey) {
        setError("You must be logged in to view feedback!");
        setLoading(false);
        return;
      }
      console.log("apikey from local", apiKey);
      const response = await axios.get("http://localhost:8080/api/feedback", {

        headers: { "x-api-key": apiKey },
      });

      setFeedbackList(response.data);  // Store feedback data in state
      setLoading(false);  // Stop loading once data is fetched
    } catch (err) {
      console.error("Error fetching feedbacks:", err);
      setError("Failed to load feedbacks.");
      setLoading(false);
    }
  };

  // Function to handle selecting feedback for editing
  const handleEditFeedback = (id, existingFeedback) => {
    setFeedback(existingFeedback);  // Set the selected feedback for editing
    setIsEditing(true);  // Set editing mode to true
    setFeedbackId(id);  // Set the feedback ID for updating
    setError("");  // Clear any existing errors
  };

  // Function to submit feedback (either add new or update existing)
  const handleSubmit = async () => {
    if (!feedback) {
      setError("Feedback cannot be empty!");
      return;
    }

    setLoading(true);  // Show loading state while submitting

    try {
      const apiKey = localStorage.getItem("apiKey"); // Retrieve API key from local storage
      if (!apiKey) {
        setError("You must be logged in to submit feedback!");
        setLoading(false);
        return;
      }

      const url = isEditing && feedbackId
        ? "http://localhost:8080/api/feedback/${feedbackId}"  
        : "http://localhost:8080/api/feedback";  // For adding new feedback

      const method = isEditing && feedbackId ? "put" : "post";  // Determine HTTP method (PUT or POST)

      // Send feedback (either create or update)
      await axios({
        method,
        url,
        data: feedback,
        headers: {
          "x-api-key": apiKey, // Include API key in headers
        },
      });

      alert(isEditing ? "Feedback updated successfully!" : "Feedback added successfully!");

      // Reset state after submission
      setFeedback("");
      setIsEditing(false);  // Reset editing state
      setFeedbackId(null);  // Reset feedback ID
      setLoading(false);

      if (!isEditing) {
        fetchFeedbacks();  // Re-fetch feedbacks after adding a new one
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setError("Failed to submit feedback. Please try again.");
      setLoading(false);
    }
  };

  // UseEffect to load feedbacks when the component mounts or when editing
  useEffect(() => {
    if (isEditing) fetchFeedbacks();  // Fetch feedbacks when entering edit mode
  }, [isEditing]);

  return (
    <div className="feedback-container">
      <h2>Feedback</h2>

      <div className="buttons">
        <button onClick={handleAddFeedback}>Add Feedback</button>
        <button onClick={fetchFeedbacks}>Edit Feedback</button>
      </div>

      {/* Display error message */}
      {error && <div className="error-message">{error}</div>}

      {/* Display the feedback form */}
      {!isEditing && (
        <>
          <h3>Write New Feedback</h3>
          <textarea
            placeholder="Write your feedback here..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            disabled={loading}  // Disable textarea when loading
          ></textarea>
          <button
            className="submit-btn"
            onClick={handleSubmit}
            disabled={loading} // Disable submit button when loading
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>
        </>
      )}

      {/* Display list of feedbacks if editing */}
      {isEditing && (
        <>
          <h3>Select Feedback to Edit</h3>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="feedback-list">
              {feedbackList.length === 0 ? (
                <p>No feedback available.</p>
              ) : (
                feedbackList.map((feedbackItem) => (
                  <div
                    key={feedbackItem.id}
                    className="feedback-card"
                    onClick={() =>
                      handleEditFeedback(feedbackItem.id, feedbackItem.content)
                    }
                  >
                    <p>{feedbackItem.content}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Feedback;