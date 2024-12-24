import server from "./bootstrap";

const port = process.env.PORT || 3000;

server.start(Number(port));
