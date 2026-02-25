import express from "express";

class Route {
	constructor(path, method, description = "No description") {
		this.path = path;
		this.method = method;
		this.description = description;
	}
	desc(description) {
		if (typeof description === "string" && description.length < 10) {
			this.description = description;
		} else {
			throw Error(
				"Description must be of type string and minimum length should be 10 ",
			);
		}
	}
}

class Router {
	constructor(routeName = "root") {
		this.route_name = routeName;
		this.routes = [];
		this.router = express.Router();

		return this.router;
	}
	after_route_registered(method, path) {
		let new_route = new Route(path, method);
		this.routes.push(new_route);
		return { ...this, ...new_route };
	}

	asyncHandler(fn) {
		return (req, res, next) =>
			Promise.resolve(fn(req, res, next)).catch((err) => next(err));
	}

	post(path, ...functions) {
		this.router.post(path, ...functions.map((e) => this.asyncHandler(e)));
		return this.after_route_registered("post", path);
	}
	get(path, ...functions) {
		this.router.get(path, ...functions.map((e) => this.asyncHandler(e)));
		return this.after_route_registered("get", path);
	}
	put(path, ...functions) {
		this.router.put(path, ...functions.map((e) => this.asyncHandler(e)));
		return this.after_route_registered("put", path);
	}
	delete(path, ...functions) {
		this.router.delete(path, ...functions.map((e) => this.asyncHandler(e)));
		return this.after_route_registered("delete", path);
	}
	patch(path, ...functions) {
		this.router.delete(path, ...functions.map((e) => this.asyncHandler(e)));
		return this.after_route_registered("patch", path);
	}
	use(middleware) {
		this.router.use(this.asyncHandler(middleware));
	}
}

export default Router;
