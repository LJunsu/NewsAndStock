import { CommentType } from "./newsModal";
import Image from "next/image";
import { UserInfo } from "@/lib/UserInfo";
import React, { useRef, useState } from "react";
import formatDateString from "@/lib/formatDateString";
import { updateNewsCommentAction } from "./action/updateNewsCommentAction";

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
    const [isCommentUpdate, setCommentUpdate] = useState<{is: boolean, index: number | null}>({is: false, index: null});

    const [actionError, setActionError] = useState<string[]>([]);
    const updateCommentFormRef = useRef<HTMLFormElement>(null);
    const updateTextareaRef = useRef<HTMLTextAreaElement>(null);

    const updateComment = (commentIndex: number | null) => {
        setActionError([]);
        
        if(!isCommentUpdate.is) setCommentUpdate({is: true, index: commentIndex});
        else {
            if(isCommentUpdate.index === commentIndex) setCommentUpdate({is: false, index: null});
            else setCommentUpdate({is: true, index: commentIndex});
        }
    }

    const updateCommentEnter = async (e: React.FormEvent) => {
        e.preventDefault();

        const formElement = updateCommentFormRef.current;
        if(!formElement) return;

        // 이벤트를 발생한 form의 내부 데이터
        const formData = new FormData(formElement);

        const newsId = formData.get("newsId") as string;
        const commentId = Number(formData.get("commentId"));
        const comment = formData.get("comment") as string;

        const optimisticComment: CommentType = {
            news_comment_id: commentId,
            news_comment_content: comment + "(낙관)",
            id: newsId,
            email: user!.email,
            nickname: user!.nickname,
            tel_number: user?.tel_number,
            profile_image: user?.profile_image,
            news_comment_insert_date: formatDateString(String(new Date()), "YYYY-MM-DD HH:mm")
        };

        if(comment.length > 3) {
            updateComments(prev => [...prev.filter(comment => comment.news_comment_id !== commentId), optimisticComment]);
            updateComment(commentId);
        }

        // 댓글 update를 수행하는 action
        const result = await updateNewsCommentAction(formData);

        if("formErrors" in result) {
            if(result.fieldErrors.comment) setActionError(result.fieldErrors.comment);
        } else {
            updateComments(prev => {
                // 현재 Comment 리스트에 데이터들 중 news_comment_id가 낙관적UI로 생성된 댓글 id를 제외한 배열
                const filtered = prev.filter((item) => item.news_comment_id !== commentId);
                // 낙관적 UI로 생성된 댓글을 제거한 후 새로운 배열 생성
                return [...filtered, result];
            });

            // textarea 초기화
            if (updateTextareaRef.current) updateTextareaRef.current.value = "";
        }
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
            {comments ? comments.map((comment, commentIndex) => {
                return (
                    <div 
                        key={comment.news_comment_id} 
                        className="flex flex-col gap-4 mt-4 pb-4 border-b-1 border-[#E5E5E5] text-sm"
                    >
                        <div className="flex justify-between items-center">
                            <div className="flex gap-4 items-center">
                                <div className="flex gap-2 items-center">
                                    <div className="relative w-10 h-10 rounded-full border-1 border-[#E5E5E5] overflow-hidden">
                                        {comment.profile_image 
                                        ? <Image src={comment.profile_image} alt={comment.nickname} fill className="object-contain" />
                                        : <Image src="/images/default_image.png" alt={comment.nickname} fill className="object-contain" />}
                                    </div>

                                    <div>{comment.nickname}</div>
                                </div>

                                <div>{formatDateString(comment.news_comment_insert_date, "YYYY-MM-DD HH:mm")}</div>
                            </div>

                            {user ? (comment.email === user.email ? 
                                (<div className="flex gap-2">
                                    <div onClick={() => updateComment(commentIndex)} 
                                        className="cursor-pointer"
                                    >수정</div>

                                    <div onClick={() => {
                                        setDeleteCommentModal(true);
                                        setDeleteCommentId({newsId: comment.id, newsCommentId: comment.news_comment_id} as DeleteCommentIdType)
                                    }} className="cursor-pointer">삭제</div>
                                </div>)
                                : null
                            ) : null}
                        </div>
                        
                        {isCommentUpdate.index === commentIndex && isCommentUpdate.is
                        ? <form ref={updateCommentFormRef} className="flex flex-col gap-2 w-full">
                            <input type="hidden" name="newsId" value={comment.id} />
                            <input type="hidden" name="commentId" value={comment.news_comment_id} />
                            <input type="hidden" name="email" value={user?.email} />
                            <textarea
                                ref={updateTextareaRef}
                                name="comment"
                                rows={3}
                                placeholder="다양한 의견이 서로 존중될 수 있도록 다른 사람에게 불쾌감을 주는 욕설, 혐오, 비하의 표현이나 타인의 권리를 침해하는 내용은 주의해주세요."
                                defaultValue={comment.news_comment_content}
                                className="w-full border-1 border-[#E5E5E5] resize-none p-2"
                            />

                            <div className="flex gap-4">
                                <button 
                                    onClick={() => updateComment(null)}
                                    className="flex justify-center py-1 w-1/2 rounded-sm text-white bg-gray-300 cursor-pointer"
                                >취소</button>

                                <button 
                                    onClick={updateCommentEnter}
                                    className="flex justify-center py-1 w-1/2 rounded-sm text-white bg-[#3F63BF] cursor-pointer"
                                >수정 등록</button>
                            </div>

                            {actionError ? actionError.map((err, i) => <div key={i}>{err}</div>) : null}
                        </form>
                        : <div className="break-words whitespace-pre-wrap max-w-full">{comment.news_comment_content}</div>}
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