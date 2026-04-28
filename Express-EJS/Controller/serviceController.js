const Service = require("../Module/Service");

const getServicesPage = async (req, res) => {
  try {
    const services = await Service.find().populate("addedBy", "name email");
    return res.render("admin/services", { services, admin: req.session.admin });
  } catch (error) {
    return res.render("admin/services", {
      services: [],
      admin: req.session.admin,
      error: "Failed to load services",
    });
  }
};

const addService = async (req, res) => {
  try {
    const { name, description, image, price } = req.body;
    const parsedPrice = Number(price);

    if (
      !name ||
      !description ||
      !image ||
      price === undefined ||
      price === null ||
      price === "" ||
      Number.isNaN(parsedPrice)
    ) {
      return res.status(400).json({
        error: "All fields are required, including valid price",
      });
    }

    if (parsedPrice < 0) {
      return res.status(400).json({
        error: "Price cannot be negative",
      });
    }

    const service = await Service.create({
      name,
      description,
      image,
      price: parsedPrice,
      addedBy: req.admin.id,
    });

    return res.status(201).json({
      message: "Service added successfully",
      service,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to add service",
    });
  }
};

const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findByIdAndDelete(id);
    if (!service) {
      return res.status(404).json({
        error: "Service not found",
      });
    }

    return res.status(200).json({
      message: "Service deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to delete service",
    });
  }
};

const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image, price } = req.body;
    const parsedPrice = Number(price);

    if (
      !name ||
      !description ||
      !image ||
      price === undefined ||
      price === null ||
      price === "" ||
      Number.isNaN(parsedPrice)
    ) {
      return res.status(400).json({
        error: "All fields are required, including valid price",
      });
    }

    if (parsedPrice < 0) {
      return res.status(400).json({
        error: "Price cannot be negative",
      });
    }

    const service = await Service.findByIdAndUpdate(
      id,
      {
        name,
        description,
        image,
        price: parsedPrice,
      },
      { new: true, runValidators: true },
    );

    if (!service) {
      return res.status(404).json({
        error: "Service not found",
      });
    }

    return res.status(200).json({
      message: "Service updated successfully",
      service,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to update service",
    });
  }
};

module.exports = {
  getServicesPage,
  addService,
  deleteService,
  updateService,
};
