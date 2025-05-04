import { checkEmailExists } from "@/lib/checkEmailExists";
import { loginJwt } from "@/lib/loginJWT";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";

const loginSchema = z.object({
    email: z.string().email().refine(checkEmailExists, "존재하지 않는 계정입니다."),
    password: z.string().min(4, {message: "4글자 이상 입력하세요."}).regex(new RegExp(/^(?=.*[a-z])(?=.*\d)(?=.*?[#?!@$%^&*-]).+$/), "비밀번호에는 소문자, 숫자 및 특수 문자 #?@$%^&*-가 하나 이상 포함되어야 합니다.")
});

export const loginAction = async (prevState: unknown, formData: FormData) => {
    const data = {
        email: formData.get("email"),
        password: formData.get("password")
    };

    const result = await loginSchema.safeParseAsync(data);
    if(!result.success) {
        return result.error.flatten();
    } else {
        const response = await fetch(`/api/user/login?email=${result.data.email}`);
        const user = await response.json();

        const isValid = await bcrypt.compare(result.data.password, user[0].password ?? "");
        if(isValid) {
            const success = await loginJwt(result.data.email);
            if(success) {
                redirect("/");
            }
        } else {
            return {
                fieldErrors: {
                    password: ["잘못된 비밀번호입니다."],
                    email: null
                }
            }
        }
    }
}