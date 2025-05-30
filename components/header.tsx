"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LogoutButton } from "./logout";
import { UserInfo } from "@/lib/UserInfo";
import useHeaderKeywordStore from "@/stores/HeaderKeywordStore";
import { fetchUserInfo } from "@/lib/fetchUserInfo";
import { fetchEmail } from "@/lib/fetchEmail";

export default function Header() {
    const pathname = usePathname();
    const [email, setEmail] = useState<string | null>(null);
    const [user, setUser] = useState<UserInfo | null>(null);

    const {keyword, keywordClick} = useHeaderKeywordStore();

    const handlerClick = (keyword: string) => {
        keywordClick(keyword);
    }

    useEffect(() => {
        const getEmail = async () => {
            const email = await fetchEmail();
            setEmail(email);
        } 

        getEmail();
    }, []);

    useEffect(() => {
        const getUser = async () => {
            const user = await fetchUserInfo(email)
            setUser(user);
        }

        getUser();
    }, [email]);

    return (
        <div className={`flex flex-col w-full h-[${pathname.startsWith("/stock") ? "50px" : "100px"}] mb-4 *:px-4`}>
            <div className={`flex justify-between w-full h-[50px] bg-[#3F63BF]`}>
                <div className="flex gap-4">
                    <Link href="/" className="flex items-center">
                        <Image
                            src="/images/SkyPass.png"
                            alt="SkyPass Logo"
                            width={50} height={50}
                            loading="lazy"
                            className="w-14"
                        />
                    </Link>

                    <Link href="/" className="flex items-center">
                        <div className={`text-white text-xl ${pathname === "/" && "font-bold"}`}>뉴스</div>
                    </Link>
                    <Link href="/stock/1" className="flex items-center">
                        <div className={`text-white text-xl ${pathname.startsWith("/stock") && "font-bold"}`}>주식</div>
                    </Link>
                </div>

                <div className="flex items-center gap-6 my-2">
                    <div className="text-white text-xs">
                        {email
                        ? <div className="flex items-center gap-3">
                            <div className="size-3 rounded-full bg-green-400" />

                            {user?.nickname}

                            <LogoutButton />
                        </div>
                        : <Link
                            href="/login"
                            className="px-4 py-2 bg-green-400 text-white rounded-full cursor-pointer transform duration-200 hover:bg-green-500"
                        >로그인</Link>}
                    </div>
                </div>
            </div>

            {pathname === "/" && (
                <div className="w-full h-[50px] flex items-center gap-8 bg-white border-b-1 border-b-[#E5E5E5] *:cursor-pointer">
                    <div className={`${keyword === "politics" && ("font-bold text-[#3F63BF]")}`} onClick={() => handlerClick("politics")}>정치</div>
                    <div className={`${keyword === "economy" && ("font-bold text-[#3F63BF]")}`} onClick={() => handlerClick("economy")}>경제</div>
                    <div className={`${keyword === "society" && ("font-bold text-[#3F63BF]")}`} onClick={() => handlerClick("society")}>사회</div>
                    <div className={`${keyword === "culture" && ("font-bold text-[#3F63BF]")}`} onClick={() => handlerClick("culture")}>문화</div>
                    <div className={`${keyword === "world" && ("font-bold text-[#3F63BF]")}`} onClick={() => handlerClick("world")}>세계</div>
                    <div className={`${keyword === "tech" && ("font-bold text-[#3F63BF]")}`} onClick={() => handlerClick("tech")}>기술</div>
                    <div className={`${keyword === "entertainment" && ("font-bold text-[#3F63BF]")}`} onClick={() => handlerClick("entertainment")}>엔터테이먼트</div>
                    <div className={`${keyword === "opinion" && ("font-bold text-[#3F63BF]")}`} onClick={() => handlerClick("opinion")}>의견</div>
                </div>
            )}
        </div>
    );
}  