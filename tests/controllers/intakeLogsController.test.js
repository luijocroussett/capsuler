const {getAllIntakeLogsController, getAllIntakeLogsByUserIdController, getAllIntakeLogsByDateRangeController, getUserIntakeLogsByDateRangeController, createIntakeLogController, deleteIntakeLogController, updateIntakeLogController} = require('../../controllers/intakeController');
const {intakeLogs: {intake1, intake2}} = require('../data/testData.json'); // Mocked test data  
const pool = {
  query: jest.fn(), // Mock the query method of the database connection
};

const req = {
  params: {},
  body: {},
};
const res = {
  locals: { pgPool: pool }, // Attach the mock database to res.locals
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};
const next = jest.fn(); // Mock the next function for middleware

describe("Intake Logs Controller", () => {
    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks after each test
    });
    
    describe("getAllIntakeLogsController", () => {
        it("should return all intake logs", async () => {
            // Mock the database query
            pool.query.mockResolvedValueOnce({
                rows: [intake1, intake2],
            });
    
            await getAllIntakeLogsController(req, res);
    
            // Assertions
            expect(pool.query).toHaveBeenCalledWith("SELECT * FROM intake_logs;");
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([intake1, intake2]);
        });

        it ("should handle errors", async () => {
            pool.query.mockRejectedValueOnce(new Error("Database error"));

            await getAllIntakeLogsController(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: "Failed to fetch intakes",
            });
        });
    });
    
    describe("getAllIntakeLogsByUserIdController", () => {
        it("should return all intake logs by user ID", async () => {
        req.params.userId = 1; // Mock user ID
    
        pool.query.mockResolvedValueOnce({
            rows: [intake1, intake2],
        });
    
        await getAllIntakeLogsByUserIdController(req, res);
    
        expect(pool.query).toHaveBeenCalledWith(
            "SELECT * FROM intake_logs WHERE user_id = $1;",
            [1]
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([intake1, intake2]);
        });

        it("should handle errors", async () => {
            pool.query.mockRejectedValueOnce(new Error("Database error"));

            await getAllIntakeLogsByUserIdController(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: "Failed to fetch intake logs by user ID",
            });
        });
    });
    
    describe("getAllIntakeLogsByDateRangeController", () => {
        it("should return all intake logs by date range", async () => {
        req.query = {}; // Mock query object
        req.query.startDate = "2023-01-01"; // Mock start date
        req.query.endDate = "2023-01-31"; // Mock end date
    
        pool.query.mockResolvedValueOnce({
            rows: [intake1, intake2],
        });
    
        await getAllIntakeLogsByDateRangeController(req, res);
    
        expect(pool.query).toHaveBeenCalledWith(
            "SELECT * FROM intake_logs WHERE taken_at BETWEEN $1 AND $2;",
            ["2023-01-01", "2023-01-31"]
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([intake1, intake2]);
        });

        it("should handle errors", async () => {
            pool.query.mockRejectedValueOnce(new Error("Database error"));

            await getAllIntakeLogsByDateRangeController(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: "Failed to fetch intakes by date range",
            });
        });
    });
    
    describe("getUserIntakeLogsByDateRangeController", () => {
        it("should return user intake logs by date range", async () => {
        req.params.userId = 1; // Mock user ID
        req.query.startDate = "2023-01-01"; // Mock start date
        req.query.endDate = "2023-01-31"; // Mock end date
    
        pool.query.mockResolvedValueOnce({
            rows: [intake1, intake2],
        });
    
        await getUserIntakeLogsByDateRangeController(req, res);
    
        expect(pool.query).toHaveBeenCalledWith(
            "SELECT * FROM intake_logs WHERE taken_at BETWEEN $1 AND $2 AND user_id = $3;",
            ["2023-01-01", "2023-01-31", 1]
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([intake1, intake2]);
        });

        it("should handle errors", async () => {
            pool.query.mockRejectedValueOnce(new Error("Database error"));

            await getUserIntakeLogsByDateRangeController(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: "Failed to fetch intake logs by user ID and date range",
            });
        });
    });
    
        describe("createIntakeLogController", () => {
            it("should create a new intake log", async ()=> {
                req.body = intake1; // Mock intake log data
    
                pool.query.mockResolvedValueOnce({
                    rows: [intake1],
                });
    
                await createIntakeLogController(req, res);
    
                expect(pool.query).toHaveBeenCalledWith(
                    "INSERT INTO intake_logs (id, user_id, medication_id, taken_at, note) VALUES ($1, $2, $3, $4, $5) RETURNING *;",
                    [intake1.id, intake1.user_id, intake1.medication_id, intake1.taken_at, intake1.note]
                );
                expect(res.status).toHaveBeenCalledWith(201);
                expect(res.json).toHaveBeenCalledWith(intake1);
            });

            it("should handle errors", async () => {
                pool.query.mockRejectedValueOnce(new Error("Database error"));

                await createIntakeLogController(req, res);

                expect(res.status).toHaveBeenCalledWith(500);
                expect(res.json).toHaveBeenCalledWith({
                    error: "Failed to create intake log",
                });
            });
        });
        
        describe("updateIntakeLogController", () => {
            it("should update an existing intake log", async () => {
                req.body = {id: intake1.id, note: "new note"}; // Mock intake log data
                req.params.intakeLogId = 1; // Mock intake log ID
    
                pool.query.mockResolvedValueOnce({
                    rows: [intake1],
                });
    
                await updateIntakeLogController(req, res);
    
                expect(pool.query).toHaveBeenCalledWith(
                    expect.stringContaining("UPDATE intake_logs"),
                    [null, "new note", null, intake1.id]
                );
                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalledWith(intake1);
            });

            it("should handle errors", async () => {
                pool.query.mockRejectedValueOnce(new Error("Database error"));

                await updateIntakeLogController(req, res);

                expect(res.status).toHaveBeenCalledWith(500);
                expect(res.json).toHaveBeenCalledWith({
                    error: "Failed to update intake",
                });
            });
        });

        describe("deleteIntakeLogController", () => {
            it("should delete an intake log by ID", async () => {
                req.params.intakeLogId = 1; // Mock intake log ID
    
                pool.query.mockResolvedValueOnce({
                    rows: [intake1],
                });
    
                await deleteIntakeLogController(req, res);
    
                expect(pool.query).toHaveBeenCalledWith(
                    "DELETE FROM intake_logs WHERE id = $1 RETURNING *;",
                    [1]
                );
                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalledWith(intake1);
            });

            it("should handle errors", async () => {
                pool.query.mockRejectedValueOnce(new Error("Database error"));

                await deleteIntakeLogController(req, res);

                expect(res.status).toHaveBeenCalledWith(500);
                expect(res.json).toHaveBeenCalledWith({
                    error: "Failed to delete intake",
                });
            });
        });
    });
