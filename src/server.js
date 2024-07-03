import express from "express";
import { initializeApp, applicationDefault, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

const serviceAccount = require("./serviceAccountKey.json");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();
const app = express();
const port = 3000;

// Endpoint to handle short URL requests
app.get("/:shortUrl", async (req, res) => {
  const shortUrl = `https://short.ly/${req.params.shortUrl}`;

  try {
    const snapshot = await db
      .collection("urls")
      .where("urlShort", "==", shortUrl)
      .get();

    if (snapshot.empty) {
      res.status(404).send("URL not found");
      return;
    }

    const doc = snapshot.docs[0];
    const longUrl = doc.data().urlLong;
    res.redirect(longUrl);
  } catch (error) {
    console.error("Error getting document:", error);
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
});

// Start the server
app.listen(port, (error) => {
  if (error) {
    console.error("Error starting server:", error);
  } else {
    console.log(`Server running on port ${port}`);
  }
});
