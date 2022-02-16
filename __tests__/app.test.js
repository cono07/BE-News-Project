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
            expect(articles);
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

    test("status 404 : should return path not found when incorrect path given", () => {
      return request(app)
        .get("/api/artples")
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("path not found");
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
