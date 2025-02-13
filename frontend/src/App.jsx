import { useState, useEffect } from "react";
import "prismjs/themes/prism-tomorrow.css";
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";

function App() {
  const [code, setCode] = useState(`function sum() {\n  return 1 + 1;\n}`);
  const [review, setReview] = useState("");
  const [pastReviews, setPastReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) fetchPastReviews();
    console.log("token: ", token);
  }, [token]);

  async function fetchPastReviews() {
    try {
      const response = await axios.get(
        "http://localhost:3000/ai/past-prompts",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPastReviews(response.data);
    } catch (error) {
      console.error("Error fetching past reviews:", error);
    }
  }

  async function reviewCode() {
    try {
      const response = await axios.post(
        "http://localhost:3000/ai/get-review",
        { code },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReview(response.data.review || "");
      fetchPastReviews(); // Refresh past reviews
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  }

  async function updateReview(id) {
    try {
      const response = await axios.put(
        `http://localhost:3000/ai/past-prompts/${id}`,
        { code, review },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReview(response.data.review); // Update UI with new review
      fetchPastReviews(); // Refresh the list
      setSelectedReview(null); // Clear the selected review
    } catch (error) {
      console.error("Error updating review:", error);
    }
  }

  async function deleteReview(id) {
    try {
      await axios.delete(`http://localhost:3000/ai/past-prompts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPastReviews(); // Refresh past reviews after deletion
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  }

  function handleEditReview(item) {
    setSelectedReview(item);
    setCode(item.code);
    setReview("");
  }

  function handleCodeReview() {
    setSelectedReview(null); // Reset selected review
    setCode(""); // Clear editor for new review
    setReview(""); // Clear AI review section
  }

  function handleReviewClick(item) {
    setSelectedReview(item);
    setCode(item.code);
    setReview(item.review);
  }

  return (
    <>
      <nav className="w-full max-w-screen-xl mx-auto bg-gray-800 p-4 shadow-lg border-b-2 border-white">
        <div className="max-w-screen-xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-semibold text-blue-400 cursor-pointer hover:text-blue-500 transition duration-300">
            AI Code Reviewer
          </h1>
          <div className="flex items-center space-x-6">
            <button className="bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none transition duration-200">
              Dashboard
            </button>
            <button className="bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none transition duration-200">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="h-screen flex bg-gray-900 text-white">
        {/* Sidebar */}
        <aside className="w-full sm:w-64 bg-gray-800 p-4 flex flex-col">
          <h2 className="text-lg font-semibold mb-4">Previous Reviews</h2>
          <ul className="space-y-2 flex-1 overflow-auto">
            {pastReviews.length > 0 ? (
              pastReviews.map((item) => (
                <li
                  key={item.id}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering select
                    handleReviewClick(item);
                  }}
                  className="p-2 bg-gray-700 rounded cursor-pointer hover:bg-gray-500 flex justify-betweenn items-center"
                >
                  <span>{item.code.substring(0, 30)}...</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering select
                        handleEditReview(item);
                      }}
                      className="text-yellow-400 hover:text-yellow-500 cursor-pointer"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering select
                        deleteReview(item.id);
                      }}
                      className="text-red-400 hover:text-red-500 cursor-pointer"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <p className="text-gray-400">No reviews yet</p>
            )}
          </ul>
          {/* New Review Button */}
          <button
            onClick={handleCodeReview}
            className="mt-4 bg-blue-600 py-2 rounded hover:bg-blue-700"
          >
            New Review
          </button>
        </aside>

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col">
          <div className="flex-1 overflow-auto p-6 space-y-6">
            {/* Code Editor */}
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <h3 className="text-blue-400 mb-2">Your Code:</h3>
              <div className="bg-black rounded-lg overflow-hidden">
                <Editor
                  value={code} // Always use state value to allow editing
                  onValueChange={setCode}
                  highlight={(code) =>
                    prism.highlight(
                      code,
                      prism.languages.javascript,
                      "javascript"
                    )
                  }
                  padding={15}
                  style={{
                    fontFamily: '"Fira Code", monospace',
                    fontSize: 14,
                    minHeight: "200px",
                    backgroundColor: "#0d0d0d",
                    color: "#ffffff",
                    borderRadius: "8px",
                  }}
                />
              </div>
            </div>

            {/* AI Review */}
            {review && (
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <h3 className="text-green-400 mb-2">AI Review:</h3>
                <Markdown
                  className="text-gray-300"
                  rehypePlugins={[rehypeHighlight]}
                >
                  {String(review)}
                </Markdown>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="p-4 bg-gray-900 border-t border-gray-700 flex items-center">
            {selectedReview ? (
              <button
                onClick={() => updateReview(selectedReview.id)}
                className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600"
              >
                Update Review
              </button>
            ) : (
              <button
                onClick={reviewCode}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
              >
                Submit for Review
              </button>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

export default App;
