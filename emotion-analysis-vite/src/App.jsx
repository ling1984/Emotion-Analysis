import { useState } from "react";


const labelColors = {
  disappointment: "bg-gray-200 text-gray-800",
  sadness: "bg-blue-100 text-blue-800",
  realization: "bg-yellow-200 text-yellow-800",
  embarrassment: "bg-red-200 text-red-800",
  neutral: "bg-gray-300 text-gray-900",
  remorse: "bg-purple-200 text-purple-800",
  annoyance: "bg-orange-200 text-orange-800",
  approval: "bg-green-200 text-green-800",
  disapproval: "bg-red-300 text-red-900",
  confusion: "bg-yellow-300 text-yellow-900",
  nervousness: "bg-gray-400 text-gray-900",
  desire: "bg-pink-200 text-pink-800",
  disgust: "bg-green-400 text-green-900",
  surprise: "bg-blue-300 text-blue-900",
  anger: "bg-red-400 text-red-900",
  curiosity: "bg-blue-400 text-blue-900",
  fear: "bg-yellow-400 text-yellow-900",
  grief: "bg-purple-300 text-purple-900",
  optimism: "bg-green-300 text-green-900",
  amusement: "bg-orange-300 text-orange-900",
  excitement: "bg-pink-300 text-pink-900",
  joy: "bg-green-400 text-green-900",
  love: "bg-red-500 text-red-50",
  admiration: "bg-blue-500 text-blue-50",
  pride: "bg-yellow-500 text-yellow-50",
  relief: "bg-green-500 text-green-50",
  caring: "bg-purple-400 text-purple-900",
  gratitude: "bg-orange-400 text-orange-900"
};

const ResponseDisplay = ({ response }) => {
  return (
    <div>
      {/* Display Container */}
      <div className="w-full h-40 p-3 border rounded-lg bg-gray-50 overflow-auto">
        {response && response.length > 0 ? (
          response.map(([text, labels], index) => (
            <div key={index} className="p-2 border-b last:border-none">
              <p className="text-lg font-semibold">{text}</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {labels.map((labelObj, idx) => (
                  <span
                    key={idx}
                    className={`px-2 py-1 rounded-lg text-sm font-medium ${
                      labelColors[labelObj.label] || "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {labelObj.label} ({(labelObj.score * 100).toFixed(1)}%)
                  </span>
                ))}
              </div>
            </div>
          ))
        ) : (
          <span className="text-gray-400">Output will appear here...</span>
        )}
      </div>
    </div>
  );
};



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
      const res = await fetch("http://127.0.0.1:8000/submit", {
        method: "POST", // Use GET if you're not sending data via POST
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }), // Send the `text` as JSON in the request body
      });

      // Handle the response
      if (res.ok) {
        const data = await res.json(); // Parse the JSON response
        setResponse(data.result || []); // Set the API response to state
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
  
        <div>
      {/* Display Container */}
      <ResponseDisplay response={response} />
    </div>
      </div>
    </div>
  );
  
}
  
export default App;