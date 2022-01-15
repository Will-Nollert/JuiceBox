// api/users.js

const express = require("express");
const router = express.Router();
const { getAllPosts, createPost, updatePost, getPostById } = require("../db"); //added createPost to be destrcuted but not sure this is neede
const { requireUser } = require("./utils");

router.get("/", async (req, res) => {
  let posts = await getAllPosts();

  posts = posts.filter((posts) => {
    if (posts.active) {
      return true;
    }
    if (req.user && post.author.id === req.user.id) {
      return true;
    }

    return false;
  });
  res.send({ posts });
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

router.patch("/:postId", requireUser, async (req, res, next) => {
  const { postId } = req.params;
  const { title, content, tags } = req.body;

  const updateFields = {};

  if (tags && tags.length > 0) {
    updateFields.tags = tags.trim().split(/\s+/);
  }

  if (title) {
    updateFields.title = title;
  }

  if (content) {
    updateFields.content = content;
  }

  try {
    const originalPost = await getPostById(postId);

    if (originalPost.author.id === req.user.id) {
      const updatedPost = await updatePost(postId, updateFields);
      res.send({ post: updatedPost });
    } else {
      next({
        name: "UnauthorizedUserError",
        message: "Dont even try and update a post that is not yours",
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

router.delete("/:postId", requireUser, async (req, res, next) => {
  try {
    const post = await getPostById(req.params.postId);

    if (post && post.author.id === req.user.id) {
      const updatedPost = await updatePost(post.id, { active: false });

      res.send({ post: updatedPost });
    } else {
      // if there was a post, throw UnauthorizedUserError, otherwise throw PostNotFoundError
      next(
        post
          ? {
              name: "UnauthorizedUserError",
              message: "You cannot delete a post which is not yours",
            }
          : {
              name: "PostNotFoundError",
              message: "That post does not exist",
            }
      );
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = router;
