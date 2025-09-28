import rateLimit, { RateLimitRequestHandler } from "express-rate-limit";

// 100 requests per 10 minutes
const limiter: RateLimitRequestHandler = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later",
});

export default limiter;
