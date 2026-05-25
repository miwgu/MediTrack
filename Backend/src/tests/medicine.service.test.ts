import { medicineService } from "../services/medicine.service";
import { medicineRepository } from "../repositories/medicine.repository";

// Mock the repository
jest.mock("../repositories/medicine.repository");

const mockRepo = medicineRepository as jest.Mocked<typeof medicineRepository>;

describe("Medicine Service", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ---- getAll ----
  describe("getAll", () => {
    it("should return all medicines", async () => {
      mockRepo.findByFilter.mockResolvedValue([
        { id: 1, name: "Paracetamol", atc_code: "N02BE01", form: "tablet", strength: "500mg", stock: 120, threshold: 10 },
      ]);

      const result = await medicineService.getAll({});
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Paracetamol");
    });
  });

  // ---- getById ----
  describe("getById", () => {
    it("should return a medicine by id", async () => {
      mockRepo.findById.mockResolvedValue(
        { id: 1, name: "Paracetamol", atc_code: "N02BE01", form: "tablet", strength: "500mg", stock: 120, threshold: 10 }
      );

      const result = await medicineService.getById(1);
      expect(result?.name).toBe("Paracetamol");
    });

    it("should return null if not found", async () => {
      mockRepo.findById.mockResolvedValue(null);

      const result = await medicineService.getById(999);
      expect(result).toBeNull();
    });
  });

  // ---- create ----
  describe("create", () => {
    it("should create a medicine", async () => {
      const input = { name: "Ibuprofen", atc_code: "M01AE01", stock: 60 };
      mockRepo.create.mockResolvedValue(
        { id: 2, name: "Ibuprofen", atc_code: "M01AE01", form: null, strength: null, stock: 60, threshold: 10 }
      );

      const result = await medicineService.create(input);
      expect(result.id).toBe(2);
      expect(result.name).toBe("Ibuprofen");
    });

    it("should throw if name is missing", async () => {
      await expect(
        medicineService.create({ name: "", atc_code: "M01AE01", stock: 60 })
      ).rejects.toThrow("name is required");
    });

    it("should throw if stock is negative", async () => {
      await expect(
        medicineService.create({ name: "Ibuprofen", atc_code: "M01AE01", stock: -1 })
      ).rejects.toThrow("stock must be >= 0");
    });
  });

  // ---- update ----
  describe("update", () => {
    it("should update a medicine", async () => {
      mockRepo.update.mockResolvedValue(
        { id: 1, name: "Paracetamol", atc_code: "N02BE01", form: "tablet", strength: "500mg", stock: 200, threshold: 10 }
      );

      const result = await medicineService.update(1, { stock: 200 });
      expect(result.stock).toBe(200);
    });
  });

  // ---- delete ----
  describe("delete", () => {
    it("should delete a medicine", async () => {
      mockRepo.deleteById.mockResolvedValue();

      await expect(medicineService.delete(1)).resolves.toBeUndefined();
      expect(mockRepo.deleteById).toHaveBeenCalledWith(1);
    });
  });

});