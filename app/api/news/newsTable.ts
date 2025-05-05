import { executeSQL } from "@/lib/db";

// 사용자가 선택한 뉴스 id가 데이터베이스에 존재하는지 확인하기 위한 데이터
export const newsCheckId = (id: string) => {
    const query = `SELECT id FROM news WHERE id = "${id}"`;

    return executeSQL(query);
}