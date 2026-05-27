import { medicineService } from "../services/medicine.service";
import { medicineRepository } from "../repositories/medicine.repository";

jest.mock("../repositories/medicine.repository");

const mockRepo = medicineRepository as jest.Mocked<typeof medicineRepository>;

const mockMedicine = {
  id: 1,
  name: "Paracetamol",
  atc_code: "N02BE01",
  form: "tablet" as const,
  strength: "500mg",
  stock: 120,
  threshold: 10,
  is_active: true,
};

describe("Medicine Service", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ---- getAll ----
  describe("getAll", () => {
    it("should return all active medicines", async () => {
      mockRepo.findByFilter.mockResolvedValue([mockMedicine]);

      const result = await medicineService.getAll({});
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Paracetamol");
    });

    it("should filter by search and form", async () => {
      const ibuprofen = {
        ...mockMedicine,
        id: 2,
        name: "Ibuprofen",
        atc_code: "M01AE01",
        form: "tablet" as const,
      };

      // Mock — search=M01 form=tablet -> ibuprofen
      mockRepo.findByFilter.mockResolvedValue([ibuprofen]);

      const result = await medicineService.getAll({ search: "M01", form: "tablet" });

      expect(result).toHaveLength(1);
      expect(result[0].atc_code).toBe("M01AE01");  // checked by findByAtcCode
      expect(result[0].form).toBe("tablet");
      expect(mockRepo.findByFilter).toHaveBeenCalledWith({ search: "M01", form: "tablet" }); // 正しい引数で呼ばれたか
    });

    it("should return empty array when no medicines match", async () => {
      mockRepo.findByFilter.mockResolvedValue([]);

      const result = await medicineService.getAll({ search: "ZZZZZZ" });
      expect(result).toHaveLength(0);
    });


  });

  // ---- getById ----
  describe("getById", () => {
    it("should return a medicine by id", async () => {
      mockRepo.findById.mockResolvedValue(mockMedicine);

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
      mockRepo.findByAtcCode.mockResolvedValue(null); // no duplicate
      mockRepo.create.mockResolvedValue({ ...mockMedicine, id: 2, name: "Ibuprofen" });

      const result = await medicineService.create({
        name: "Ibuprofen",
        atc_code: "M01AE01",
        stock: 60,
      });

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

    it("should throw if ATC code already exists", async () => {
      mockRepo.findByAtcCode.mockResolvedValue(mockMedicine); // duplicate found

      await expect(
        medicineService.create({ name: "Test", atc_code: "N02BE01", stock: 10 })
      ).rejects.toThrow("ATC code N02BE01 is already in use");
    });
  });

  // ---- update ----
  describe("update", () => {
    it("should update a medicine", async () => {
      mockRepo.findById.mockResolvedValue(mockMedicine);  // active
      mockRepo.findByAtcCode.mockResolvedValue(null);     // no duplicate
      mockRepo.update.mockResolvedValue({ ...mockMedicine, stock: 200 });

      const result = await medicineService.update(1, { stock: 200 });
      expect(result.stock).toBe(200);
    });

    it("should throw if medicine not found", async () => {
      mockRepo.findById.mockResolvedValue(null);

      await expect(
        medicineService.update(999, { stock: 200 })
      ).rejects.toThrow("Medicine not found");
    });

    it("should throw if medicine is inactive", async () => {
      mockRepo.findById.mockResolvedValue({ ...mockMedicine, is_active: false });

      await expect(
        medicineService.update(1, { stock: 200 })
      ).rejects.toThrow("Cannot update an inactive medicine");
    });

    it("should throw if ATC code already in use by another medicine", async () => {
      mockRepo.findById.mockResolvedValue(mockMedicine);
      mockRepo.findByAtcCode.mockResolvedValue({ ...mockMedicine, id: 99 }); // different medicine

      await expect(
        medicineService.update(1, { atc_code: "N02BE01" })
      ).rejects.toThrow("ATC code N02BE01 is already in use");
    });
  });

  // ---- delete ----
  describe("delete", () => {
    it("should deactivate a medicine", async () => {
      mockRepo.findById.mockResolvedValue(mockMedicine);  // active
      mockRepo.deactivate.mockResolvedValue();

      await expect(medicineService.delete(1)).resolves.toBeUndefined();
      expect(mockRepo.deactivate).toHaveBeenCalledWith(1);
    });

    it("should throw if medicine not found", async () => {
      mockRepo.findById.mockResolvedValue(null);

      await expect(medicineService.delete(999)).rejects.toThrow("Medicine not found");
    });

    it("should throw if medicine is already inactive", async () => {
      mockRepo.findById.mockResolvedValue({ ...mockMedicine, is_active: false });

      await expect(medicineService.delete(1)).rejects.toThrow("Medicine is already inactive");
    });
  });

});