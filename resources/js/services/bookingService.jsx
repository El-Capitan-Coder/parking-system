export const bookingService = {
  getRecentBookings: async () => {
    // Return fake data for now
    return {
      data: [
        { id: 1, slot: "A-01", status: "Approved" },
        { id: 2, slot: "A-02", status: "Pending" },
      ],
    };
  },
};