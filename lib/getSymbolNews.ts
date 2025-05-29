"use server";

export const getSymbolNews = async (symbol: string) => {
    const resp = await fetch(`https://api-v2.deepsearch.com/v1/articles?symbols=KRX:${symbol}&api_key=${process.env.DEEPSEARCH_API_KEY}`, {
        next: { revalidate: 3600 }
    });
    const symbolNews = await resp.json();

    return symbolNews.data;
}
