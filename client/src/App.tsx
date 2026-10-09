import axios from "axios";

function App() {
  const testBackendConnection = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/v1/auth/health",
      );

      console.log("Backend Response:", response.data);

      alert(response.data.message);
    } catch (error) {
      console.error("Connection Error:", error);
    }
  };

  return (
    <div>
      <h1>Mother Project Frontend</h1>

      <button onClick={testBackendConnection}>Test Backend Connection</button>
    </div>
  );
}

export default App;
