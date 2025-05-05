
export async function fetchEmail() {
    try {
        const resp = await fetch("/api/user/userEmail");
        const data = await resp.json();
        return data.email;
    } catch(err) {
        console.error(err);
        return null;
    }
} 