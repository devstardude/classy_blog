const Post = require("../models/Post");

module.exports = async(req, res)=>{

    const name = req.user.name;
    const posts = await Post.find({username:name}).sort( {_id: -1});
    res.render("myPost",{posts:posts});
};