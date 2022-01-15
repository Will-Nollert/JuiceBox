const express = require("express");
const apiRouter = express.Router();
const usersRouter = require("./users");
const postsRouter = require("./posts");
const tagsRouter = require("./tags");

const { JWT_SECRET } = process.env;
const jwt = require("jsonwebtoken");
const { getUserById } = require("../db");

module.exports = apiRouter;

apiRouter.use((req, res, next) => {
  if (req.user) {
    console.log("User is set: ", req.user);
  }

  next();
});

// token middleware to verify and attach user object
apiRouter.use(async (req, res, next) => {
  const prefix = "Bearer ";
  const auth = req.header("Authorization");

  if (!auth) {
    next();
  } else if (auth.startsWith(prefix)) {
    // 'Bearer token' -> 'Bearer token'.slice(7) -> 'token'
    const token = auth.slice(prefix.length);

    try {
      const { id } = jwt.verify(token, JWT_SECRET);

      if (id) {
        req.user = await getUserById(id);
        next();
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  } else {
    next({
      name: "AuthorizationHeaderError",
      message: `Authorization token must start with ${prefix}`,
    });
  }
});

apiRouter.use("/users", usersRouter);
apiRouter.use("/posts", postsRouter);
apiRouter.use("/tags", tagsRouter);

apiRouter.use((error, req, res, next) => {
  res.send({
    name: error.name,
    message: error.message,
  });
});
