import express from "express";
import Load_Routes from "./functions/load_routes.js";
import errorHandler from "./functions/handlers.js";

const app = express();

Load_Routes(app, import.meta.dirname + "/routes", "").then(() => {
  console.log("All Routes registered.");
  app.use(errorHandler);
});

app.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
