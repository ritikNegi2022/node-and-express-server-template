import express from "express";
import bodyParser from "body-parser";
import cors from 'cors'
import dotEnv from "dotenv";
import cookieParser from "cookie-parser";
import Load_Routes from "./functions/load_routes.js";
import errorHandler from "./functions/handlers.js";


dotEnv.config();
const app = express();


app.use(
	cors({
		origin: "*",
	}),
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "5mb" }));
app.use(cookieParser());

app.use(express.static("public"))

Load_Routes(app, import.meta.dirname + "/routes", "").then(() => {
	console.log("All Routes registered.");
	app.use(errorHandler);
});

app.listen(process.env.PORT || 4000, () => {
	console.log("Server running on http://localhost:4000");
});
