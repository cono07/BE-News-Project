const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const testData = require("../db/data/test-data/");
const seed = require("../db/seeds/seed");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET", () => {
  //-- Topics --//
  describe("/api/topics", () => {
    test("status 200: should return a message of 'endpoint connected successfully'", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body: { message } }) => {
          expect(message).toBe("endpoint connected successfully");
        });
    });

    test('status 200: should return 3 objects, each with the keys of "slug" and "description', () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body: { topics } }) => {
          expect(topics).toHaveLength(3);
          topics.forEach((topic) => {
            expect(topic).toEqual(
              expect.objectContaining({
                slug: expect.any(String),
                description: expect.any(String),
              })
            );
          });
        });
    });

    test('Status 404: should receive a message of "path not found" if incorrect path requested', () => {
      return request(app)
        .get("/api/toppics")
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("path not found");
        });
    });
  });

  //-- Articles --//
  describe("/api/articles/:article_id", () => {
    test('status 200 : should return a message "endpoint connected successfully"', () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body: { message } }) => {
          expect(message).toBe("endpoint connected successfully");
        });
    });

    test("status 200 : should return an object matching the id parameter with properties (author, title, article_id, body, topic, created_at, votes, comment_count)", () => {
      return request(app)
        .get("/api/articles/3")
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: "sam",
              title: "Eight pug gifs that remind me of mitch",
              article_id: 3,
              body: "some gifs",
              topic: "mitch",
              created_at: "2020-11-03T09:12:00.000Z",
              votes: 0,
              comment_count: 2,
            })
          );
        });
    });

    test('status 400: should receive message "bad request" when string type entered for article id', () => {
      return request(app)
        .get("/api/articles/one")
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("bad request");
        });
    });

    test('status 404: should receive message "path not found" when incorrect path entered', () => {
      return request(app)
        .get("/api/articless/1")
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("path not found");
        });
    });
  });

  describe("/api/articles", () => {
    test("status 200", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { message } }) => {
          expect(message).toBe("endpoint connected successfully");
        });
    });

    test("status 200: should return an array of article objects. Each should have property of: author, title, article_id, created_at and votes", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          articles.forEach((article) => {
            expect(articles).toHaveLength(12);
            expect(article).toEqual(
              expect.objectContaining({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
              })
            );
          });
        });
    });

    test("status 200 : should return an array of articles which includes a comment_count property", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                comment_count: expect.any(Number),
              })
            );
          });
        });
    });

    test("status 404 : should return path not found when incorrect path given", () => {
      return request(app)
        .get("/api/artples")
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("path not found");
        });
    });
  });

  describe("/api/articles (queries)", () => {
    test("status 200 : should get all articles and fetch using user queries of sort_by", () => {
      return request(app)
        .get("/api/articles?sort_by=title")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("title");
        });
    });

    test("status 200 : should return articles in order of either DESC or ASC", () => {
      return request(app)
        .get("/api/articles?sort_by=title&order=desc")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("title", { descending: true });
        });
    });

    test("status 200 : should return articles filtered by topic value", () => {
      return request(app)
        .get("/api/articles?sort_by=title&order=desc&topic=cats")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toHaveLength(1);
          expect(articles).toBeSortedBy("title", { descending: true });
        });
    });

    test("status 400 : should return message bad request if given a topic that does not exist in the table", () => {
      return request(app)
        .get("/api/articles?sort_by=title&order=desc&topic=rubbish")
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("bad request - topic does not exist");
        });
    });

    test("status 400 : should return message bad request if given an order type that does not exist", () => {
      return request(app)
        .get("/api/articles?sort_by=title&order=rubbish&topic=cats")
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("bad request - order type does not exist");
        });
    });

    test("status 400 : should return message bad request if given a sort_by that does not exist", () => {
      return request(app)
        .get("/api/articles?sort_by=rubbish&order=desc&topic=cats")
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("bad request - sort type does not exist");
        });
    });
  });

  //-- Users --//
  describe("/api/users", () => {
    test("200 status: Success message will be received.", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body: { message } }) => {
          expect(message).toBe("endpoint connected successfully");
        });
    });

    test('200 status: should return an object of users, with a property of "username" for each user', () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body: { users } }) => {
          expect(users).toHaveLength(4);
          users.forEach((user) => {
            expect(user).toEqual(
              expect.objectContaining({
                username: expect.any(String),
              })
            );
          });
        });
    });

    test("404: path not found when wrong path entered ", () => {
      return request(app)
        .get("/api/userrr")
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("path not found");
        });
    });
  });
});

