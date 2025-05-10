const {
    getAllUsersController,
    getUserController,
    createUserController,
    updateUserController,
} = require('../../controllers/usersController');
const { users: {user1, user2} } = require('../data/testData.json'); // Mocked test data

const pool = {
    query: jest.fn(), // Mock the query method of the database connection
};

describe('Users Controller', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks after each test
    });

    describe('getAllUsersController', () => {
        it('should return all users', async () => {
            // Mock the database query
            pool.query.mockResolvedValueOnce({
                rows: [user1, user2],
            });

            // Mock Express req and res objects
            const req = {};
            const res = {
                locals: { pgPool: pool }, // Attach the mock database to res.locals
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await getAllUsersController(req, res);

            // Assertions
            expect(pool.query).toHaveBeenCalledWith('SELECT * FROM users');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([user1, user2]);
        });
        it ('should return 500 if there is an error', async () => {
            pool.query.mockRejectedValueOnce(new Error('Database error'));

            const req = {};
            const res = {
                locals: { pgPool: pool }, // Attach the mock database to res.locals
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await getAllUsersController(req, res);
            
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('getUserController', () => {
        it('should return a user by ID', async () => {
            pool.query.mockResolvedValueOnce({
                rows: [user1],
            });

            const req = { params: { id: 1 } };
            const res = {
                locals: { pgPool: pool }, // Attach the mock database to res.locals
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await getUserController(req, res);

            expect(pool.query).toHaveBeenCalledWith('SELECT * FROM users WHERE id = $1', [1]);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(user1);
        });

        it('should return 404 if user is not found', async () => {
            pool.query.mockResolvedValueOnce({ rows: [] });

            const req = { params: { id: 999 } };
            const res = {
                locals: { pgPool: pool }, // Attach the mock database to res.locals
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await getUserController(req, res);

            expect(pool.query).toHaveBeenCalledWith('SELECT * FROM users WHERE id = $1', [999]);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
        });

        it ('should return 500 if there is an error', async () => {
            pool.query.mockRejectedValueOnce(new Error('Database error'));

            const req = { params: { id: 1 } };
            const res = {
                locals: { pgPool: pool }, // Attach the mock database to res.locals
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await getUserController(req, res);
            
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('createUserController', () => {
        it('should create a new user', async () => {
            pool.query.mockResolvedValueOnce({
                rows: [user1],
            });

            const req = {
                body: user1,
            };
            const res = {
                locals: { pgPool: pool }, // Attach the mock database to res.locals
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await createUserController(req, res);

            expect(pool.query).toHaveBeenCalledWith(
                'INSERT INTO users (id, name, email, date_of_birth, password) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [user1.id, user1.name, user1.email, user1.date_of_birth, user1.password]
            );
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(user1);
        });

        it('should return 500 if there is an error', async () => {
            pool.query.mockRejectedValueOnce(new Error('Database error'));

            const req = {
                body: user1,
            };
            const res = {
                locals: { pgPool: pool }, // Attach the mock database to res.locals
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await createUserController(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('updateUserController', () => {
        it('should update a user', async () => {
            pool.query.mockResolvedValueOnce({
                rows: [{ ...user1, email: 'updated.email@example.com' }],
            });

            const req = {
                body: {
                    id: 'test-id',
                    email: 'updated.email@example.com'
                },
            };
            const res = {
                locals: { pgPool: pool }, // Attach the mock database to res.locals
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await updateUserController(req, res);

            expect(pool.query).toHaveBeenCalledWith(
                'UPDATE users SET name = COALESCE($1, name), email = COALESCE($2, email), date_of_birth = COALESCE($3, date_of_birth), password = COALESCE($4, password) WHERE id = $5 RETURNING *',
                [null, 'updated.email@example.com', null, null, 'test-id']
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({...user1, email: 'updated.email@example.com'});
        });

        it('should return 404 if user is not found', async () => {
            pool.query.mockResolvedValueOnce({ rows: [] });

            const req = {
                body: {
                    id: 999, 
                    name: 'Nonexistent User',
                },
            };
            const res = {
                locals: { pgPool: pool }, // Attach the mock database to res.locals
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await updateUserController(req, res);

            expect(pool.query).toHaveBeenCalledWith(
                'UPDATE users SET name = COALESCE($1, name), email = COALESCE($2, email), date_of_birth = COALESCE($3, date_of_birth), password = COALESCE($4, password) WHERE id = $5 RETURNING *', 
                ['Nonexistent User', null, null, null, 999]
            );
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
        });

        it('should return 500 if there is an error', async () => {
            pool.query.mockRejectedValueOnce(new Error('Database error'));

            const req = {
                body: {
                    id: 1,
                    name: 'Updated User',
                },
            };
            const res = {
                locals: { pgPool: pool }, // Attach the mock database to res.locals
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await updateUserController(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });
});
