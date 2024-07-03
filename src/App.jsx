import { addDoc, collection } from "firebase/firestore";
import { firestore } from "./utils/index";
import { useRef, useState } from "react";

function App() {
  const [shortUrl, setShortUrl] = useState("");
  const messageRef = useRef();

  async function handleSubmit(event) {
    event.preventDefault();
    const long = messageRef.current.value.trim();
    const generatedShortUrl = generateShortCode();

    try {
      const ref = collection(firestore, "urls");
      await addDoc(ref, { urlLong: long, urlShort: generatedShortUrl });
      setShortUrl(generatedShortUrl);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  }

  function generateShortCode() {
    return Math.random().toString(36).substring(2, 8);
  }

  return (
    <div>
      <h1>Url Shortener</h1>
      <form onSubmit={handleSubmit}>
        <input
          name="long"
          id="long"
          type="text"
          ref={messageRef}
          placeholder="Enter URL"
        />
        <button type="submit">Shorten</button>
      </form>
      {shortUrl && (
        <p>
          Shortened URL:{" "}
          <a
            href={`http://localhost:3000/${shortUrl}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            http://localhost:3000/{shortUrl}
          </a>
        </p>
      )}
    </div>
  );
}

export default App;
