"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStatusCode = getStatusCode;
exports.getUserAge = getUserAge;
exports.validateEmail = validateEmail;
exports.getResponse = getResponse;
exports.mockApiCall = mockApiCall;
function getStatusCode() {
    // Simulates an API that might return different success codes
    const codes = [200, 201, 204];
    return codes[Math.floor(Math.random() * codes.length)];
}
function getUserAge(userId) {
    // Mock user ages
    const ages = {
        'user1': 25,
        'user2': 30,
        'user3': 18
    };
    return ages[userId] || 0;
}
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function getResponse() {
    return {
        status: 200,
        data: { message: 'Success' }
    };
}
function mockApiCall() {
    // This would normally call an API, but we'll force it in tests
    return Promise.resolve(Math.random() * 100);
}
