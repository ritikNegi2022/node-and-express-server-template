import Router from "../functions/router.js";

const handler = new Router("root");

handler.get("/", (_, res) =>
	res.status(200).json({ message: "Server is up and running." }),
).post((_, res) => res.status(200).json({ message: "Post method is working" }))

export default handler.build();
