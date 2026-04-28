const express = require("express");
const features = require("../public/data");
const Service = require("../Module/Service");
const { requireUserAuth } = require("../Middleware/requireUserAuth");
const Booking = require("../Module/Booking");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [services, publicFeedback] = await Promise.all([
      Service.find().populate("addedBy", "name email"),
      Booking.find({
        status: "completed",
        feedbackRating: { $exists: true, $ne: null },
      })
        .populate("user", "name email")
        .populate("service", "name")
        .sort({ feedbackSubmittedAt: -1, createdAt: -1 })
        .limit(4)
        .lean(),
    ]);
    let bookings = [];

    if (req.session.user) {
      bookings = await Booking.find({ user: req.session.user.id })
        .populate("service", "name description image")
        .sort({ createdAt: -1 });
    }

    return res.render("index", {
      features,
      services,
      publicFeedback,
      bookings,
      user: req.session.user || null,
    });
  } catch (error) {
    const fallbackServices = require("../public/services");
    return res.render("index", {
      features,
      services: fallbackServices,
      publicFeedback: [],
      bookings: [],
      user: req.session.user || null,
    });
  }
});

router.get("/services", async (req, res) => {
  try {
    const services = await Service.find().populate("addedBy", "name email");
    return res.render("services", { services });
  } catch (error) {
    const fallbackServices = require("../public/services");
    return res.render("services", { services: fallbackServices });
  }
});

router.get("/features/comprehensive-auto-services", (req, res) => {
  return res.render("features/comprehensiveAutoServices", {
    user: req.session.user || null,
  });
});

router.get("/features/experience-mechanic-workshop", (req, res) => {
  return res.render("features/experiencedMechanics", {
    user: req.session.user || null,
  });
});

router.get("/features/customer-satisfaction", (req, res) => {
  return res.render("features/customerSatisfaction", {
    user: req.session.user || null,
  });
});

router.get("/about", (req, res) => {
  res.render("about");
});

router.get("/contact", (req, res) => {
  res.render("contact");
});

router.get("/bookservice", (req, res) => {
  return res.redirect("/services");
});

router.get("/bookservice/:id", requireUserAuth, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate(
      "addedBy",
      "name email",
    );
    if (!service) {
      return res.status(404).render("404", { message: "Service not found" });
    }
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split("T")[0];
    return res.render("booking/bookingForm", {
      serviceId: service._id,
      serviceName: service.name,
      minDate,
    });
  } catch (error) {
    return res.status(500).render("404", { message: "Something went wrong" });
  }
});

router.get("/service/:id", async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate(
      "addedBy",
      "name email",
    );
    if (!service) {
      return res.status(404).render("404", { message: "Service not found" });
    }
    return res.render("service/detail", { service, user: req.session.user });
  } catch (error) {
    return res.status(500).render("404", { message: "Something went wrong" });
  }
});

router.get("/user/bookings", requireUserAuth, (req, res) => {
  // This will be handled by bookingController.getUserBookings
  require("../Controller/bookingController").getUserBookings(req, res);
});

module.exports = router;
