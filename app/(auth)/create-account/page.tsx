"use client";

import Image from "next/image";
import React, { useActionState, useEffect, useState } from "react";
import { createAccountAction } from "./actions";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { getUploadUrl } from "@/lib/getUploadUrl";

export default function CreateAccount() {
    const [preview, setPreview] = useState<string>("");
    const [uploadUrl, setUploadUrl] = useState<string>("");
    const [imageId, setImageId] = useState<string>("");

    const onImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e);
        const { target: {files} } = e;
        if(!files) return;

        const maxSizeMB = 3;
        const maxSizeBytes = maxSizeMB * 1024 * 1024;
        if(!files[0].type.startsWith("image/") || files[0].size > maxSizeBytes) return;

        const file = files[0];
        const url = URL.createObjectURL(file);
        setPreview(url);

        const {success, result} = await getUploadUrl();
        if(success) {
            const {id, uploadURL} = result;

            setUploadUrl(uploadURL);
            setImageId(id);
        }
    }

    const interceptAction = async (_: unknown, formData: FormData) => {
        const file = formData.get("profileImage");
        if(!file || (file instanceof File && file.size === 0)) return;

        const cloudflareForm = new FormData();
        cloudflareForm.append("file", file);

        const response = await fetch(uploadUrl, {
            method: "POST",
            body: cloudflareForm
        });
        if(response.status !== 200) return;

        const photoUrl = `https://imagedelivery.net/PRjBLDB7Nrc6UjfrSGM0vw/${imageId}`;
        formData.set("profileImage", `${photoUrl}/public`);

        return createAccountAction(_, formData);
    }

    const [state, action] = useActionState(interceptAction, null);

    const [emailError, setEmailError] = useState<boolean>(false);
    const [passwordError, setPasswordError] = useState<boolean>(false);
    const [passwordConfirmError, setPasswordConfirmError] = useState<boolean>(false);
    const [nicknameError, setnicknameError] = useState<boolean>(false);
    const [telNumberError, setTelNumberError] = useState<boolean>(false);

    useEffect(() => {
        if(!state?.fieldErrors.email) setEmailError(false);
        else setEmailError(true);
        
        if(!state?.fieldErrors.password) setPasswordError(false);
        else setPasswordError(true);
        
        if(!state?.fieldErrors.passwordConfirm) setPasswordConfirmError(false);
        else setPasswordConfirmError(true);
        
        if(!state?.fieldErrors.nickname) setnicknameError(false);
        else setnicknameError(true);
        
        if(!state?.fieldErrors.telNumber) setTelNumberError(false);
        else setTelNumberError(true);
    }, [state?.fieldErrors]);

    return (
        <div className="relative w-full min-h-screen *:text-white">
            <div className="mx-auto my-10 flex flex-col justify-around w-1/2 min-w-[500px] min-h-[800px] bg-[#3F63BF] shadow-lg rounded-2xl p-10">
                <div className="w-[200px] h-[200px] mx-auto">
                    <Image
                        src="/images/SkyPass.png" alt="SkyPass 로고"
                        width={200} height={200}
                        loading="lazy"
                        className="w-full h-full"
                    />
                </div>

                <div className="flex flex-col gap-10">
                    <div className="text-2xl font-bold text-center">회원가입</div>

                    <form action={action} className="flex flex-col gap-5 *:border-2 mb-3">
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

                        <input
                            type="password"
                            name="passwordConfirm"
                            required
                            placeholder="비밀번호 확인"
                            className={`p-2 pl-5 rounded-full focus:outline-none ${passwordConfirmError && "border-red-500"}`}
                        />
                        {state?.fieldErrors.passwordConfirm
                        ? <div className="flex flex-col gap-1 border-none">
                            {state?.fieldErrors.passwordConfirm.map((error, index) => (<span key={index} className="text-sm">{error}</span>))}
                        </div>
                        : null}

                        <label
                            htmlFor="profileImage"
                            className="flex flex-col items-center justify-center rounded-2xl border-2 aspect-square cursor-pointer bg-center bg-cover"
                            style={{backgroundImage: `url(${preview})`}}
                        >
                            {preview === ""
                            ? <>
                                <PhotoIcon className="w-1/2" />

                                <div className="text-white text-lg font-bold">
                                    프로필 이미지
                                </div>
                            </>
                            : null}
                        </label>

                        <input
                            onChange={onImageChange}
                            type="file"
                            accept="image/*"
                            id="profileImage"
                            name="profileImage"
                            className="hidden"
                        />

                        <input
                            type="text"
                            name="nickname"
                            required
                            placeholder="닉네임"
                            className={`p-2 pl-5 rounded-full focus:outline-none ${nicknameError && "border-red-500"}`}
                        />
                        {state?.fieldErrors.nickname
                        ? <div className="flex flex-col gap-1 border-none">
                            {state?.fieldErrors.nickname.map((error, index) => (<span key={index} className="text-sm">{error}</span>))}
                        </div>
                        : null}

                        <input
                            type="tel"
                            name="telNumber"
                            required
                            placeholder="전화번호"
                            className={`p-2 pl-5 rounded-full focus:outline-none ${telNumberError && "border-red-500"}`}
                        />
                        {state?.fieldErrors.telNumber
                        ? <div className="flex flex-col gap-1 border-none">
                            {state?.fieldErrors.telNumber.map((error, index) => (<span key={index} className="text-sm">{error}</span>))}
                        </div>
                        : null}

                        <button className="p-2 rounded-full cursor-pointer duration-200 hover:bg-blue-400">
                            회원가입
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}