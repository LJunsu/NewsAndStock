import Image from "next/image"
import { NewsModalCommentInput } from "./newsModalCommentInput";
import { NewsModalCommentList } from "./newsModalCommentList";
import { UserInfo } from "@/lib/UserInfo";
import { useEffect, useState } from "react";

interface NewsModalSideProps {
    user: UserInfo | null,
    newsId: string
}
export const NewsModalSide = ({user, newsId}: NewsModalSideProps) => {

    const [newsLike, setNewsLike] = useState<number>(-1);
    useEffect(() => {
        fetch(`/api/news/getNewsLikeLength?id=${newsId}`)
            .then((res) => res.json())
            .then((data) => {
                setNewsLike(data[0].size); // 모달을 변경해도 이전 like가 나오는 문제
            });
    }, []);

    const [likeOn, setLikeOn] = useState<boolean>(false);
    const likeToggle = () => {
        fetch(`/api/news/likeCheck`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({id: newsId, email: user?.email})
        })
        .then((res) => res.json())
        .then((data) => {
            setLikeOn(data.likeOn); // 처음 모달 접근 시 좋아요를 눌렀는지 먼저 파악해야 함
        });
    }

    return (
        <div className="flex flex-col gap-4">
            {user ?
            <div className="flex justify-between items-center">
                <span>이 기사를 추천합니다</span>

                <div className={`flex items-center gap-2 cursor-pointer px-2 py-1 border-2 rounded-full ${likeOn && "bg-[#3F63BF]"}`} onClick={likeToggle}>
                    <Image 
                        src={"/images/좋아요 전.png"}
                        alt="좋아요 전"
                        width={20} height={20}
                    />
                    <div>{newsLike}</div>
                </div>
            </div>
            : null}


            <div>
                <NewsModalCommentInput user={user} />
                <NewsModalCommentList />
            </div>
        </div>
    );
}