//-- Comments --//
describe("/api/articles/:article_id/comments", () => {
  test('status 200 : should return message "endpoint connected successfully', () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { message } }) => {
        expect(message).toBe("endpoint connected successfully");
      });
  });

  test("status 200 : should return an array of comments for the given article_id. Properties: comment_id, votes, created_at, author, body", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toHaveLength(11);
        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
            })
          );
        });
      });
  });

  test('status 404 : should return message of "article does not exist" when passed an article_id that is not in the database', () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("article does not exist");
      });
  });
});

describe("PATCH", () => {
  describe("/api/articles/:article_id", () => {
    test('status 200 : returns message "updated successfully"', () => {
      const voteUpdate = { inc_votes: 5 };
      return request(app)
        .patch("/api/articles/3")
        .send(voteUpdate)
        .expect(201)
        .then(({ body: { article, message } }) => {
          expect(message).toBe("updated successfully");
          expect(article).toEqual(
            expect.objectContaining({
              author: "icellusedkars",
              title: "Eight pug gifs that remind me of mitch",
              article_id: 3,
              body: "some gifs",
              topic: "mitch",
              created_at: expect.any(String),
              votes: 5,
            })
          );
        });
    });
  });

  test('400 status: should return message "bad request" if vote is empty', () => {
    const voteUpdate = { inc_votes: "" };
    return request(app)
      .patch("/api/articles/3")
      .send(voteUpdate)
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("bad request");
      });
  });

  test('400 status: should return message "bad request" if vote is not numerical or body object is empty', () => {
    const voteUpdate = { inc_votes: "kj<!" };
    return request(app)
      .patch("/api/articles/3")
      .send(voteUpdate)
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("bad request");

        const voteUpdateEmpty = {};
        return request(app)
          .patch("/api/articles/3")
          .send(voteUpdateEmpty)
          .expect(400)
          .then(({ body: { message } }) => {
            expect(message).toBe("bad request");
          });
      });
  });

  test("status 404: returns message article_id does not exist", () => {
    const voteUpdate = { inc_votes: 5 };
    return request(app)
      .patch("/api/articles/999")
      .send(voteUpdate)
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("article does not exist");
      });
  });

  test("status 404: returns bad request message when article id is not an integer", () => {
    const voteUpdate = { inc_votes: 5 };
    return request(app)
      .patch("/api/articles/banana")
      .send(voteUpdate)
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("bad request");
      });
  });
});

describe("POST", () => {
  describe("/api/articles/:article_id/comments", () => {
    test("status 201 : should return an updated comment object with a success message ", () => {
      const commentToSend = {
        username: "rogersop",
        body: "the cats are rising up!",
      };
      return request(app)
        .post("/api/articles/5/comments")
        .send(commentToSend)
        .expect(201)
        .then(({ body: { comment } }) => {
          expect(comment).toEqual(
            expect.objectContaining({
              body: "the cats are rising up!",
            })
          );
        });
    });
  });

  test("status 400 : should return message bad request when string entered for article_id", () => {
    const commentToSend = {
      username: "rogersop",
      body: "the cats are rising up!",
    };
    return request(app)
      .post("/api/articles/five/comments")
      .send(commentToSend)
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toEqual("bad request");
      });
  });

  test("status 400 : should return message bad input if the username sent does not exist", () => {
    const commentToSend = {
      username: "crazyCat",
      body: "The cats are rising!",
    };
    return request(app)
      .post("/api/articles/5/comments")
      .send(commentToSend)
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("bad input");
      });
  });

  test("status 404 : should return message bad input if the comment body sent is empty", () => {
    const commentToSend = {
      username: "crazyCat",
      body: "",
    };
    return request(app)
      .post("/api/articles/5/comments")
      .send(commentToSend)
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("bad input");
      });
  });
});
