
// 호출 예시
// formatDateString(news_comment_insert_date, "YYYY-MM-DD HH:mm")

const formatDateString = (dateStr: string, format: string): string => {
    const date = new Date(dateStr);

    const map: Record<string, string> = {
        YYYY: String(date.getFullYear()),
        MM: String(date.getMonth() + 1).padStart(2, "0"),
        DD: String(date.getDate()).padStart(2, "0"),
        HH: String(date.getHours()).padStart(2, "0"),
        mm: String(date.getMinutes()).padStart(2, "0"),
        ss: String(date.getSeconds()).padStart(2, "0"),
    }

    // 문자열.replace(찾을_내용, 바꿀_내용)
    // format 문자열을 스캔하며 YYYY, MM, DD... 중 하나를 찾으면 map[token] 값으로 가져와 교체
    // 이때 token의 값은 YYYY, MM, DD... 정규식과 일치하는 부분 문자열로 이를 map 객체의 키로 사용
    return format.replace(/YYYY|MM|DD|HH|mm|ss/g, (token) => map[token]);
}

export default formatDateString;