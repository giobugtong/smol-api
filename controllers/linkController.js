const Link = require("../models/linkModel");
const User = require("../models/userModel");

module.exports.createLink = async (req, res) => {
    const { body, decodedUser } = req;

    const hexUrl = async () => { // Ensures uniqueness of random short URL
        let randShortUrl = [...Array(8)].map(() => Math.floor(Math.random() * 16).toString(16)).join("");
        await Link.find({})
        .catch(err => console.log(err))
        .then(result => {
            index = result.findIndex(link => link.shortUrl === randShortUrl);
        })
        if (index !== -1) {
            hexUrl();
        } else {
            return randShortUrl;
        }
    }

    await User.findOne({_id: decodedUser.id})
    .then(foundUser => {
        return user = foundUser;
    })
    .catch(err => console.log(err));

    if (!body.shortUrl) { //No custom short URL entered in the frontend
        let randomUrl = hexUrl();
        randomUrl.then(result => {
            if (result) {
                const newLink = new Link({
                    longUrl: body.longUrl,
                    shortUrl: result,
                    linkOwner: {
                        userId: decodedUser.id,
                        email: decodedUser.email,
                        firstName: decodedUser.firstName,
                        lastName: decodedUser.lastName
                    }
                });
                user.links.push({shortUrl: newLink.shortUrl}); // Pushes the shortUrl to the user's links property for viewing and editing later
                user.save((err, savedUser) => (err) ? console.log(err) : console.log(savedUser));
                newLink.save((err, savedLink) => (err) ? console.log(err) : res.send(savedLink));
            }
        })
    } else { // User enters a custom short URL in the frontend
        Link.findOne({shortUrl: body.shortUrl}, (err, foundLink) => {
            if (err) {
                res.send({error: err.name});
            } else if (foundLink) {
                res.send({shortUrlExists: true});
            } else {
                const newLink = new Link({
                    longUrl: body.longUrl,
                    shortUrl: body.shortUrl,
                    linkOwner: {
                        userId: decodedUser.id,
                        email: decodedUser.email,
                        firstName: decodedUser.firstName,
                        lastName: decodedUser.lastName
                    }
                });
                user.links.push({shortUrl: newLink.shortUrl, linkId: newLink._id}); // Pushes the shortUrl to the user's links property for viewing and editing later
                user.save((err, savedUser) => (err) ? console.log(err) : console.log(savedUser));
                newLink.save((err, savedLink) => (err) ? console.log(err) : res.send(savedLink));
            }
        })
    }
}

module.exports.createLinkAsGuest = (req, res) => {
    const { body } = req;

    const hexUrl = async () => { // Ensures uniqueness of random short URL
        let randShortUrl = [...Array(8)].map(() => Math.floor(Math.random() * 16).toString(16)).join("");
        await Link.find({})
        .catch(err => console.log(err))
        .then(result => {
            index = result.findIndex(link => link.shortUrl === randShortUrl);
        })
        if (index !== -1) {
            hexUrl();
        } else {
            return randShortUrl;
        }
    }

    if (!body.shortUrl) { //No custom short URL entered in the frontend
        let randomUrl = hexUrl();
        randomUrl.then(result => {
            if (result) {
                const newLink = new Link({
                    longUrl: body.longUrl,
                    shortUrl: result,
                    linkOwner: []
                });
                newLink.save((err, savedLink) => (err) ? console.log(err) : res.send(savedLink));
            }
        })
    } else { // User enters a custom short URL in the frontend
        Link.findOne({shortUrl: body.shortUrl}, (err, foundLink) => {
            if (err) {
                res.send({error: err.name});
            } else if (foundLink) {
                res.send({shortUrlExists: true});
            } else {
                const newLink = new Link({
                    longUrl: body.longUrl,
                    shortUrl: body.shortUrl,
                    linkOwner: []
                });
                newLink.save((err, savedLink) => (err) ? console.log(err) : res.send(savedLink));
            }
        })
    }
}

module.exports.retrieveLink = (req, res) => {
    Link.findOne({shortUrl: req.body.shortUrl}, (err, foundLink) => {
        if (err) {
            res.send({error: err});
        } else if (foundLink) {
            res.send(foundLink);
        } else {
            res.send({linkNotFound: true});
        }
    })
}

module.exports.addToHits = (req, res) => {
    Link.findOne({shortUrl: req.body.shortUrl}, (err, foundLink) => {
        if (err) {
            res.send({error: err});
        } else if (foundLink) {
            foundLink.numberOfHits.push(new Date())
            foundLink.save((err, savedLink) => err ? res.send({error: err}) : res.send(savedLink));
        } else {
            res.send({linkNotFound: true});
        }
    })
}

module.exports.toggleStatus = (req, res) => {
    Link.findOne({_id: req.body.linkId}, (err, foundLink) => {
        if (err) {
            res.send({error: err});
        } else if (foundLink) {
            if (foundLink.isActive) {
                foundLink.isActive = false;
                foundLink.save(err => err ? console.log(err) : res.send({deactivated : true}));
            } else {
                foundLink.isActive = true;
                foundLink.save(err => err ? console.log(err) : res.send({activated : true}));
            }
        } else {
            res.send({linkNotFound: true});
        }
    })
}

module.exports.setUrlNickname = (req, res) => {
    Link.findOne({_id: req.body.linkId}, (err, foundLink) => {
        if (err) {
            res.send({error: err});
        } else if (foundLink) {
            foundLink.urlNickname = req.body.newNickname;
            foundLink.save(err => err ? console.log(err) : res.send({nicknameChanged : true}));
        } else {
            res.send({linkNotFound: true});
        }
    })
}