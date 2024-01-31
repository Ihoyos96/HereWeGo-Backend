const fs = require('fs');

module.exports = {
    db: {
        authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOiIyMDI0LTAxLTMwVDE2OjM5OjAzLjk2MjE4NzU1N1oiLCJpZCI6Ijk5YzdhYmM5LWJmOGMtMTFlZS04OTdmLTgyMmIxNWEwYmQ4YyJ9.9YsETU4l1YgoYFW2hQiw-nKuWINWSpuqoP_zQywNPqzXUuH7YWCSXXU3fp657BNfErx-MVZeH2bkoSx855lPDg",
    },
    cert: {
        key: fs.readFileSync('/Users/ianhoyos/Code/HereWeGo-Backend/certs/key.pem'),
        cert: fs.readFileSync('/Users/ianhoyos/Code/HereWeGo-Backend/certs/cert.pem'),
    }
}