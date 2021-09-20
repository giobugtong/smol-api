const mongoose = require("mongoose");
const { Schema } = mongoose;

let linkSchema = new Schema ({
    longUrl: String,
    shortUrl: String,
    urlNickname: { type: String, default: "" },
    qrCode: { type:String, default: "" },
    linkOwner: {
        userId: String,
        email: String,
        firstName: String,
        lastName: String
    },
    numberOfHits: [
        {
            type: Date
        }
    ],
	dateCreated: { type: Date, default: new Date() },
	isActive: { type: Boolean, default: true }
});

const Link = mongoose.model("Link", linkSchema);

module.exports = Link;