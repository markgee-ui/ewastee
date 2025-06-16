function seedData() {
    if (localStorage.getItem('etaka_seeded')) {
        return;
    }

    const users = [
        { id: 1, name: 'Admin User', email: 'admin@etaka.com', password: 'password', role: 'admin' },
        { id: 2, name: 'John Doe', email: 'consumer1@etaka.com', password: 'password', role: 'consumer' },
        { id: 3, name: 'Jane Smith', email: 'consumer2@etaka.com', password: 'password', role: 'consumer' },
        { id: 4, name: 'Peter Jones', email: 'consumer3@etaka.com', password: 'password', role: 'consumer' },
        { id: 5, name: 'Recycle Pro', email: 'recycler1@etaka.com', password: 'password', role: 'recycler' },
        { id: 6, name: 'Green Tech', email: 'recycler2@etaka.com', password: 'password', role: 'recycler' },
    ];

    const ewasteRequests = [
        { id: 1, consumer_id: 2, recycler_id: 5, type: 'Laptops', quantity: 5, pickup_location: 'Westlands, Nairobi', description: 'Old office laptops', status: 'completed' },
        { id: 2, consumer_id: 3, recycler_id: null, type: 'Smartphones', quantity: 10, pickup_location: 'CBD, Nairobi', description: 'Assorted old phones', status: 'pending' },
        { id: 3, consumer_id: 4, recycler_id: 6, type: 'Monitors', quantity: 3, pickup_location: 'Kilimani, Nairobi', description: 'PC monitors, mixed sizes', status: 'in_progress' },
        { id: 4, consumer_id: 2, recycler_id: null, type: 'Kitchen Appliances', quantity: 2, pickup_location: 'Westlands, Nairobi', description: 'Microwave and a blender', status: 'pending' },
        { id: 5, consumer_id: 3, recycler_id: 5, type: 'Batteries', quantity: 50, pickup_location: 'CBD, Nairobi', description: 'Used AA and AAA batteries', status: 'accepted' },
    ];

    const rewards = [
        { user_id: 2, points: 150 },
        { user_id: 3, points: 50 },
        { user_id: 4, points: 80 },
    ];

    const notifications = [
        { id: 1, user_id: 2, message: 'Your request #1 has been completed.', is_read: true, timestamp: new Date().toISOString() },
        { id: 2, user_id: 3, message: 'Welcome to Etaka! Submit your first e-waste request today.', is_read: true, timestamp: new Date().toISOString() },
        { id: 3, user_id: 5, message: 'New e-waste request #2 is available nearby.', is_read: false, timestamp: new Date().toISOString() },
        { id: 4, user_id: 1, message: 'A new user has registered: Jane Smith.', is_read: false, timestamp: new Date().toISOString() },
    ];

    localStorage.setItem('etaka_users', JSON.stringify(users));
    localStorage.setItem('etaka_ewaste_requests', JSON.stringify(ewasteRequests));
    localStorage.setItem('etaka_rewards', JSON.stringify(rewards));
    localStorage.setItem('etaka_notifications', JSON.stringify(notifications));
    localStorage.setItem('etaka_seeded', 'true');
}

seedData();
