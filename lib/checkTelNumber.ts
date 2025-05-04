export const checkTelNumber = async (telNumber: string) => {
    const response = await fetch(`/api/user/userCheckTelNumber?telNumber=${telNumber}`);
    const userTelNumber = await response.json();
    return userTelNumber;
}