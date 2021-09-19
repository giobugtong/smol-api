require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const port = process.env.PORT;
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const linkRoutes = require("./routes/linkRoutes");

mongoose.connect(process.env.DB_CONNECTION, {
	useUnifiedTopology: true
}).then(x => {
	console.log(`Connected to Mongo! Database name: ${x.connections[0].name}`);
}).catch(err => {
	console.error("Error connecting to Mongo!", err);
})

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use("/users", userRoutes);
app.use("/links", linkRoutes);


app.listen(port, () => console.log(`Server is listening to port ${port}!`));