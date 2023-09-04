import express from "express";
import router from "./routes/index.js";

const PORT = process.env.PORT || 8080;

const app = express();
app.use(express.json());
app.use(router);
app.listen(PORT, () => console.log(`server up and running on port ${PORT}`));
