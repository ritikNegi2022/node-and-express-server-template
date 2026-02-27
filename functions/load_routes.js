import process from "process";
import path from "path";
import fs from "fs";
import url from "url";

export default async function Load_Routes(app, dir, baseRoute = "") {
	baseRoute = baseRoute.replace(/\/+/g, "/");
	try {
		const entries = fs.readdirSync(dir, { withFileTypes: true });

		for (const entry of entries) {
			const fullpath = path.join(dir, entry.name);

			if (entry.isDirectory()) {
				const newBase = `${baseRoute}/${entry.name}`.replace(/\/+/g, "/");
				await Load_Routes(app, fullpath, newBase);
				continue;
			}

			if (!entry.name.endsWith(".js")) continue;

			const fileURL = url.pathToFileURL(fullpath).href;

			const modulePath = fileURL

			if (entry.name === "index.js") {
				const { default: Router } = await import(modulePath);
				if (!Router) throw new Error(`No default export in ${fullpath}`);
				const mountPath = baseRoute === "" ? "/" : baseRoute;
				app.use(mountPath, Router);
			} else {
				const route_name = entry.name
					.replace(/\.route\.js$/, "")
					.replace(/\.js$/, "");

				const routePath = [baseRoute, route_name]
					.join("/")
					.replace(/\/+/g, "/");

				const { default: Router } = await import(modulePath);
				if (!Router) throw new Error(`No default export in ${fullpath}`);

				app.use(routePath, Router);
			}
		}
	} catch (err) {
		throw err;
	}
}
