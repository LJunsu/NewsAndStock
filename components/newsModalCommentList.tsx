import { useEffect } from "react";
import { CommentType } from "./newsModal";
import Image from "next/image";
import { UserInfo } from "@/lib/UserInfo";

interface NewsModalCommentListProps {
    comments: CommentType[],
    user: UserInfo | null,
    updateComments: React.Dispatch<React.SetStateAction<CommentType[]>>;
}
export const NewsModalCommentList = ({comments, user, updateComments}: NewsModalCommentListProps) => {
    const updateComment = () => {
        // 댓글 수정 구현하기
    }

    const deleteComment = async (newsId: string, commentId: number) => {
        const deleteData = {
            newsId,
            commentId
        }

        updateComments(prev => prev.filter(comment => comment.news_comment_id !== commentId));

        fetch("/api/news/deleteComment", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(deleteData)
        });
    }

    return (
        <div>
            {comments ? comments.map((comment) => {
                return (
                    <div 
                        key={comment.news_comment_id} 
                        className="flex flex-col gap-4 mt-4 pb-4 border-b-1 border-[#E5E5E5] text-sm"
                    >
                        <div className="flex justify-between items-center">
                            <div className="flex gap-2 items-center">
                                <div className="relative w-10 h-10 rounded-full border-1 border-[#E5E5E5] overflow-hidden">
                                    {comment.profile_image 
                                    ? <Image src={comment.profile_image} alt={comment.nickname} fill className="object-contain" />
                                    : <Image src="/images/default_image.png" alt={comment.nickname} fill className="object-contain" />}
                                </div>

                                <div>{comment.nickname}</div>
                            </div>
                            {user ? (comment.email === user.email ? 
                                (<div className="flex gap-2">
                                    <div className="cursor-pointer">수정</div>
                                    <div onClick={() => {deleteComment(comment.id, comment.news_comment_id)}} className="cursor-pointer">삭제</div>
                                </div>)
                                : null
                            ) : null}

                        </div>
                        
                        <div className="break-words whitespace-pre-wrap max-w-full">{comment.news_comment_content}</div>
                    </div>
                )
            }) : null}
        </div>
    );
}