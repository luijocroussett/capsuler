const {getAllSchedulesController, getScheduleByIdController, createScheduleController, updateScheduleController, deleteScheduleController} = require('../../controllers/schedulesController');
const {schedules: {schedule1, schedule2}} = require('../data/testData.json'); // Mocked test data

let pool;

describe('Schedules Controller', () => {
    beforeEach(() => {
        pool = { query: jest.fn() }; // Create a fresh mock for each test
    });

    afterEach(() => {
        jest.resetAllMocks(); // Clear mocks after each test
    });

    describe('getAllSchedulesController', () => {
        
        it('should return all schedules', async () => {
            // Mock the database query

            pool.query.mockResolvedValueOnce({
                rows: [schedule1, schedule2],
            });

            // Mock Express req and res objects
            const req = {};
            const res = {
                locals: { pgPool: pool }, // Attach the mock database to res.locals
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await getAllSchedulesController(req, res);

            // Assertions
            expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('SELECT * FROM schedules'));
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([schedule1, schedule2]);
        });
        it ('should return 500 if there is an error', async () => {
            pool.query.mockRejectedValueOnce(new Error('Database error'));

            const req = {};
            const res = {
                locals: {pgPool: pool},
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await getAllSchedulesController(req, res);
            
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('getScheduleByIdController', () => {
        it('should return a schedule by ID', async () => {
            
            pool.query.mockResolvedValueOnce({
                rows: [schedule1],
            });

            const req = {params: { id: schedule1.id }};
            const res = {
                locals: { pgPool: pool }, // Attach the mock database to res.locals
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await getScheduleByIdController(req, res);

            expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('SELECT * FROM schedules WHERE id = $1'), [schedule1.id]);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(schedule1);
        });

        it ('should return 404 if schedule not found', async () => {
            
            pool.query.mockResolvedValueOnce({
                rows: [],
            });

            const req = {params: { id: schedule1.id }};
            const res = {
                locals: { pgPool: pool }, // Attach the mock database to res.locals
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await getScheduleByIdController(req, res);

            expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('SELECT * FROM schedules WHERE id = $1'), [schedule1.id]);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({error: 'Schedule not found'});
        });

        it ('should return 500 if there is an error', async () => {
            
            pool.query.mockRejectedValueOnce(new Error('Database error'));

            const req = {pool};
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await getScheduleByIdController(req, res);
            
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('createScheduleController', () => {
        it('should create a new schedule', async () => {
            
            pool.query.mockResolvedValueOnce({
                rows: [schedule1],
            });

            const req = { body: schedule1 };
            const res = {
                locals: { pgPool: pool }, // Attach the mock database to res.locals
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await createScheduleController(req, res);

            expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO schedules'), [expect.any(String), schedule1.user_id, schedule1.medication_id, schedule1.start_date, schedule1.end_date, schedule1.frequency, schedule1.time_of_day, schedule1.day_of_week]);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(schedule1);
        });

        it ('should return 500 if there is an error', async () => {
            
            pool.query.mockRejectedValueOnce(new Error('Database error'));

            const req = {body: schedule1};
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await createScheduleController(req, res);
            
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('updateScheduleController', () => {
        it('should update an existing schedule', async () => {

            pool.query.mockResolvedValueOnce({
                rows: [{...schedule1, "frequency": "weekly"}],
            });

            const req = { body: {id: schedule1.id, "frequency": "weekly" } };
            const res = {
                locals: { pgPool: pool }, // Attach the mock database to res.locals
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await updateScheduleController(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({...schedule1, "frequency": "weekly"});
        });

        it ('should return 404 if schedule not found', async () => {

            pool.query.mockResolvedValueOnce({
                rows: []
            });

            const req = {body: {id: schedule1.id, frequency: "weekly" }};
            const res = {
                locals: {pgPool: pool},
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await updateScheduleController(req, res);
            
            expect(res.status).toHaveBeenCalledWith(404);
        });

        it ('should return 500 if there is an error', async () => {

            pool.query.mockRejectedValueOnce(new Error('Database error'));

            const req = {body: schedule1};
            const res = {
                locals: {pgPool: pool},
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await updateScheduleController(req, res);
            
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('deleteScheduleController', () => {
        it('should delete a schedule by ID', async () => {

            pool.query.mockResolvedValueOnce({
                rows: [{...schedule1, id: "1"}],
            });

            const req = { body: { id: "1" } };
            const res = {
                locals: { pgPool: pool }, // Attach the mock database to res.locals
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await deleteScheduleController(req, res);

            expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('DELETE FROM schedules'), ['1']);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(schedule1);
        });

        it ('should return 404 if schedule not found', async () => {
            
            pool.query.mockResolvedValueOnce({
                rows: [],
            });

            const req = {body: {id: schedule1.id}};
            const res = {
                locals: {pgPool: pool},
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            await deleteScheduleController(req, res);
            
            expect(res.status).toHaveBeenCalledWith(404);
        });

        it ('should return 500 if there is an error', async () => {

            pool.query.mockRejectedValueOnce(new Error('Database error'));

            const req = {body: {id: schedule1.id}};
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await deleteScheduleController(req, res);
            
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

});