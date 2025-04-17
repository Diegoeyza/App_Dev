import { useState, useEffect } from "react";

// API URL for fetching image metadata
const API_URL = "https://script.google.com/macros/s/AKfycbwBJ2yMM9r7MeoYe-zAX4UAQgMi93zsBEoPAAUBKhIXck6xPVTIoODrUoqp4F0Nk2wp/exec";

const App = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        const formattedImages = data.map((img) => {
          const name = img.name || "Unnamed";
          let url = img.url;

          // Convert Google Drive "export=download" links to inline "view" links
          const driveMatch = url.match(/id=([^&]+)/);
          if (driveMatch) {
            const fileId = driveMatch[1];
            url = `https://drive.google.com/uc?id=${fileId}`;
          }

          return { name, url };
        });

        setImages(formattedImages);
      })
      .catch((err) => console.error("Error fetching images:", err));
  }, []);

  return (
    <div className="p-6">
      {images.length > 0 ? (
        <div className="grid grid-cols-3 gap-4">
          {images.map((img, index) => (
            <div key={index} className="border p-2 text-center">
              <a
                href={img.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                {img.name}
              </a>
              <img src="https://drive.google.com/thumbnail?id=1APYPGVNzvvdqSmLqpMYKBnTxjjH2nbv3&sz=w1000" alt="" />
            </div>
          ))}
        </div>
      ) : (
        <p>Loading Images...</p>
      )}
    </div>
  );
};

export default App;
