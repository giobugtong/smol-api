const mongoose = require("mongoose");
const { Schema } = mongoose;

let userSchema = new Schema ({
	firstName: String,
	lastName: String,
	joinDate: { type: Date, default: new Date() },
	email: String,
	password: String,
	isAdmin: { type: Boolean, default: false },
	links: [
		{
            shortUrl: String,
			linkId: String
		}
	]
});

const User = mongoose.model("User", userSchema);

module.exports = User;