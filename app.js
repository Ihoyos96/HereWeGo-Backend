const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { createClient } = require('@libsql/client');
const config = require('./config'); // Ensure you have a config.js file with authToken

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Database connection
const client = createClient({
  url: "libsql://herewego-ihoyos96.turso.io",
  authToken: config.db.authToken,
});

// Function to check database connection
async function checkDatabaseConnection() {
    try {
        // Perform a simple test execution. Adjust this as per your database's requirements.
        await client.execute("SELECT 1");
        console.log('Successfully connected to the database.');
    } catch (err) {
        console.error('Failed to connect to the database:', err);
    }
}

// Check database connection on startup
checkDatabaseConnection();

app.use(express.json()); // For parsing application/json

// Endpoint to create a new trip
app.post('/createTrip', async (req, res) => {
    const newTrip = req.body;

    try {
        const result = await client.execute({
            sql: "INSERT INTO trips (tripId, tripData) VALUES (?, ?)",
            args: [newTrip.tripId, JSON.stringify(newTrip)]
        });
        res.status(200).send({ tripId: newTrip.tripId });
        io.emit('newTrip', newTrip);
    } catch (err) {
        res.status(500).send('Error storing trip');
        console.error(err);
    }
});


// Handling trip acceptance by a driver
io.on('connection', (socket) => {
    socket.on('acceptTrip', async (data) => {
        const { tripId, driverId } = data;

        try {
            // Fetching the existing trip data
            let result = await client.execute({
                sql: "SELECT tripData FROM trips WHERE tripId = ?",
                args: [tripId]
            });

            if (result.rows.length > 0) {
                let trip = JSON.parse(result.rows[0].tripData);
                trip.driverId = driverId;
                trip.tripStatus = 'assigned';

                // Updating the trip data with the assigned driver
                await client.execute({
                    sql: "UPDATE trips SET tripData = ? WHERE tripId = ?",
                    args: [JSON.stringify(trip), tripId]
                });

                io.emit('tripUpdated', trip); // Notify the customer app
            }
        } catch (err) {
            console.error(err);
        }
    });
});


// Start the server
server.listen(3000, () => {
    console.log('Listening on *:3000');
});
