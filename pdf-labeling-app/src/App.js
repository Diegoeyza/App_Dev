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

// Firebase init
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const API_URL = "https://script.google.com/macros/s/AKfycbwBJ2yMM9r7MeoYe-zAX4UAQgMi93zsBEoPAAUBKhIXck6xPVTIoODrUoqp4F0Nk2wp/exec";

// Change this to your allowed users
const ALLOWED_EMAILS = ["diegoeyzaguirreb@gmail.com", "friend@domain.com"];

const App = () => {
  const [user, setUser] = useState(null);
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

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

  if (!user) {
    return (
      <div className="h-screen flex justify-center items-center">
        <button onClick={login} className="bg-blue-500 text-white px-4 py-2 rounded">
          Login with Google
        </button>
      </div>
    );
  }

  const currentImage = images[currentIndex];

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">Welcome, {user.displayName}</h1>
        <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded">
          Logout
        </button>
      </div>

      {currentImage ? (
        <>
          <div className="flex items-center justify-center gap-4 mb-6">
            <button onClick={goPrev} disabled={currentIndex === 0} className="text-2xl">
              ⬅️
            </button>
            <div className="text-center">
              <p className="mb-2 font-semibold">{currentImage.name}</p>
              <img src={currentImage.url} alt={currentImage.name} className="max-w-full h-auto rounded" />
            </div>
            <button onClick={goNext} disabled={currentIndex === images.length - 1} className="text-2xl">
              ➡️
            </button>
          </div>

          <div className="overflow-x-auto whitespace-nowrap border-t pt-4 mt-4">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => goTo(index)}
                className={`inline-block mx-2 px-4 py-1 rounded-full border ${
                  index === currentIndex
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white text-blue-500 border-blue-300 hover:bg-blue-100"
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
