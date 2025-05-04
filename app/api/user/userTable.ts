import { CreateUserType } from "@/lib/CreateUserType";
import { executeSQL } from "@/lib/db";

// 사용자가 입력한 email이 데이터베이스에 존재하는지 확인하기 위한 데이터
export const getUserCheckEmail = () => {
    const query = `SELECT email FROM user`;

    return executeSQL(query);
}

// 로그인 시 사용자가 입력한 데이터가 DB에 존재하는지 확인하기 위한 데이터
export const getUser = (email: string) => {
    const query = `SELECT email, password FROM user WHERE email = "${email}"`;

    return executeSQL(query);
}

// 회원가입 시 사용자가 입력한 데이터(nickname)가 DB에 존재하는지 확인하기 위한 데이터
export const getUserCheckNickname = (nickname: string) => {
    const query = `SELECT nickname FROM user WHERE nickname = "${nickname}"`;

    return executeSQL(query);
}

// 회원가입 시 사용자가 입력한 데이터(telNumber)가 DB에 존재하는지 확인하기 위한 데이터
export const getUserCheckTelNumber = (telNumber: string) => {
    const query = `SELECT tel_number FROM user WHERE tel_number = "${telNumber}"`;

    return executeSQL(query);
}

// 사용자가 입력한 검증된 데이터를 Insert하여 회원가입
export const postCreateUser = async (userData: CreateUserType) => {
    const query = `
        INSERT INTO user (email, password, nickname, tel_number, profile_image) 
        VALUE (?, ?, ?, ?, ?)
    `;

    const values = [
        userData.email,
        userData.password,
        userData.nickname,
        userData.telNumber,
        userData.profileImage
    ];

    const result = await executeSQL(query, values);
    return result;
}

// 사용자 이메일로 사용자의 정보를 반환
export const getUserInfo = (email: string) => {
    const query = `SELECT email, nickname, tel_number, profile_image FROM user WHERE email = "${email}"`;

    return executeSQL(query);
}