import "dotenv/config";
import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../app";

describe("API integration", () => {
  it("GET /api/health returns status", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("status");
    expect(res.body).toHaveProperty("timestamp");
  });

  it("GET /api/hotels validates query", async () => {
    const res = await request(app).get("/api/hotels?minStars=10");
    expect(res.status).toBe(400);
  });

  it("GET /api/recommendations requires destination", async () => {
    const res = await request(app).get("/api/recommendations");
    expect(res.status).toBe(400);
  });

  it("POST /api/affiliate/click validates body", async () => {
    const res = await request(app)
      .post("/api/affiliate/click")
      .send({ hotelId: "not-a-uuid", sessionId: "" });
    expect(res.status).toBe(400);
  });
});
