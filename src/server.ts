import http, { IncomingMessage, ServerResponse } from "http";
import { promises as fs } from "fs";
import { registerPartialTemplate, renderTemplate } from "./view";
import { routes } from "./router";
import "dotenv/config";

const hostname = process.env.HOST || "localhost";
const port = parseInt(process.env.PORT || "3000");

registerPartialTemplate("Header", "src/views/Header.hbs");
registerPartialTemplate("Footer", "src/views/Footer.hbs");

/**
 * A static file is a file that the client requests for
 * directly. This is anything with a valid file extension.
 * Within the context of the web, this is usually .html,
 * .css, .js, and any image/video/audio file types.
 */
const serveStaticFile = async (url: string, res: ServerResponse) => {
    const filePath = `.${url}`;
    const file = await fs.readFile(filePath);

    return res.end(file);
};

const handleRequest = async (req: IncomingMessage, res: ServerResponse) => {
    console.log(`${req.method} ${req.url}`);

    // If the request URL matches a file extension, serve the file.
    if (req.url?.match(/.*\..*/)) {
        return await serveStaticFile(req.url, res);
    }

    let url;

    // If the request URL matches a Pokemon ID, use the Pokemon ID route.
    if (req.url?.match(/\/pokemon\/\d+/)) {
        url = "/pokemon/:id";
    } else {
        url = req.url!;
    }

    // If the request method and URL match a route, grab that handler.
    const handler = routes[req.method!][url];

    if (handler) {
        await handler(req, res);
    } else {
        res.statusCode = 404;
        res.setHeader("Content-Type", "text/html");
        res.end(
            await renderTemplate("src/views/ErrorView.hbs", {
                title: "Error",
                message: `Route not found: ${req.url}`,
            }),
        );
    }
};

const server = http.createServer(handleRequest);

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
