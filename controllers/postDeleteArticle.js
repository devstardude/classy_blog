const Post = require("../models/Post");
var fs = require('fs');
module.exports = async (req, res) => {
    const id = req.params.id;
    const post = await Post.findById(id);
    const imagePath = post.image;
    var filePath = (__dirname+"/../public"+imagePath);
    try{
        fs.unlinkSync(filePath);
        await Post.findByIdAndDelete(req.params.id);
        res.redirect("/mypost");
    }
    catch{
        await Post.findByIdAndDelete(req.params.id);
        res.redirect("/mypost");
    }
     
};