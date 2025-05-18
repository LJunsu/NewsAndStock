import { NewsItem } from "@/lib/NewsIteminterface";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { NewsModalSide } from "./newsModalSide";
import { UserInfo } from "@/lib/UserInfo";
import { fetchEmail } from "@/lib/fetchEmail";
import { fetchUserInfo } from "@/lib/fetchUserInfo";

export interface CommentType {
    news_comment_id: number,
    news_comment_content: string,
    id: string,
    email: string,
    nickname: string,
    tel_number: string | undefined,
    profile_image: string | null | undefined,
    news_comment_insert_date: string
}
interface NewsModalProps {
    closeModal: () => void;
    modalNews: NewsItem | null
}
export const NewsModal = ({closeModal, modalNews}: NewsModalProps) => {
    
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if(e.key === "Escape") closeModal();
        };
        document.addEventListener("keydown", handleKeyDown);

        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, []);

    const [email, setEmail] = useState<string | null>(null);
    const [user, setUser] = useState<UserInfo | null>(null);

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
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-screen h-screen bg-[#00000050]" onClick={closeModal}>
            <div className="relative w-3/4 xl:w-1/2 max-h-[95%] overflow-auto p-4 pr-8 bg-white rounded-lg" onClick={(e) => e.stopPropagation()}>
                <div className="absolute top-4 right-4 cursor-pointer *:transform *:duration-200 hover:*:border-[#3F63BF] hover:*:animate-pulse" onClick={closeModal}>
                    <div className="absolute top-4 right-0 border-b-2 w-5 rotate-130" />
                    <div className="absolute top-4 right-0 border-b-2 w-5 rotate-230" />
                </div>

                {modalNews
                ? (
                    <div className="flex flex-col gap-8 w-full h-full mt-10">
                        <div className="flex flex-col gap-4 pb-4 border-b-1 border-[#E5E5E5]">
                            <div className="text-xs font-bold">
                                {modalNews.publisher}
                            </div>

                            <div className="text-3xl font-bold">
                                {modalNews.title}
                            </div>

                            <div className="flex justify-between text-xs text-[#767678]">
                                <div>{modalNews.author ? (modalNews.author + " 기자") : "기자 미상"}</div>
                                <div>{modalNews.published_at.replace("T", " ")}</div>
                            </div>
                        </div>

                        
                        {modalNews.image_url && 
                            <div className="relative w-full h-[30rem]">
                                <Image
                                    src={modalNews.image_url}
                                    alt={modalNews.title}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        }

                        <div className="text-sm text-[#767678] leading-relaxed">
                            {modalNews.summary}
                        </div>

                        <Link
                            href={modalNews.content_url}
                        >자세히 보기→</Link>
                    
                        <NewsModalSide user={user} newsId={modalNews.id} />
                    </div>
                )
                : "loading..."}
            </div>
        </div>
    );
}