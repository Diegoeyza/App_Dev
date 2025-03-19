import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;


const PDFViewer = ({ pdfs }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedLabel, setSelectedLabel] = useState("");

  const handleNext = () => {
    if (!selectedLabel) return alert("Please select a label.");
    saveLabel(pdfs[currentIndex].name, selectedLabel);
    setCurrentIndex((prev) => (prev + 1 < pdfs.length ? prev + 1 : prev));
    setSelectedLabel("");
  };

  const saveLabel = (fileName, label) => {
    fetch("YOUR_GOOGLE_APPS_SCRIPT_URL", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileName, label }),
    });
  };

  return (
    <div className="flex flex-col items-center">
      <h2>{pdfs[currentIndex].name}</h2>
      <Document file={pdfs[currentIndex].url}>
        <Page pageNumber={1} width={500} />
      </Document>
      
      <select value={selectedLabel} onChange={(e) => setSelectedLabel(e.target.value)}>
        <option value="">Select a label</option>
        <option value="Important">Important</option>
        <option value="Review">Review</option>
        <option value="Ignore">Ignore</option>
      </select>
      
      <button onClick={handleNext} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        Next
      </button>
    </div>
  );
};

export default PDFViewer;
