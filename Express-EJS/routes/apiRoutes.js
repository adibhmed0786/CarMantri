const express = require("express");
const mongoose = require("mongoose");
const Service = require("../Module/Service");
const Booking = require("../Module/Booking");
const { verifyAdmin } = require("../Middleware/adminAuth");

const router = express.Router();
const SERVICE_CACHE_TTL_MS = 15000;
const servicesCache = new Map();

router.get("/admin/services", verifyAdmin, async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(
      Math.max(parseInt(req.query.limit, 10) || 12, 1),
      50,
    );
    const skip = (page - 1) * limit;

    const now = Date.now();
    const cacheKey = `${req.admin.id}:${page}:${limit}`;
    const cachedEntry = servicesCache.get(cacheKey);
    if (cachedEntry && now < cachedEntry.expiresAt) {
      return res.json(cachedEntry.payload);
    }

    const services = await Service.find({ addedBy: req.admin.id })
      .select("name description image price createdAt")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit + 1)
      .lean();

    const hasMore = services.length > limit;
    const items = hasMore ? services.slice(0, limit) : services;

    const payload = { items, page, limit, hasMore };
    servicesCache.set(cacheKey, {
      payload,
      expiresAt: now + SERVICE_CACHE_TTL_MS,
    });

    return res.json(payload);
  } catch (error) {
    return res.status(500).json({ error: "Failed to load services" });
  }
});

router.get("/admin/feedback", verifyAdmin, async (req, res) => {
  try {
    const { service, rating } = req.query;
    const query = {
      status: "completed",
      feedbackRating: { $exists: true, $ne: null },
    };

    if (service && service !== "all") {
      if (!mongoose.Types.ObjectId.isValid(service)) {
        return res.status(400).json({ error: "Invalid service filter" });
      }
      query.service = service;
    }

    if (rating && rating !== "all") {
      const parsedRating = Number(rating);
      if (!Number.isInteger(parsedRating) || parsedRating < 1 || parsedRating > 5) {
        return res.status(400).json({ error: "Invalid rating filter" });
      }
      query.feedbackRating = parsedRating;
    }

    const [items, serviceOptions] = await Promise.all([
      Booking.find(query)
        .select(
          "feedbackRating feedbackComment feedbackSubmittedAt bookingDate serviceDetails user service",
        )
        .populate("user", "name email")
        .populate("service", "name")
        .sort({ feedbackSubmittedAt: -1, createdAt: -1 })
        .lean(),
      Service.find().select("_id name").sort({ name: 1 }).lean(),
    ]);

    return res.json({ items, serviceOptions });
  } catch (error) {
    return res.status(500).json({ error: "Failed to load feedback" });
  }
});

module.exports = router;
