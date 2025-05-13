import { z } from "zod";
import { CommentType } from "../newsModal";

const addNewsCommentSchema = z.object({
    newsId: z.string(),
    email: z.string().email(),
    comment: z.string().min(4, {message: "4글자 이상 입력하세요."}).max(200, {message: "댓글이 너무 깁니다."})
})

export const addNewsCommentAction = async (prevState: unknown, formData: FormData) => {
    const data = {
        newsId: formData.get("newsId"),
        email: formData.get("email"),
        comment: formData.get("comment")
    };

    const result = await addNewsCommentSchema.safeParseAsync(data);

    if(!result.success) {
        return result.error.flatten();
    } else {
        const insertComment = {
            newsId: result.data.newsId,
            email: result.data.email,
            comment: result.data.comment
        }

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
            return data.nowInsertComment;
        })
        .catch(err => {
            console.error(err);
        });

        const resultComment: CommentType = nowInsertComment[0];
        console.log(">>>>>>>>>>>>", resultComment); // 이 결과를 기다린 후 반환해야 하는데..

        return resultComment;
    }
}