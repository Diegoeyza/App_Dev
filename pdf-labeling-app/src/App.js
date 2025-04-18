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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      console.log("Auth state changed:", u);
      if (u && ALLOWED_EMAILS.includes(u.email)) {
        setUser(u);
      } else {
        console.warn("Unauthorized email or not logged in:", u?.email);
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

  if (!user) {
    return (
      <div className="h-screen flex justify-center items-center">
        <button onClick={login} className="bg-blue-500 text-white px-4 py-2 rounded">
          Login with Google
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">Welcome, {user.displayName}</h1>
        <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded">
          Logout
        </button>
      </div>
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
