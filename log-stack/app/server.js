const app = require("./index");
const logger = require("./logger");

const port = process.env.PORT || 3000;

app.listen(port, () => {
  logger.info("Server started", { port });
});
