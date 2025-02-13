require("dotenv").config();
const app = require("./src/app.js");

app.listen(3000, () => {
  console.log("Server is running at Port: 3000");
});
