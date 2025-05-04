"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LogoutButton } from "./logout";
import { UserInfo } from "@/lib/UserInfo";
import useHeaderKeywordStore from "@/stores/HeaderKeywordStore";

export default function Header() {
    const pathname = usePathname();
    const [email, setEmail] = useState<string | null>(null);
    const [user, setUser] = useState<UserInfo | null>(null);
    const [searchShow, setSearchShow] = useState<boolean>(false);

    const {keyword, keywordClick} = useHeaderKeywordStore();

    const handlerClick = (keyword: string) => {
        keywordClick(keyword);
    }

    useEffect(() => {
        async function fetchEmail() {
            try {
                const resp = await fetch("/api/user/userEmail");
                const data = await resp.json();
                setEmail(data.email);
            } catch(err) {
                console.error(err);
                setEmail(null);
            }
        } 

        fetchEmail();
    }, []);

    useEffect(() => {
        async function fetchUserInfo() {
            if(!email) return;

            try {
                const resp = await fetch(`/api/user/getUserInfo?email=${email}`);
                const user = await resp.json();
                setUser(user[0]);
            } catch(err) {
                console.error(err);
                setUser(null);
            }
        }

        fetchUserInfo();
    }, [email]);

    const toggleSearchBtn = () => {
        setSearchShow(!searchShow);
    };

    return (
        <div className="flex flex-col w-full h-[100px] mb-4 *:px-4">
            <div className="flex justify-between w-full h-1/2 bg-[#3F63BF]">
                <div className="flex gap-4">
                    <Link href="/">
                        <Image
                            src="/images/SkyPass.png"
                            alt="SkyPass Logo"
                            width={50} height={50}
                            loading="lazy"
                            className="h-full object-fit"
                        />
                    </Link>

                    <Link href="/" className="flex items-center">
                        <div className={`text-white text-xl ${pathname === "/" && "font-bold"}`}>뉴스</div>
                    </Link>

                    <Link href="/stock" className="flex items-center">
                        <div className={`text-white text-xl ${pathname === "/stock" && "font-bold"}`}>주식</div>
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

                    <div className="flex gap-4 my-2">
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" 
                            width="30" height="30" viewBox="0 0 50 50"
                            className="fill-white cursor-pointer"
                            onClick={toggleSearchBtn}
                        >
                            <path d="M 21 3 C 11.621094 3 4 10.621094 4 20 C 4 29.378906 11.621094 37 21 37 C 24.710938 37 28.140625 35.804688 30.9375 33.78125 L 44.09375 46.90625 L 46.90625 44.09375 L 33.90625 31.0625 C 36.460938 28.085938 38 24.222656 38 20 C 38 10.621094 30.378906 3 21 3 Z M 21 5 C 29.296875 5 36 11.703125 36 20 C 36 28.296875 29.296875 35 21 35 C 12.703125 35 6 28.296875 6 20 C 6 11.703125 12.703125 5 21 5 Z" />
                        </svg>

                        <div className="relative transition-all duration-300" style={{transform: searchShow ? "scaleX(1)" : "scaleX(0)", transformOrigin: "left"}}>
                            <input 
                                type="text" 
                                placeholder="검색어를 입력하세요."
                                className="h-full text-white outline-0"
                                style={{transform: searchShow ? "scaleX(1)" : "scaleX(0)", transformOrigin: "left"}}
                            />

                            <div className="absolute w-full -bottom-1 border-white border-b-1" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full h-1/2 flex items-center gap-8 bg-white border-b-1 border-b-[#E5E5E5] *:cursor-pointer">
                <div className={`${keyword === "politics" && ("font-bold text-[#3F63BF]")}`} onClick={() => handlerClick("politics")}>정치</div>
                <div className={`${keyword === "economy" && ("font-bold text-[#3F63BF]")}`} onClick={() => handlerClick("economy")}>경제</div>
                <div className={`${keyword === "society" && ("font-bold text-[#3F63BF]")}`} onClick={() => handlerClick("society")}>사회</div>
                <div className={`${keyword === "culture" && ("font-bold text-[#3F63BF]")}`} onClick={() => handlerClick("culture")}>문화</div>
                <div className={`${keyword === "world" && ("font-bold text-[#3F63BF]")}`} onClick={() => handlerClick("world")}>세계</div>
                <div className={`${keyword === "tech" && ("font-bold text-[#3F63BF]")}`} onClick={() => handlerClick("tech")}>기술</div>
                <div className={`${keyword === "entertainment" && ("font-bold text-[#3F63BF]")}`} onClick={() => handlerClick("entertainment")}>엔터테이먼트</div>
                <div className={`${keyword === "opinion" && ("font-bold text-[#3F63BF]")}`} onClick={() => handlerClick("opinion")}>의견</div>
            </div>
        </div>
    );
}  