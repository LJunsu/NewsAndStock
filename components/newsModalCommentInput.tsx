import { UserInfo } from "@/lib/UserInfo";
import { useRef, useState } from "react";
import { addNewsCommentAction } from "./action/addNewsCommentAction";
import { CommentType } from "./newsModal";
import formatDateString from "@/lib/formatDateString";

interface NewsModalCommentInputProps {
    user: UserInfo | null,
    newsId: string,
    insertComment: React.Dispatch<React.SetStateAction<CommentType[]>>;
}
export const NewsModalCommentInput = ({user, newsId, insertComment} : NewsModalCommentInputProps) => {
    const [actionError, setActionError] = useState<string[]>([]);

    const formRef = useRef<HTMLFormElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const clickInsertComment = async (e: React.FormEvent) => {
        e.preventDefault();

        const formElement = formRef.current;
        if(!formElement) return;

        // 이벤트를 발생한 form의 내부 데이터
        const formData = new FormData(formElement);

        const comment = formData.get("comment") as string;
        // 낙관적 UI의 id로 사용할 중복되지 않을 임시 데이터
        const optimisticId = Date.now() + Math.random();

        const optimisticComment: CommentType = {
            news_comment_id: optimisticId,
            news_comment_content: comment + "(낙관)",
            id: newsId,
            email: user!.email,
            nickname: user!.nickname,
            tel_number: user?.tel_number,
            profile_image: user?.profile_image,
            news_comment_insert_date: formatDateString(String(new Date()), "YYYY-MM-DD HH:mm")
        };

        if(comment.length > 3) insertComment(prev => [...prev, optimisticComment]);

        // 댓글 insert를 수행하는 action
        const result = await addNewsCommentAction(formData);

        if("formErrors" in result) {
            if(result.fieldErrors.comment) setActionError(result.fieldErrors.comment);
        } else {
            insertComment(prev => {
                // 현재 Comment 리스트에 데이터들 중 news_comment_id가 optimisticId(낙관적UI로 생성된 댓글 id)를 제외한 배열
                const filtered = prev.filter((item) => item.news_comment_id !== optimisticId);
                // 낙관적 UI로 생성된 댓글을 제거한 후 새로운 배열 생성
                return [...filtered, result];
            });

            // textarea 초기화
            if (textareaRef.current) textareaRef.current.value = "";
        }
    }

    if(!user) return;

    return (
        <div className="flex flex-col gap-2 w-full p-2 border-1 border-[#E5E5E5] rounded-lg">
            <div>
                {user?.nickname}
            </div>

            <form ref={formRef} id="commentForm" className="flex flex-col gap-4 w-full">
                <input type="hidden" name="newsId" value={newsId} />
                <input type="hidden" name="email" value={user.email} />
                <textarea
                    ref={textareaRef}
                    name="comment"
                    rows={3}
                    placeholder="다양한 의견이 서로 존중될 수 있도록 다른 사람에게 불쾌감을 주는 욕설, 혐오, 비하의 표현이나 타인의 권리를 침해하는 내용은 주의해주세요."
                    className="w-full border-1 border-[#E5E5E5] resize-none p-2"
                />

                {actionError ? actionError.map((err, i) => <div key={i}>{err}</div>) : null}

                <button onClick={clickInsertComment} className="flex justify-center py-1 rounded-sm text-white bg-[#3F63BF] cursor-pointer">등록</button>
            </form>
        </div>
    );
}