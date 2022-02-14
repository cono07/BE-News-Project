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
  });
});
