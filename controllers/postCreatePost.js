const path = require('path');
const Post = require("../models/Post");
const auth = require('../middleware/auth');

module.exports = (req, res) => {
    const body ={
        ...req.body,
        username:req.user.name,
        email:req.user.email
    };
    try {
        const {
            image
        } = req.files;
        image.mv(path.resolve(__dirname, '..', 'public/posts', image.name), (error) => {
             Post.create({
                ...body,
                image: `/posts/${image.name}`
            }, (error, post) => {
                res.redirect("/");
            });
        });
    }
    catch{
         Post.create(body, (error, post) => {
            res.redirect("/");
        });
    }

};