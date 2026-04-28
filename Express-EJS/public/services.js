const services = [
  {
    name: "Oil Change",
    description:
      "Keep your engine running smoothly with our quick and affordable oil change service.",
    price: 999,
    image:
      "https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Brake Service",
    description:
      "Ensure your safety on the road with our comprehensive brake inspection and repair services.",
    price: 2499,
    image:
      "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Tire Replacement",
    description:
      "Get back on the road with confidence by replacing your worn-out tires with our high-quality options.",
    price: 4999,
    image:
      "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Engine Repair",
    description:
      "Our skilled mechanics can diagnose and repair any engine issues to keep your vehicle running smoothly.",
    price: 7999,
    image:
      "https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Emergency Support",
    description:
      "Stuck on the road? Our emergency support team is available 24/7 to assist you with towing and roadside assistance.",
    price: 1499,
    image:
      "https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&w=1200&q=80",
  },
];

if (typeof window !== "undefined") {
  window.services = services;
}

module.exports = services;
