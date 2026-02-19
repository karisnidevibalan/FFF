import fetch from 'node-fetch';

const resumeText = `
John Doe
Frontend Developer
Email: john.doe@example.com
Phone: 123-456-7890

Summary:
Passionate Frontend Developer with 3 years of experience building responsive web applications.

Skills:
HTML, CSS, JavaScript, React.js, Git.

Experience:
Frontend Developer at Tech Corp (2020 - Present)
- Built user interfaces using React.js and Redux.
- Optimized performance.
`;

async function testanalyze() {
    console.log('Testing endpoint: http://localhost:5000/api/ai/analyze-resume');
    try {
        const response = await fetch('http://localhost:5000/api/ai/analyze-resume', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ resumeText }),
        });

        console.log('Status:', response.status);
        const text = await response.text();
        console.log('Raw response:', text);

        if (response.ok) {
            try {
                const data = JSON.parse(text);
                console.log('Parsed Data:', JSON.stringify(data, null, 2));
            } catch (e) {
                console.log('Failed to parse JSON');
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

testanalyze();
