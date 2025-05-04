"use server";

const getFormattedDate = (date: Date): string => {
    return date.toISOString().split("T")[0];
}

export async function getNews(keyword: string, page: number) {
        const today = new Date();
        const prevMonth = new Date();
        prevMonth.setMonth(prevMonth.getMonth() - 1);
    
        const currentDate = getFormattedDate(today);
        const prevMonthDate  = getFormattedDate(prevMonth);

    let news;

    try {
        const resp = await fetch(`https://api-v2.deepsearch.com/v1/articles/${keyword}?&page=${page}&page_size=16&date_from=${prevMonthDate}&date_to=${currentDate}&api_key=${process.env.DEEPSEARCH_API_KEY}`);
        news = await resp.json();
    } catch(err) {
        console.error(err);
    }

    return news;
}