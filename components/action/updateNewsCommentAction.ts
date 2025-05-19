import { z } from "zod";
import { CommentType } from "../newsModal";

const updateNewsCommentSchema = z.object({
    newsId: z.string(),
    commentId: z.string(),
    email: z.string().email(),
    comment: z.string().min(4, {message: "4글자 이상 입력하세요."}).max(200, {message: "댓글이 너무 깁니다."})
})

export const updateNewsCommentAction = async (formData: FormData) => {
    const data = {
        newsId: formData.get("newsId"),
        commentId: formData.get("commentId"),
        email: formData.get("email"),
        comment: formData.get("comment")
    };

    const result = await updateNewsCommentSchema.safeParseAsync(data);

    if(!result.success) {
        // zod 유효성 검사 실패 - 에러 메시지
        return result.error.flatten();
    } else {
        const updateComment = {
            newsId: result.data.newsId,
            commentId: result.data.commentId,
            email: result.data.email,
            comment: result.data.comment
        }

        // update API
        const nowUpdateComment = await fetch("/api/news/updateComment", {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(updateComment)
        })
        .then(res => res.json())
        .then(data => {
            if(!data.ok) console.error(data.message);
            // update 성공 시 추가된 댓글 데이터 반환(낙관적 UI 관련 추가된 데이터 화면에 출력하기 위함)
            return data.nowUpdateComment;
        })
        .catch(err => {
            console.error(err);
        });

        // insert 성공 시 추가된 댓글 데이터 반환(낙관적 UI 관련 추가된 데이터 화면에 출력하기 위함)
        const resultComment: CommentType = nowUpdateComment[0];

        return resultComment;
    }
}