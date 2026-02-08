const btn = document.getElementById('download-btn');
const state = document.getElementById('state');

btn.onclick = async () => {
    btn.disabled = true;
    state.textContent = 'Generating CSV…';

    try {
        const res = await fetch('http://localhost:3000/api/candidates/export');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `candidates_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();

        URL.revokeObjectURL(url);
        const total = res.headers.get('X-Total-Rows');
        state.textContent = `Done (${total} rows)`;
    } catch (err) {
        state.textContent = `Error: ${err.message}`;
    } finally {
        btn.disabled = false;
    }
};