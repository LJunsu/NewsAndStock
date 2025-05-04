export const checkNickname = async (nickname: string) => {
    const response = await fetch(`/api/user/userCheckNickname?nickname=${nickname}`);
    const userNickname = await response.json();
    return userNickname;
}