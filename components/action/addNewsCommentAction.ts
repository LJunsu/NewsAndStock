import { z } from "zod";

const addNewsCommentSchema = z.object({
    newsId: z.string(),
    comment: z.string().min(4, {message: "4글자 이상 입력하세요."}).max(200, {message: "댓글이 너무 깁니다."})
})

export const addNewsCommentAction = async (prevState: unknown, formData: FormData) => {
    const data = {
        newsId: formData.get("newsId"),
        comment: formData.get("comment")
    };

    const result = await addNewsCommentSchema.safeParseAsync(data);

    if(!result.success) {
        return result.error.flatten();
    } else {
        fetch("")
    }
}