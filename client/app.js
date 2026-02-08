const testBtn = document.getElementById('test-btn');
const state = document.getElementById('state');

testBtn.addEventListener('click', async () => {
    testBtn.disabled = true;
    state.className = 'loading';
    state.textContent = 'Connecting to API...';

    try {
        const response = await fetch('http://localhost:3000/api/test');
        const data = await response.json();

        state.className = 'success';
        state.textContent = `found ${data.candidatesCount} candidates, on ${data.jobApplicationsCount} job applications`;
    } catch (error) {
        state.className = 'error';
        state.textContent = 'Connection error: ' + error.message;
    } finally {
        testBtn.disabled = false;
    }
});