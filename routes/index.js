import Router from "../functions/router.js";

const router = new Router("root");

router.get("/", (_, res) =>
  res.status(200).json({ message: "Server is up and running." }),
);

export default router;
