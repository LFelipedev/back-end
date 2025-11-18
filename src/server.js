const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

const templateRoutes = require("./routes/templateRoutes");

app.use("/templates", templateRoutes);

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server na porta: ${PORT}`);
});
