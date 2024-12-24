import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
const { json } = bodyParser;
import dotenv from "dotenv";
import routes from "./global-routes/index";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(json());

app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
