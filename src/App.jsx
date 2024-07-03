import { addDoc, collection } from "firebase/firestore";
import { firestore } from "./utils/index";
import { useRef, useState } from "react";

function App() {
  const [send, setSend] = useState(false);
  const [short, setShort] = useState("");
  const [error, setError] = useState("");
  const messageRef = useRef();
  const ref = collection(firestore, "urls");

  function generateShortCode() {
    return `https://short.ly/${Math.random().toString(36).substring(2, 6)}`;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError(""); // Clear any previous error messages

    const long = messageRef.current.value.trim();
    if (!long) {
      setError("Please enter a valid URL.");
      return;
    }

    const shortUrl = generateShortCode();
    setShort(shortUrl);
    setSend(true);

    try {
      await addDoc(ref, { urlLong: long, urlShort: shortUrl });
    } catch (error) {
      console.error("Error adding document: ", error);
      setError("Failed to shorten URL. Please try again later.");
    }
  }

  return (
    <div>
      <h1>Url Shortener</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" ref={messageRef} placeholder="Enter URL" />
        <button type="submit">Shorten</button>
      </form>
      {send && (
        <p>
          Shortened URL:{" "}
          <a href={short} target="_blank" rel="noopener noreferrer">
            {short}
          </a>
        </p>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default App;
