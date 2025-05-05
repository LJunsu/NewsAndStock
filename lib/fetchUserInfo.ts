export async function fetchUserInfo(email: string | null) {
    if(!email) return;

    try {
        const resp = await fetch(`/api/user/getUserInfo?email=${email}`);
        const user = await resp.json();
        return user[0];
    } catch(err) {
        console.error(err);
        return null;
    }
}