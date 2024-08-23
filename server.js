import express from "express";
import cors from "cors";
import { createApi } from "unsplash-js";

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY,
});
const app = express();
const port = process.env.PORT || 3000;
app.use(cors());

app.get("/", async (req, res) => {
  try {
    const { q } = req.query;
    const obj = {};
    if (q) {
      obj.query = q;
    }
    const result = await unsplash.photos.getRandom(obj);

    if (result.errors) {
      res.send(result.errors);
      return;
    }
    const photo = result.response;
    const full = photo.urls.full;
    const photog = photo.user.name;
    const md = `![photo by ${photog} on Unsplash](${full})`;
    res.send({ full, photog, md });
  } catch (err) {
    res.send(err);
  }
});

app.listen(port, () => console.log(`app listening on port ${port}!`));
