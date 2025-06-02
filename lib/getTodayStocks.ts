"use server";

export const getTodayStocks = async (page: number) => {
    const resp = await fetch(
        `https://api-v2.deepsearch.com/v2/companies/stocks?market=kr&page=${page}&page_size=16&api_key=${process.env.DEEPSEARCH_API_KEY}`, {
            next: {revalidate: 3600},
        }
    );
    const todayStocks = await resp.json();

    return todayStocks;
}