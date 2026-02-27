import express from "express";

class Route {
	constructor(path, method, description = "No description") {
		this.path = path;
		this.method = method;
		this.description = description;
	}
}

class Router {
	#routes
	#route_name
	#router
	#active_route
	#routes_set
	constructor(routeName = "root") {
		this.#route_name = routeName;
		this.#routes = [];
		this.#routes_set = new Set();
		this.#router = express.Router();
		this.#active_route = new Route("/", "DEFAULT");
	}

	after_route_registered(method, path) {
		const normalizedMethod = method.toUpperCase();
		const normalizedPath = path.replace(/\/+$/, "") || "/";

		const route = new Route(normalizedPath, normalizedMethod);
		this.#routes.push(route);
		this.#routes_set.add(`${normalizedPath}:${normalizedMethod}`);
		this.#active_route = route;
		return this;
	}

	desc(description) {
		if (this.#active_route.method === "DEFAULT") {
			throw new Error("No route to describe. Call a route method first.");
		}
		if (typeof description !== "string" || description.length < 3) {
			throw new Error("Description must be a string with minimum length 3");
		}

		this.#active_route.description = description;
		return this;
	}

	asyncHandler(fn) {
		if (fn.length === 4) return fn;

		return (req, res, next) =>
			Promise.resolve(fn(req, res, next)).catch(next);
	}

	register(method, ...args) {
		if (typeof this.#router[method] !== "function") {
			throw new Error(`Invalid HTTP method: ${method}`);
		}

		let path = this.#active_route.path;

		const handlers =
			typeof args[0] === "string"
				? ((path = args[0]), args.slice(1))
				: args;

		if (typeof path !== "string" || path.length === 0) {
			throw new Error("Route path must be a non-empty string");
		}
		path = path.replace(/\/+$/, "") || "/";
		if (!path.startsWith("/")) path = "/" + path;
		const normalizedMethod = method.toUpperCase();

		if (
			this.#routes_set.has(`${path}:${normalizedMethod}`)
		) {
			throw new Error(
				`Route already registered: [${normalizedMethod}] ${path} in ${this.#route_name}`
			);
		}

		if (!handlers.length) {
			throw new Error("At least one handler is required");
		}

		const wrapped = handlers.map((h) => {
			if (typeof h !== "function") {
				throw new TypeError("Route handler must be a function");
			}
			return this.asyncHandler(h);
		});

		this.#router[method](path, ...wrapped);

		return this.after_route_registered(normalizedMethod, path);
	}

	get(...args) {
		return this.register("get", ...args);
	}

	post(...args) {
		return this.register("post", ...args);
	}

	put(...args) {
		return this.register("put", ...args);
	}

	delete(...args) {
		return this.register("delete", ...args);
	}

	patch(...args) {
		return this.register("patch", ...args);
	}
	all(...args) {
		return this.register("all", ...args);
	}
	use(...args) {
		let path = "/";

		const handlers =
			typeof args[0] === "string"
				? ((path = args[0]), args.slice(1))
				: args;

		if (!handlers.length) {
			throw new Error("At least one middleware is required");
		}
		if (typeof path !== "string") {
			throw new TypeError("Middleware path must be a string");
		};
		path = path.replace(/\/+$/, "") || "/";
		if (!path.startsWith("/")) path = "/" + path;
		const wrapped = handlers.map((h) => {
			if (typeof h !== "function") {
				throw new TypeError("Middleware must be a function");
			}
			return this.asyncHandler(h);
		});

		this.#router.use(path, ...wrapped);
		return this;
	}

	build() {
		return Object.freeze(this.#router);
	}

}

export default Router;
