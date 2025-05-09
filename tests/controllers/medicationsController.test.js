const {
  getAllMedicationsController,
  getMedicationController,
  createMedicationController,
  updateMedicationController,
} = require("../../controllers/medicationsController");
const {
  medications: { medication1, medication2 },
} = require("../data/testData.json"); // Mocked test data

const pool = {
  query: jest.fn(), // Mock the query method of the database connection
};

describe("Medications Controller", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  describe("getMedications", () => {
    it("should return all medications", async () => {
      // Mock the database query
      pool.query.mockResolvedValueOnce({
        rows: [medication1, medication2],
      });

      // Mock Express req and res objects
      const req = {};
      const res = {
        locals: { pgPool: pool }, // Attach the mock database to res.locals
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getAllMedicationsController(req, res);

      // Assertions
      expect(pool.query).toHaveBeenCalledWith("SELECT * FROM medications");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([medication1, medication2]);
    });
  });

  describe("getMedicationById", () => {
    it("should return a medication by ID", async () => {
      pool.query.mockResolvedValueOnce({
        rows: [medication1],
      });

      const req = { params: { medicationId: 1 } };
      const res = {
        locals: { pgPool: pool }, // Attach the mock database to res.locals
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getMedicationController(req, res);

      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM medications WHERE id = $1;",
        [1]
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(medication1);
    });
  });

  describe("createMedication", () => {
    it("should create a new medication", async () => {
      pool.query.mockResolvedValueOnce({
        rows: [medication1],
      });

      const req = {
        body: {
          id: 1,
          name: "Medication 1",
          description: "Description 1",
          dosage: "Dosage 1",
          status: "active",
          type: "type1",
          user_id: 1,
          instructions: "Take once a day",
        },
      };
      const res = {
        locals: { pgPool: pool }, // Attach the mock database to res.locals
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await createMedicationController(req, res);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO medications"),
        [
          1,
          "Medication 1",
          "Description 1",
          "Dosage 1",
          "active",
          "type1",
          1,
          "Take once a day",
        ]
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(medication1);
    });
  });

  describe("updateMedication", () => {
    it("should update an existing medication", async () => {
      pool.query.mockResolvedValueOnce({
        rows: [{...medication1, name: "Updated Medication" }],
      });

      const req = {
        params: { medicationId: 1 },
        body: {
          id: 1,
          name: "Updated Medication"
        },
      };
      const res = {
        locals: { pgPool: pool }, // Attach the mock database to res.locals
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await updateMedicationController(req, res);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining("UPDATE medications"),
        [
          "Updated Medication",
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          1,
        ]
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({...medication1, name: "Updated Medication" });
    });
  });
});
