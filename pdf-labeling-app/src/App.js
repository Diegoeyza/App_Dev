import { useState, useEffect } from "react";
import PDFViewer from "./components/PDFViewer";

const API_URL = "https://raw.githubusercontent.com/Diegoeyza/App_Dev/main/pdfs.json"; // Your JSON file link

const App = () => {
  const [pdfs, setPdfs] = useState([]);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setPdfs(data))
      .catch((err) => console.error("Error fetching PDFs:", err));
  }, []);

  return (
    <div className="p-6">
      {pdfs.length > 0 ? (
        <PDFViewer pdfs={pdfs} />
      ) : (
        <p>Loading PDFs...</p>
      )}
    </div>
  );
};

export default App;
