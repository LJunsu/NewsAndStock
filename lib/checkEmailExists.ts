export const checkEmailExists = async (email: string) => {
    const response = await fetch("/api/user/userCheckEmail");
    const users = await response.json();

    const exists = users.some((user: {email: string}) => user.email === email);
    return exists;
}