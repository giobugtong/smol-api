const jwt = require('jsonwebtoken');
require("dotenv").config();
const secret = process.env.SECRET;

module.exports.createAccessToken = (authenticatedUser) => {
	const data = {
		id: authenticatedUser._id,
		email: authenticatedUser.email,
		isAdmin: authenticatedUser.isAdmin,
		firstName: authenticatedUser.firstName,
		lastName: authenticatedUser.lastName,
        links: authenticatedUser.links
	}
	return jwt.sign(data, secret, {});
}

module.exports.verifyToken = (req, res, next) => {
	let accessToken = req.headers.authorization;
	if (accessToken) {
		accessToken = accessToken.slice(7);
		jwt.verify(accessToken, secret, (err, decoded) => {
			if (err) {
				res.send({invalidAccessToken: true});
			} else {
				req.decodedUser = decoded;
				next();
			}
		});
	} else res.send({noAccessToken: true});
}

module.exports.verifyIsAdmin = (req, res, next) => (req.decodedUser.isAdmin) ? next() : res.send({isAdmin: false});