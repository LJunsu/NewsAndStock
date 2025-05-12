import { executeSQL } from "@/lib/db";

// 사용자가 선택한 뉴스 id가 데이터베이스에 존재하는지 확인하기 위한 데이터
export const newsCheckId = (id: string) => {
    const query = `SELECT id FROM news WHERE id = ?`;

    return executeSQL(query, [id]);
}

// 사용자가 선택한 뉴스 id를 news 데이터베이스에 insert
export const insertNewsId = (id: string) => {
    const query = `INSERT INTO news (id) VALUES (?)`;

    return executeSQL(query, [id]);
}

// 사용자가 선택한 뉴스의 좋아요 수를 반환
export const newsLikeLength = (id: string) => {
    const query = `SELECT count(*) as size FROM news_like WHERE id = ?`

    return executeSQL(query, [id]);
}

// 사용자가 뉴스에 좋아요를 눌렀는지 확인
export const newsLikeCheck = (id: string, email: string) => {
    const query = `SELECT * FROM news_like WHERE id = ? AND email = ?`

    return executeSQL(query, [id, email]);
}

// 사용자가 좋아요 누른 뉴스가 데이터베이스가 없다면 좋아요를 추가
export const newsLikeInsert = (id: string, email: string) => {
    const query = `INSERT INTO news_like (news_like, id, email) VALUES (1, ?, ?)`

    return executeSQL(query, [id, email]);
}

// 사용자가 이미 좋아요를 누른 뉴스라면 좋아요를 삭제
export const newsLikeDelete = (id: string, email: string) => {
    const query = `DELETE FROM news_like WHERE id = ? AND email = ?`

    return executeSQL(query, [id, email]);
}

// 해당 뉴스 아이디에 사용자가 입력한 댓글을 추가
export const insertComment = (newsId: string, email: string, comment: string) => {
    const query = 
    `INSERT INTO news_comment (
        news_comment_content, id, email
    ) VALUES (
        ?, ?, ?
    )`;

    return executeSQL(query, [comment, newsId, email]);
}

// 해당 뉴스의 댓글 리스트를 반환
export const newsComments = (newsId: string) => {
    const query = 
    `SELECT nc.*, u.email, u.nickname, u.tel_number, u.profile_image
    FROM news_comment nc
    JOIN user u
    ON nc.email = u.email
    WHERE id = ?
    ORDER BY news_comment_id ASC
    `;
    
    return executeSQL(query, [newsId]);
}

// 해당 뉴스 아이디에 댓글을 삭제
export const deleteComment = (newsId: string, commentId: string) => {
    const query = `DELETE FROM news_comment WHERE id = ? AND news_comment_id = ?`;

    return executeSQL(query, [newsId, commentId]);
}