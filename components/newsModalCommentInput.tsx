import { UserInfo } from "@/lib/UserInfo";
import { useActionState } from "react";
import { addNewsCommentAction } from "./action/addNewsCommentAction";

interface NewsModalCommentInputProps {
    user: UserInfo | null,
    newsId: string
}
export const NewsModalCommentInput = ({user, newsId} : NewsModalCommentInputProps) => {
    const [state, action] = useActionState(addNewsCommentAction, null);

    if(!user) return;

    return (
        <div className="flex flex-col gap-2 w-full p-2 border-1 border-[#E5E5E5] rounded-lg">
            <div>
                {user?.nickname}
            </div>

            <form action={action} className="flex flex-col gap-4 w-full">
                <input type="hidden" name="newsId" value={newsId} />
                <textarea
                    name="comment"
                    rows={3}
                    placeholder="다양한 의견이 서로 존중될 수 있도록 다른 사람에게 불쾌감을 주는 욕설, 혐오, 비하의 표현이나 타인의 권리를 침해하는 내용은 주의해주세요."
                    className="w-full border-1 border-[#E5E5E5] resize-none p-2"
                />

                <button className="flex justify-center text-white bg-[#3F63BF] cursor-pointer">등록</button>
            </form>
        </div>
    );
}