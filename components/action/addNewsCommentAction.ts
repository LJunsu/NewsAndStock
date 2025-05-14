import { z } from "zod";
import { CommentType } from "../newsModal";

const addNewsCommentSchema = z.object({
    newsId: z.string(),
    email: z.string().email(),
    comment: z.string().min(4, {message: "4글자 이상 입력하세요."}).max(200, {message: "댓글이 너무 깁니다."})
})

export const addNewsCommentAction = async (formData: FormData) => {
    const data = {
        newsId: formData.get("newsId"),
        email: formData.get("email"),
        comment: formData.get("comment")
    };

    const result = await addNewsCommentSchema.safeParseAsync(data);

    if(!result.success) {
        // zod 유효성 검사 실패 - 에러 메시지
        return result.error.flatten();
    } else {
        const insertComment = {
            newsId: result.data.newsId,
            email: result.data.email,
            comment: result.data.comment
        }

        // insert API
        const nowInsertComment = await fetch("/api/news/insertComment", {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(insertComment)
        })
        .then(res => res.json())
        .then(data => {
            if(!data.ok) console.error(data.message);
            // insert 성공 시 추가된 댓글 데이터 반환(낙관적 UI 관련 추가된 데이터 화면에 출력하기 위함)
            return data.nowInsertComment;
        })
        .catch(err => {
            console.error(err);
        });

        // insert 성공 시 추가된 댓글 데이터 반환(낙관적 UI 관련 추가된 데이터 화면에 출력하기 위함)
        const resultComment: CommentType = nowInsertComment[0];

        return resultComment;
    }
}