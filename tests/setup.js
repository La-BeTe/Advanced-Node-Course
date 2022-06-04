require("dotenv").config();
require("mongoose").connect(process.env.MONGO_URI);
