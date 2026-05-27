import { orderService } from "../services/order.service";
import { orderRepository } from "../repositories/order.repository";

jest.mock("../repositories/order.repository");

const mockRepo = orderRepository as jest.Mocked<typeof orderRepository>;

const mockOrder = {
  id: 1,
  status: "SENT" as const,
  unit: "ICU",
  items: [
    { id: 1, order_id: 1, medicine_id: 1, quantity: 5 }
  ],
  created_at: "2026-01-01",
  updated_at: "2026-01-01",
};

describe("Order Service", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ---- getAll ----
    describe("getAll", () => {
    it("should return all orders", async () => {
        mockRepo.findAll.mockResolvedValue([mockOrder]);

        const result = await orderService.getAll({});
        expect(result).toHaveLength(1);
        expect(result[0].unit).toBe("ICU");
    });

    it("should return empty array when no orders match", async () => {
        mockRepo.findAll.mockResolvedValue([]);

        const result = await orderService.getAll({ unit: "UNKNOWN" });
        expect(result).toHaveLength(0);
    });

    it("should filter by unit and status", async () => {
      const confirmedOrder = { ...mockOrder, status: "CONFIRMED" as const };
      mockRepo.findAll.mockResolvedValue([confirmedOrder]); 

      const result = await orderService.getAll({ unit: "ICU", status: "CONFIRMED" });    
      
      expect(result).toHaveLength(1);
      expect(result[0].unit).toBe("ICU");
      expect(result[0].status).toBe("CONFIRMED");
      expect(mockRepo.findAll).toHaveBeenCalledWith({ unit: "ICU", status: "CONFIRMED" });
    });

    it("should filter by order id", async () => {
      mockRepo.findAll.mockResolvedValue([mockOrder]); 

      const result = await orderService.getAll({ id: 1 });   
       
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
      expect(mockRepo.findAll).toHaveBeenCalledWith({ id: 1 });
    });

    it("should return empty array when order id not found", async () => {
      mockRepo.findAll.mockResolvedValue([]);

      const result = await orderService.getAll({ id: 999 });
      expect(result).toHaveLength(0);
    });
  });

  // ---- getById ----
  describe("getById", () => {
    it("should return an order by id", async () => {
      mockRepo.findById.mockResolvedValue(mockOrder);

      const result = await orderService.getById(1);
      expect(result?.id).toBe(1);
      expect(result?.unit).toBe("ICU");
    });

    it("should return null if not found", async () => {
      mockRepo.findById.mockResolvedValue(null);

      const result = await orderService.getById(999);
      expect(result).toBeNull();
    });
  });

  // ---- create ----
  describe("create", () => {
    it("should create an order", async () => {
      mockRepo.create.mockResolvedValue(mockOrder);

      const result = await orderService.create({
        unit: "ICU",
        items: [{ medicine_id: 1, quantity: 5 }],
      });

      expect(result.unit).toBe("ICU");
      expect(result.status).toBe("SENT");
    });

    it("should throw if unit is missing", async () => {
      await expect(
        orderService.create({ unit: "", items: [{ medicine_id: 1, quantity: 5 }] })
      ).rejects.toThrow("unit is required");
    });

    it("should throw if items are empty", async () => {
      await expect(
        orderService.create({ unit: "ICU", items: [] })
      ).rejects.toThrow("items are required");
    });

    it("should throw if quantity is 0 or less", async () => {
      await expect(
        orderService.create({ unit: "ICU", items: [{ medicine_id: 1, quantity: 0 }] })
      ).rejects.toThrow("quantity must be > 0");
    });
  });

  // ---- updateStatus ----
  describe("updateStatus", () => {
    it("should transition from SENT to CONFIRMED", async () => {
      mockRepo.findById.mockResolvedValue(mockOrder); // SENT
      mockRepo.updateStatus.mockResolvedValue({ ...mockOrder, status: "CONFIRMED" });

      const result = await orderService.updateStatus(1, { status: "CONFIRMED" });
      expect(result.status).toBe("CONFIRMED");
    });

    it("should transition from CONFIRMED to DELIVERED and decrease stock", async () => {
      const confirmedOrder = { ...mockOrder, status: "CONFIRMED" as const };
      mockRepo.findById.mockResolvedValue(confirmedOrder);
      mockRepo.decreaseStock.mockResolvedValue();
      mockRepo.updateStatus.mockResolvedValue({ ...confirmedOrder, status: "DELIVERED" });

      const result = await orderService.updateStatus(1, { status: "DELIVERED" });

      expect(result.status).toBe("DELIVERED");
      expect(mockRepo.decreaseStock).toHaveBeenCalledWith(1); // it shows that decreaseStock is called
    });

    it("should NOT decrease stock when transitioning to CONFIRMED", async () => {
      mockRepo.findById.mockResolvedValue(mockOrder); // SENT
      mockRepo.updateStatus.mockResolvedValue({ ...mockOrder, status: "CONFIRMED" });

      await orderService.updateStatus(1, { status: "CONFIRMED" });

      expect(mockRepo.decreaseStock).not.toHaveBeenCalled(); // it shows that decreaseStock is not called
    });

    it("should throw if order not found", async () => {
      mockRepo.findById.mockResolvedValue(null);

      await expect(
        orderService.updateStatus(999, { status: "CONFIRMED" })
      ).rejects.toThrow("Order not found");
    });

    it("should throw on invalid transition SENT to DELIVERED", async () => {
      mockRepo.findById.mockResolvedValue(mockOrder); // SENT

      await expect(
        orderService.updateStatus(1, { status: "DELIVERED" })
      ).rejects.toThrow("Cannot transition from SENT to DELIVERED");
    });

    it("should throw on invalid transition DELIVERED to CONFIRMED", async () => {
      const deliveredOrder = { ...mockOrder, status: "DELIVERED" as const };
      mockRepo.findById.mockResolvedValue(deliveredOrder);

      await expect(
        orderService.updateStatus(1, { status: "CONFIRMED" })
      ).rejects.toThrow("Cannot transition from DELIVERED to CONFIRMED");
    });

    it("should throw on invalid transition CONFIRMED to SENT", async () => {
      const confirmedOrder = { ...mockOrder, status: "CONFIRMED" as const };
      mockRepo.findById.mockResolvedValue(confirmedOrder);

      await expect(
        orderService.updateStatus(1, { status: "SENT" })
      ).rejects.toThrow("Cannot transition from CONFIRMED to SENT");
    });
  });

});