import { UserInfo } from "@/lib/UserInfo";
import { useActionState } from "react";
import { addNewsCommentAction } from "./action/addNewsCommentAction";
import { CommentType } from "./newsModal";

interface NewsModalCommentInputProps {
    user: UserInfo | null,
    newsId: string,
    insertComment: React.Dispatch<React.SetStateAction<CommentType[]>>;
}
export const NewsModalCommentInput = ({user, newsId, insertComment} : NewsModalCommentInputProps) => {
    const [state, action] = useActionState(addNewsCommentAction, null);

    const clickInsertComment = async () => {
        const formElement = document.getElementById("commentForm") as HTMLFormElement;
        if(!formElement) return;

        const formData = new FormData(formElement);
        let newsId = formData.get("newsId");
        let email = formData.get("email");
        let comment = formData.get("comment");

        newsId = typeof newsId === "string" ? newsId : ""
        email = typeof email === "string" ? email : ""
        comment = typeof comment === "string" ? comment : ""
        if(comment.length <= 3) return;

        const newComment: CommentType = {
            news_comment_id: Date.now() + Math.random(),
            news_comment_content: comment,
            id: newsId,
            email: email,
            nickname: user!.nickname,
            tel_number: user?.tel_number,
            profile_image: user?.profile_image
        }

        insertComment(prev => [...prev, newComment]);
    }

    if(!user) return;

    return (
        <div className="flex flex-col gap-2 w-full p-2 border-1 border-[#E5E5E5] rounded-lg">
            <div>
                {user?.nickname}
            </div>

            <form action={action} id="commentForm" className="flex flex-col gap-4 w-full">
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