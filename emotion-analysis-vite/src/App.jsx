import { useState } from "react";

function App() {
  const [text, setText] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh on form submit
    setLoading(true); // Show loading state
    setResponse(""); // Reset previous response

    try {
      // Replace with your actual API endpoint
      const res = await fetch("https://your-api-endpoint.com/submit", {
        method: "POST", // Use GET if you're not sending data via POST
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }), // Send the `text` as JSON in the request body
      });

      // Handle the response
      if (res.ok) {
        const data = await res.json(); // Parse the JSON response
        setResponse(data.result || "No result returned"); // Set the API response to state
      } else {
        setResponse("Error: " + res.statusText); // Handle errors
      }
    } catch (error) {
      setResponse("Error: " + error.message); // Handle network errors
    } finally {
      setLoading(false); // Hide loading state after request completes
    }
  };

  return (
    <div className="min-h-screen min-w-screen flex bg-gray-100 items-center justify-center">
      {/* Title Container - Outside the White Box, Above the Content */}
      <div className="w-full column max-w-md text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-700">Emotion Analysis</h1>
      </div>
  
      {/* White Box Container - This part is below the Title */}
      <div className="flex w-full flex max-w-md p-6 bg-white rounded-2xl shadow-lg">
        {/* Form Container */}
        <div className="mb-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 items-center">
            {/* Input Box */}
            <textarea
              className="w-full h-40 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type something..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            {/* Submit Button */}
            <button
              type="submit"
              className="p-3 bg-blue-100 text-black rounded-lg hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? "Loading..." : "Submit"}
            </button>
          </form>
        </div>
  
        {/* Display Container */}
        <div>
          <div className="w-full h-40 p-3 border rounded-lg bg-gray-50 overflow-auto">
            {response || <span className="text-gray-400">Output will appear here...</span>}
          </div>
        </div>
      </div>
    </div>
  );
  
}
  
export default App;