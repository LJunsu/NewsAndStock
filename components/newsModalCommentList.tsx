import { CommentType } from "./newsModal";
import Image from "next/image";
import { UserInfo } from "@/lib/UserInfo";
import { useState } from "react";

interface NewsModalCommentListProps {
    comments: CommentType[],
    user: UserInfo | null,
    updateComments: React.Dispatch<React.SetStateAction<CommentType[]>>;
}
type DeleteCommentIdType = {
  newsId: string;
  newsCommentId: number;
};
export const NewsModalCommentList = ({comments, user, updateComments}: NewsModalCommentListProps) => {
    const [isDeleteCommentModal, setDeleteCommentModal] = useState<boolean>(false);
    const [deleteCommentId, setDeleteCommentId] = useState<DeleteCommentIdType | null>(null);

    const updateComment = () => {ZXZXZDSADASDASDASD
        // 댓글 수정 구현하기
    }

    const deleteComment = async (newsId: string, commentId: number) => {
        const deleteData = {
            newsId,
            commentId
        }

        // DB를 통해 댓글 삭제 전 낙관적 UI를 통해 화면에 댓글을 먼저 삭제
        updateComments(prev => prev.filter(comment => comment.news_comment_id !== commentId));

        // 댓글 delete API
        fetch("/api/news/deleteComment", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(deleteData)
        });

        setDeleteCommentModal(false);
    }

    return (
        <div className="relative">
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
                                    <div onClick={() => {
                                        setDeleteCommentModal(true);
                                        setDeleteCommentId({newsId: comment.id, newsCommentId: comment.news_comment_id} as DeleteCommentIdType)
                                    }} className="cursor-pointer">삭제</div>
                                </div>)
                                : null
                            ) : null}
                        </div>
                        
                        <div className="break-words whitespace-pre-wrap max-w-full">{comment.news_comment_content}</div>
                    </div>
                )
            }) : null}

            {isDeleteCommentModal && 
            <div className="fixed top-0 left-0 w-screen h-screen bg-black/30">
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white border-1 border-[#E5E5E5] shadow-2xl">
                    <div className="flex flex-col justify-between size-full p-8 text-sm">
                        <div className="text-center mb-6 text-base font-medium">삭제하시겠습니까?</div>

                        <div className="flex justify-around gap-4">
                            <div 
                                onClick={() => {
                                    if(!deleteCommentId) return;
                                    deleteComment(deleteCommentId.newsId, deleteCommentId.newsCommentId);
                                }} 
                                className="px-4 py-2 cursor-pointer bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                예
                            </div>
                            <div onClick={() => setDeleteCommentModal(false)} className="px-4 py-2 cursor-pointer bg-gray-200 text-gray-800 rounded hover:bg-gray-300">아니오</div>
                        </div>
                    </div>
                </div>
            </div>
            }
        </div>
    );
}