import { useState, useRef } from "react";


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
    <div className="output-box-large">
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
  );
};

function App() {
  const [text, setText] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const mediaChunks = useRef([]);


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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          mediaChunks.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(mediaChunks.current, { type: "audio/webm" });
        mediaChunks.current = []; // Clear recorded chunks

        // Send the audioBlob to the server
        await uploadAudio(audioBlob);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);

      mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
  };

  const uploadAudio = async (audioBlob) => {
    const formData = new FormData();
    formData.append("file", audioBlob, "recording.webm");
  
    try {
      const response = await fetch("http://127.0.0.1:8000/recording", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error("Failed to upload audio");
      }
  
      const data = await response.json();
      console.log("Server response:", data);
      setResponse(data.result || "Audio processed successfully");
    } catch (error) {
      console.error("Error uploading audio:", error);
      setResponse("Error uploading audio: " + error.message);
    }
  };

  return (
    <div className="min-h-screen min-w-screen flex bg-gray-100 items-center justify-center">
      <div className="container">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-700">Emotion Detection Automation</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Input Box and Display Container */}
          <div className="flex gap-4">
            <textarea
              className="textarea-large"
              placeholder="Type something..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <ResponseDisplay response={response} />
          </div>

          {/* Submit Button Container */}
          <div className="flex justify-center mt-4 gap-x-4">
            <button
              type="submit"
              className="p-2 w-24 bg-blue-100 text-black rounded-lg hover:bg-blue-600 flex items-center justify-center"
              disabled={loading || isRecording}
            >
              {loading ? "Loading..." : "Text"}
            </button>

            <button
              type="button"
              className="p-2 w-24 bg-blue-100 text-black rounded-lg hover:bg-blue-600 flex items-center justify-center"
              disabled={loading}
              onClick={isRecording ? stopRecording : startRecording}
            >
              {isRecording ? "Stop Recording" : "Start Recording"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}  

export default App;