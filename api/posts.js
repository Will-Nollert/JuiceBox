// api/users.js

const express = require("express");
const router = express.Router();
const { getAllPosts, createPost } = require("../db"); //added createPost to be destrcuted but not sure this is neede
const { requireUser } = require("./utils");

router.get("/", async (req, res) => {
  const posts = await getAllPosts();

  res.send({
    posts: posts,
  });
});

router.post("/", requireUser, async (req, res, next) => {
  console.log("hit posts");
  const { title, content, tags = "" } = req.body;

  const tagArr = tags.trim().split(/\s+/);
  let postData = {};

  if (tagArr.length) {
    postData.tags = tagArr;
  }

  try {
    postData = { ...postData, authorId: req.user.id, title, content };

    const post = await createPost(postData);

    if (post) {
      res.send({ post });
    } else {
      next({
        name: "Post Error",
        message: "You Shall not Post!",
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

router.use((req, res, next) => {
  console.log("A request is being made to /posts");

  next();
});

module.exports = router;
