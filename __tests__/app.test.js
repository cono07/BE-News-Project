const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const testData = require("../db/data/test-data/");
const seed = require("../db/seeds/seed");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET", () => {
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

  describe("/api/articles/:article_id", () => {
    test('status 200 : should return a message "endpoint connected successfully"', () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body: { message } }) => {
          expect(message).toBe("endpoint connected successfully");
        });
    });

    test("status 200 : should return an object matching the id parameter with properties (author, title, article_id, body, topic, created_at, votes)", () => {
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
});
