import express from "express";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3000;
const baseUrl = "https://api.unsplash.com";
app.use(cors());

app.get("/", async (req, res) => {
  try {
    const { q } = req.query;
    const searchParams = new URLSearchParams(q);
    const url = new URL(`/photos/random?${searchParams}`, baseUrl);
    const response = await fetch(url, {
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw error;
    }
    const photo = await response.json();
    const full = photo.urls.full;
    const user = photo.user.name;
    const userLink = `${photo.user.links.html}?utm_source=templater_proxy&utm_medium=referral`;
    const md = `![photo by ${user}(${userLink}) on Unsplash](${full})`;
    res.send({ full, photog: user, md });
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(port, () => console.log(`app listening on port ${port}!`));
