const { onRequest } = require("firebase-functions/v2/https");
const next = require("next");

const dev = false;
const app = next({ dev, conf: { distDir: ".next" } });
const handle = app.getRequestHandler();

exports.api = onRequest(
    {
        region: "us-central1",
        memory: "1GiB",
    },
    async (req, res) => {
        await app.prepare();
        return handle(req, res);
    }
);
