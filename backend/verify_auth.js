
const API_URL = 'http://localhost:5000/api/auth';
const TEST_USER = {
    name: 'Test user',
    email: `test${Date.now()}@example.com`,
    password: 'password123',
    confirmPassword: 'password123'
};

async function testAuth() {
    try {
        console.log('Testing Signup...');
        const signupRes = await fetch(`${API_URL}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(TEST_USER)
        });
        const signupData = await signupRes.json();
        console.log('Signup Status:', signupRes.status);
        console.log('Signup Response:', signupData);

        if (signupData.success && signupData.token) {
            console.log('Token received');
        } else {
            console.error('Signup failed');
            return;
        }

        console.log('\nTesting Login...');
        const loginRes = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: TEST_USER.email,
                password: TEST_USER.password
            })
        });
        const loginData = await loginRes.json();
        console.log('Login Status:', loginRes.status);
        console.log('Login Response:', loginData);

        if (loginData.success && loginData.token) {
            console.log('Token received');
        } else {
            console.error('Login failed');
        }

    } catch (error) {
        console.error('Error:', error.message);
    }
}

testAuth();
