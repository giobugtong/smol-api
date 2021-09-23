const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const { createAccessToken } = require("../auth");
const Link = require("../models/linkModel");

module.exports.register = (req, res) => {
    let { body } = req;
    let hashedPassword = bcrypt.hashSync(body.password, 10);
    User.findOne({email: body.email}, (err, foundUser) => {
        if (err) {
            res.send({error: err});
        } else if (foundUser) {
            res.send({emailExists: true});
        } else {
            let newUser = new User({
                firstName: body.firstName,
                lastName: body.lastName,
                email: body.email,
                password: hashedPassword
            });
            newUser.save((err, registeredUser) => (err) ? res.send(err) : res.send(registeredUser));
        }
    })
}

module.exports.login = (req, res) => {
    let { body } = req;
    User.findOne({email: body.email}, (err, foundUser) => {
        if (err) {
            res.send({error: err});
        } else {
            if (foundUser) { 
                let isPasswordCorrect = bcrypt.compareSync(body.password, foundUser.password);
                (isPasswordCorrect) ?
                    res.send({accessToken: createAccessToken(foundUser), foundUser: foundUser}) :
                    res.send({incorrectPassword: true});
            } else res.send({unregisteredUser: true});
        }
    });
}

module.exports.profile = (req, res) => {
    User.findOne({_id: req.decodedUser.id}, (err, foundUser) => {
        if (err) {
            res.send({error: true});
        } else if (foundUser) {
            res.send(foundUser);
        }
    });
}

module.exports.saveStoredLinks = (req, res) => {
    const assignLinkOwner = linkArray => {
        linkArray.forEach(link => {
            Link.findOne({_id: link.linkId })
            .then(result => {
                result.linkOwner.userId = req.body.userId;
                result.save();
            })
            .catch(err => console.log(err))
        })
    }

    User.findOne({_id: req.body.userId}, (err, foundUser) => {
        if (err) {
            res.send({error: true});
        } else if (foundUser) {
            assignLinkOwner(req.body.arrayOfLinks)
            foundUser.links = [...foundUser.links, ...req.body.arrayOfLinks];
            foundUser.save((err, savedUser) => err ? res.send({error: err}) : res.send(true));
        }
    });
}