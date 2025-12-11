export const parkingService = {
  getParkingSlots: async () => {
    // Return fake data for now
    return {
      data: [
        { id: "A-01", occupied: false },
        { id: "A-02", occupied: true },
      ],
    };
  },
};