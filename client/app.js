const btn = document.getElementById('download-btn');
const btnText = document.getElementById('btn-text');
const state = document.getElementById('state');

btn.onclick = async () => {
    btn.disabled = true;
    btnText.textContent = 'Generating...';
    state.className = 'loading';
    state.innerHTML = '<span class="spinner"></span>Fetching candidates...';

    try {
        const res = await fetch('http://localhost:3000/candidates/export');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `candidates_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();

        URL.revokeObjectURL(url);
        const total = res.headers.get('X-Total-Rows');
        state.className = 'success';
        state.textContent = `Downloaded ${total} rows successfully!`;
    } catch (err) {
        state.className = 'error';
        state.textContent = `Error: ${err.message}`;
    } finally {
        btn.disabled = false;
        btnText.textContent = 'Download CSV';
    }
};