import { UserInfo } from "@/lib/UserInfo";
import { useActionState, useRef, useTransition } from "react";
import { addNewsCommentAction } from "./action/addNewsCommentAction";
import { CommentType } from "./newsModal";

interface NewsModalCommentInputProps {
    user: UserInfo | null,
    newsId: string,
    insertComment: React.Dispatch<React.SetStateAction<CommentType[]>>;
}
export const NewsModalCommentInput = ({user, newsId, insertComment} : NewsModalCommentInputProps) => {
    const [state, action] = useActionState(addNewsCommentAction, null);

    const formRef = useRef<HTMLFormElement>(null);

    const [isPending, startTransition] = useTransition();

    const clickInsertComment = async (e: React.FormEvent) => {
        e.preventDefault();

        const formElement = formRef.current;
        if(!formElement) return;

        const formData = new FormData(formElement);

        let comment = formData.get("comment") as string;

        const optimisticComment: CommentType = {
            news_comment_id: Date.now() + Math.random(),
            news_comment_content: comment,
            id: newsId,
            email: user!.email,
            nickname: user!.nickname,
            tel_number: user?.tel_number,
            profile_image: user?.profile_image
        };

        if(comment.length > 3) insertComment(prev => [...prev, optimisticComment]);

        startTransition(async () => {
            const result = action(formData); // 이게 await로 수행되서 결과를 기다린 후 아래 콘솔을 찍어야 하는데, action보다 이게 먼저 끝나서 action의 결과를 못가져옴
            console.log("---------->", result);
        });
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
                    name="comment"
                    rows={3}
                    placeholder="다양한 의견이 서로 존중될 수 있도록 다른 사람에게 불쾌감을 주는 욕설, 혐오, 비하의 표현이나 타인의 권리를 침해하는 내용은 주의해주세요."
                    className="w-full border-1 border-[#E5E5E5] resize-none p-2"
                />

                {!state || state.fieldErrors.comment}

                <button onClick={clickInsertComment} className="flex justify-center text-white bg-[#3F63BF] cursor-pointer">등록</button>
            </form>
        </div>
    );
}