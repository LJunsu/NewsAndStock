"use server";

import formatDateString from "./formatDateString";

export const getSymbolStock = async (symbol: string, todayDate: string) => {
    const period: string[] = ["1m", "3m", "ty", "1y", "5y"];
    const periodCtr: number = 0;

    const today = formatDateString(todayDate, "YYYY-MM-DD");

    const resp = await fetch(`https://api-v2.deepsearch.com/v2/companies/${symbol}/stock?date_to=${today}&page_size=10&period=${period[periodCtr]}&api_key=${process.env.DEEPSEARCH_API_KEY}`);
    const symbolStock = await resp.json();

    return symbolStock;
}