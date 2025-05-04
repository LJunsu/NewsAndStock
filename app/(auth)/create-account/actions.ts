import { checkEmailExists } from "@/lib/checkEmailExists";
import { checkNickname } from "@/lib/checkNickname";
import { checkTelNumber } from "@/lib/checkTelNumber";
import { CreateUserType } from "@/lib/CreateUserType";
import { loginJwt } from "@/lib/loginJWT";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";

const checkPasswords = ({password, passwordConfirm}: {password: string, passwordConfirm: string}) => {
    return password === passwordConfirm
}

const createAccountSchema = z.object({
    email: z.string().email().refine(async (email) => !(await checkEmailExists(email)), "이미 존재하는 이메일입니다."),
    password: z.string().min(4, {message: "4글자 이상 입력하세요."}).regex(new RegExp(/^(?=.*[a-z])(?=.*\d)(?=.*?[#?!@$%^&*-]).+$/), "비밀번호에는 소문자, 숫자 및 특수 문자 #?@$%^&*-가 하나 이상 포함되어야 합니다."),
    passwordConfirm: z.string(),
    nickname: z.string().min(2).max(16),
    telNumber: z.string().regex(new RegExp(/^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/)),
    profileImage: z.string().optional().default("")
}).superRefine(async ({nickname}, ctx) => {
    const userNickname = await checkNickname(nickname);

    if(userNickname.length !== 0) {
        ctx.addIssue({
            code: "custom",
            message: "이 닉네임은 이미 사용 중 입니다.",
            path: ["nickname"],
            fatal: true
        });
        return z.NEVER;
    }
}).superRefine(async ({telNumber}, ctx) => {
    const userTelNumber = await checkTelNumber(telNumber);
    
    if(userTelNumber.length !== 0) {
        ctx.addIssue({
            code: "custom",
            message: "이 전화번호는 이미 사용 중 입니다.",
            path: ["telNumber"],
            fatal: true
        });
        return z.NEVER;
    }
}).refine(checkPasswords, {
    message: "입력한 두 비밀번호가 일치하지 않습니다.",
    path: ["passwordConfirm"]
});

export const createAccountAction = async (prevState: unknown, formData: FormData) => {
    const data = {
        email: formData.get("email"),
        password: formData.get("password"),
        passwordConfirm: formData.get("passwordConfirm"),
        nickname: formData.get("nickname"),
        telNumber: formData.get("telNumber"),
        profileImage: typeof formData.get("profileImage") === "string" ? formData.get("profileImage") : ""
    };

    const result = await createAccountSchema.safeParseAsync(data);

    if(!result.success) {
        return result.error.flatten();
    } else {
        const hashedPassword = await bcrypt.hash(result.data.password, 12);

        const insertData: CreateUserType = {
            email: result.data.email,
            password: hashedPassword,
            nickname: result.data.nickname,
            telNumber: result.data.telNumber,
            profileImage: result.data.profileImage
        }

        fetch("/api/user/postCreateUser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(insertData)
        })
        .then(res => {
            if(!res.ok) {
                throw new Error(`Server error: ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            console.log("User create: ", data.message);
        })
        .catch(err => {
            console.error("Error: ", err);
        });

        const success = await loginJwt(result.data.email);
        if(success) {
            redirect("/");
        }
    }
}