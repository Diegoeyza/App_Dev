import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { firebaseConfig } from "./firebaseConfig";
import "./index.css";

// Firebase init
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const API_URL =
  "https://script.google.com/macros/s/AKfycbwBJ2yMM9r7MeoYe-zAX4UAQgMi93zsBEoPAAUBKhIXck6xPVTIoODrUoqp4F0Nk2wp/exec";

// Change this to your allowed users
const ALLOWED_EMAILS = ["diegoeyzaguirreb@gmail.com", "friend@domain.com"];
const SHEET_WEBHOOK_URL =
  "https://script.google.com/macros/s/AKfycbxpNzggEnrGudoPIXi7zAEQK-_GhQpfay2i6J98fWyA3ifmPC5jUcoercb-5cLSu1lywQ/exec";

const App = () => {
  const [user, setUser] = useState(null);
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedLabel, setSelectedLabel] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u && ALLOWED_EMAILS.includes(u.email)) {
        setUser(u);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetch(API_URL)
        .then((res) => res.json())
        .then((data) => {
          const formattedImages = data.map((img) => {
            const name = img.name || "Unnamed";
            const match = img.url.match(/id=([^&]+)/);
            const fileId = match?.[1];
            const url = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
            return { name, url };
          });
          setImages(formattedImages);
        })
        .catch((err) => console.error("Error fetching images:", err));
    }
  }, [user]);

  const login = () => signInWithPopup(auth, new GoogleAuthProvider());
  const logout = () => signOut(auth);

  const goPrev = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));
  const goNext = () => setCurrentIndex((prev) => Math.min(prev + 1, images.length - 1));
  const goTo = (index) => setCurrentIndex(index);

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = SHEET_WEBHOOK_URL;

    if (!selectedLabel) return alert("Please select a label.");

    const current = images[currentIndex];
    const payload = {
      imageName: current.name,
      imageUrl: current.url,
      userName: user.displayName,
      userEmail: user.email,
      label: selectedLabel,
      timestamp: new Date().toISOString(),
    };

    fetch(url, {
      method: "POST",
      redirect: "follow",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.text())
      .then((data) => {
        alert(data);
      })
      .catch((error) => console.log("Error!"));
    console.log(payload);
  };

  if (!user) {
    return (
      <div className="login-container">
        <h1 id="app-title">Image Labeling App</h1>
        <button onClick={login} className="button login-button">
          Login with Google
        </button>
      </div>
    );
  }

  const currentImage = images[currentIndex];

  return (
    <div className="app-container">
      <div className="header">
        <h1>Welcome, {user.displayName}</h1>
        <button onClick={logout} className="button logout-button">
          Logout
        </button>
      </div>

      {currentImage ? (
        <>
          <div className="image-container">
            <button onClick={goPrev} disabled={currentIndex === 0} className="arrow-button">
              ⬅️
            </button>
            <div className="image-content">
              <p className="image-name">{currentImage.name}</p>
              <img src={currentImage.url} alt={currentImage.name} className="image" />
              <a href={currentImage.url} className="image-link">Image Link</a>
              <div className="label-section">
                <select
                  value={selectedLabel}
                  onChange={(e) => setSelectedLabel(e.target.value)}
                  className="label-select"
                >
                  <option value="">Select label</option>
                  <option value="Normal">Normal</option>
                  <option value="AFib">AFib</option>
                  <option value="Other">Other</option>
                </select>
                <button onClick={handleSubmit} className="submit-button">
                  Submit
                </button>
              </div>
            </div>
            <button onClick={goNext} disabled={currentIndex === images.length - 1} className="arrow-button">
              ➡️
            </button>
          </div>

          <div className="image-thumbnails">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => goTo(index)}
                className={`thumbnail-button ${
                  index === currentIndex ? "active" : ""
                }`}
              >
                {img.name}
              </button>
            ))}
          </div>
        </>
      ) : (
        <p>Loading Images...</p>
      )}
    </div>
  );
};

export default App;
