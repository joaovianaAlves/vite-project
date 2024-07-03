import express from "express";
import admin from "firebase-admin";
import fs from "fs";

const app = express();
const port = 3000;

const serviceAccount = JSON.parse(
  fs.readFileSync("./src/serviceAccountKey.json", "utf-8")
);
function generateShortCode() {
  return Math.random().toString(36).substring(2, 8);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const firestore = admin.firestore();

app.post("/short", async (req, res) => {
  try {
    const longUrl = req.body.long;
    const shortUrl = generateShortCode();

    await firestore.collection("urls").add({
      urlLong: longUrl,
      urlShort: shortUrl,
    });

    res.json({ shortUrl });
  } catch (error) {
    console.error("Error creating short URL:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/:shortUrl", async (req, res) => {
  const { shortUrl } = req.params;

  try {
    const snapshot = await firestore
      .collection("urls")
      .where("urlShort", "==", shortUrl)
      .get();

    if (snapshot.empty) {
      res.status(404).send("Not Found");
      return;
    }

    snapshot.forEach((doc) => {
      const { urlLong } = doc.data();
      res.redirect(urlLong);
    });
  } catch (error) {
    console.error("Error retrieving long URL:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
