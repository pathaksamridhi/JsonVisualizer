export const data = {
  Test: {
    id: 202,
    name: "Anika Sharma",
    email: "anika.sharma@example.in",
    profile: {
      age: 28,
      gender: "female",
      address: {
        street: "47 MG Road",
        city: "Mumbai",
        state: "MH",
        postalCode: "400001",
      },
      preferences: {
        newsletter: false,
        notifications: {
          email: true,
          sms: true,
        },
      },
    },
    orders: [
      {
        orderId: "IN0012",
        date: "2025-05-10",
        items: [
          { productId: "X101", quantity: 1, price: 249.5 },
          { productId: "X102", quantity: 2, rate: 135.75 },
        ],
      },
      {
        orderId: "IN0034",
        date: "2025-06-05",
        items: [
          { productId: "X103", quantity: 3, price: 89.99 },
        ],
      },
    ],
    role: "manager",
    createdAt: "2025-05-01T09:30:00Z",
  },
};
