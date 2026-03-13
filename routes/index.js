import Router from "../functions/router.js";

const handler = new Router("root");

handler.get("/", (_, res) =>
	res.status(200).json({ message: "Server is up and running." }),
).post(async (req, res) => {
	req.onError = async function () {
		console.log("THis is Error Function.")
	}
	return res.status(200).json({ message: "Post method is working" })
})

export default handler.build();
