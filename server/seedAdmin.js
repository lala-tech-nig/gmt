const axios = require('axios');

const seedAdmin = async () => {
    try {
        const response = await axios.post('http://localhost:5000/api/auth/seed', {
            name: "Super Admin",
            email: "admin@gmt.ng",
            password: "password123",
            role: "admin"
        });
        console.log('Admin created successfully:', response.data);
    } catch (error) {
        console.error('Error creating admin:', error.response ? error.response.data : error.message);
    }
};

seedAdmin();
