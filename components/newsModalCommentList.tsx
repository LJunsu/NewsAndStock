import { CommentType } from "./newsModal";

interface NewsModalCommentListProps {
    comments: CommentType[]
}
export const NewsModalCommentList = ({comments}: NewsModalCommentListProps) => {

    return (
        <div>
            {comments ? comments.map((comment) => {
                return (
                    <div key={comment.news_comment_id} className="flex">
                        <div>{comment.email}</div>
                        <div>{comment.news_comment_content}</div>
                    </div>
                )
            }) : null}
        </div>
    );
}