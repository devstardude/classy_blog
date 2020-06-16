const Post = require("../models/Post");
const path = require('path');
var fs = require('fs');

module.exports = async (req, res) => {
  req.post = await Post.findById(req.params.id);

  let post = req.post;
  post.title = req.body.title;
  post.description = req.body.description;
  post.content = req.body.content;
  const imagePath = post.image;
  if (req.files) {
    var filePath = (__dirname + "/../public" + imagePath);
    const {
      image
    } = req.files;

    post.image = `/posts/${image.name}`;

    image.mv(path.resolve(__dirname, '..', 'public/posts', image.name), (error) => {

      try {
        fs.unlinkSync(filePath);
        post = post.save();
        console.log("save success");
        res.redirect("/mypost");
      } catch (e) {
        res.render(`/mypost/edit/${post.id}`, { post: post });
      }
    });

  }
  else {
    try {
      post = await post.save();
      console.log("post save 2 success");
      res.redirect("/mypost");
    } catch (e) {
      res.render(`/mypost/edit/${post.id}`, { post: post });
    }
  }


};