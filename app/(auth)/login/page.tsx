"use client";

import Image from "next/image";
import { useActionState, useEffect, useState } from "react";
import { loginAction } from "./actions";
import Link from "next/link";

export default function Auth() {
    const [state, action] = useActionState(loginAction, null);
    const [emailError, setEmailError] = useState<boolean>(false);
    const [passwordError, setPasswordError] = useState<boolean>(false);

    useEffect(() => {
        if(!state?.fieldErrors.email) setEmailError(false);
        else setEmailError(true);

        if(!state?.fieldErrors.password) setPasswordError(false);
        else setPasswordError(true);
    }, [state?.fieldErrors]);

    return (
        <div className="relative w-full h-screen *:text-white">
            <div className="absolute top-1/2 left-1/2 transform -translate-1/2 flex flex-col justify-around w-1/2 min-w-[500px] h-3/4 min-h-[500px] bg-[#3F63BF] shadow-lg rounded-2xl p-10">
                <div className="w-[200px] h-[200px] mx-auto">
                    <Image
                        src="/images/SkyPass.png" alt="SkyPass 로고"
                        width={200} height={200}
                        loading="lazy"
                        className="w-full h-full"
                    />
                </div>

                <div className="flex flex-col gap-10">
                    <div className="text-2xl font-bold text-center">로그인</div>

                    <form action={action} className="flex flex-col gap-5 *:border-2">
                        <input
                            type="email"
                            name="email"
                            required
                            placeholder="이메일"
                            className={`p-2 pl-5 rounded-full focus:outline-none ${emailError && "border-red-500"}`}
                        />
                        {state?.fieldErrors.email
                        ? <div className="flex flex-col gap-1 border-none">
                            {state?.fieldErrors.email.map((error, index) => (<span key={index} className="text-sm">{error}</span>))}
                        </div>
                        : null}

                        <input
                            type="password"
                            name="password"
                            required
                            placeholder="비밀번호"
                            className={`p-2 pl-5 rounded-full focus:outline-none ${passwordError && "border-red-500"}`}
                        />
                        {state?.fieldErrors.password
                        ? <div className="flex flex-col gap-1 border-none">
                            {state?.fieldErrors.password.map((error, index) => (<span key={index} className="text-sm">{error}</span>))}
                        </div>
                        : null}

                        <button className="p-2 rounded-full cursor-pointer duration-200 hover:bg-blue-400">
                            로그인
                        </button>
                    </form>

                    <ul className="flex gap-5 justify-center">
                        <li>비밀번호 찾기</li>
                        <li>아이디 찾기</li>
                        <li><Link href="/create-account">회원가입</Link></li>
                    </ul>
                </div>
            </div>
        </div>
    );
}