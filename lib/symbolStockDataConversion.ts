import { StockType } from "./StockDataType";

export type StockDatum = {
    date: Date;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
};
export const symbolStockDataConversion = (data: StockType[]) => {
    const stockData: StockDatum[] = data.map((item) => ({
        date: new Date(item.date),
        open: Number(item.open),
        high: Number(item.high),
        low: Number(item.low),
        close: Number(item.close),
        volume: Number(item.volume)
    }));

    return stockData.reverse();
}