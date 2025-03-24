import { useState, useEffect } from "react";

const API_URL = "https://script.google.com/macros/s/AKfycbwBJ2yMM9r7MeoYe-zAX4UAQgMi93zsBEoPAAUBKhIXck6xPVTIoODrUoqp4F0Nk2wp/exec";

const App = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched Data:", data);

        // Modify URL to direct link for embedding images
        const formattedImages = data.map((img) => ({
          url: img.url.replace("export=download", "export=view"), // Fix the URL for embedding
          name: img.name || "Unnamed", // Handle missing names
        }));

        setImages(formattedImages);
      })
      .catch((err) => console.error("Error fetching images:", err));
  }, []);

  return (
    <div className="p-6">
      {images.length > 0 ? (
        <div className="grid grid-cols-3 gap-4">
          {images.map((img, index) => (
            <div key={index} className="border p-2">
              <img src={img.url} alt={img.name} className="w-full h-auto" />
              <p className="text-center">{img.name}</p>
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