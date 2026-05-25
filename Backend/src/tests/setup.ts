jest.mock("../db/db", () => ({
  db: {
    query: jest.fn(),
  },
}));