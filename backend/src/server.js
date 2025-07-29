import express from "express"
import cors from "cors"
import dotenv from "dotenv";
import path from "path"

import notesRoutes from "./routes/notesRoutes.js"
import { connectDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";



dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001
const __dirname = path.resolve()

// midleware
if (process.env.NODE_ENV !== "development") {
app.use(
    cors({
    origin: "http://localhost:5173",
    })
    );
}
app.use(express.json()); // this middleware will parse JSON bodies: req.body
app.use(rateLimiter);

// our simple custom middle layer
// app.use((req, res, next) => {
//     console.log(`Req method is ${req.method} & Req URL is ${req.url}`);
//     next();
// });

app.use("/api/notes", notesRoutes);

if(process.env.NODE_ENV === "development") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")))

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}

// if databse connection fails what is the point of connecting to server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server started on port: ", PORT);
    });
});