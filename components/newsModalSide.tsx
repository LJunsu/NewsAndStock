import { UserInfo } from "@/lib/UserInfo";
import { useEffect, useState } from "react";
import { likeCheckNowUser } from "@/lib/likeToggleExists";
import { CommentType } from "./newsModal";
import Image from "next/image";
import { NewsModalCommentInput } from "./newsModalCommentInput";
import { NewsModalCommentList } from "./newsModalCommentList";
import { useRouter } from "next/navigation";

interface NewsModalSideProps {
    user: UserInfo | null,
    newsId: string
}
export const NewsModalSide = ({user, newsId}: NewsModalSideProps) => {
    const [newsLike, setNewsLike] = useState<number>(-1);
    const [likeOn, setLikeOn] = useState<boolean>(false);
    const [comments, setComments] = useState<CommentType[]>([]);

    const router = useRouter();

    useEffect(() => {
        if(!newsId) return;

        fetch(`/api/news/getComment?newsId=${newsId}`)
        .then(res => res.json())
        .then(data => {
            setComments(data);
        })
    }, [newsId])

    useEffect(() => {
        fetch(`/api/news/getNewsLikeLength?id=${newsId}`)
            .then((res) => res.json())
            .then((data) => {
                setNewsLike(data[0].size);
            });
    }, [likeOn, newsId]);

    useEffect(() => {
        const fetchLikeInfo = async () => {
            if(user?.email) {
                const like = await likeCheckNowUser(newsId, user.email);
                setLikeOn(like);
            }
        }
        fetchLikeInfo();
    }, [user]);

    const likeToggle = async () => {
        if(!user?.email) return;
        
        const like = await likeCheckNowUser(newsId, user.email);

        if(!like) {
            const insertLike = await fetch(`/api/news/likeInsert`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({id: newsId, email: user.email})
            })
            .then((res) => res.json())
            .then((data) => {
                if(data.ok) return data.likeOn;
                else return false;
            });

            setLikeOn(insertLike);
        } else {
            const deleteLike = await fetch(`/api/news/likeDelete`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({id: newsId, email: user.email})
            })
            .then((res) => res.json())
            .then((data) => {
                if(data.ok) return data.likeOn;
                else return false;
            });

            setLikeOn(deleteLike);
        }
    }

    return (
        <div className="flex flex-col gap-4">
            {user ?
            <div className="flex justify-between items-center">
                <span>이 기사를 추천합니다</span>

                <div className={`flex items-center gap-2 cursor-pointer px-2 py-1 border-2 rounded-full`} onClick={likeToggle}>
                    <Image 
                        src={likeOn ? "/images/좋아요 후.png" : "/images/좋아요 전.png"}
                        alt="좋아요"
                        width={20} height={20}
                    />
                    <div>{newsLike}</div>
                </div>
            </div>
            :
            <div className="flex justify-between items-center">
                <span>이 기사를 추천합니다</span>

                <div className={`flex items-center gap-2 cursor-pointer px-2 py-1 border-2 rounded-full`} onClick={() => router.push('/login')}>
                    <Image 
                        src={"/images/좋아요 전.png"}
                        alt="좋아요"
                        width={20} height={20}
                    />
                    <div>{newsLike}</div>
                </div>
            </div>}


            <div> 
                <NewsModalCommentInput user={user} newsId={newsId} insertComment={setComments} />
                <NewsModalCommentList comments={comments} user={user ? user : null} updateComments={setComments} />
            </div>
        </div>
    );
}