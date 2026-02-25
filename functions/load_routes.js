import process from "process";
import path from "path";
import fs from "fs";
import url from "url";

export default async function Load_Routes(app, dir, baseRoute = "") {
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (let entry of entries) {
      const fullpath = path.join(dir, entry.name);
      const fileURL = url.pathToFileURL(fullpath).href;
      if (entry.isDirectory()) {
        await Load_Routes(
          app,
          dir + "/" + entry.name,
          `${baseRoute}/${entry.name}`,
        );
      } else if (entry.name === "index.js") {
        const { default: Router } = await import(fileURL);
        app.use(baseRoute || "/", Router);
      } else if (entry.name.endsWith(".js")) {
        const route_name = entry.name.replace(".js", "").replace(".route", "");
        const { default: Router } = await import(fileURL);
        app.use(`${baseRoute}/${route_name}`, Router);
      }
    }
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}
