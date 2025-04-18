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

          // Convert Google Drive "export=download" links to thumbnail view
          const driveMatch = url.match(/id=([^&]+)/);
          if (driveMatch) {
            const fileId = driveMatch[1];
            url = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
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
              <p className="mb-2 font-semibold">{img.name}</p>
              <img src={img.url} alt={img.name} className="w-full h-auto rounded" />
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
