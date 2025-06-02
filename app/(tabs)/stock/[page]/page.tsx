import { StockPagination } from "@/components/stockPagination";
import { TodayStockItem } from "@/components/todayStockItem";
import formatDateString from "@/lib/formatDateString";
import { getTodayStocks } from "@/lib/getTodayStocks";
import { StockType } from "@/lib/StockDataType";

interface StockPageProps {
    params: Promise<{page: string}>;
}
export default async function Stock({params}: StockPageProps) {
    const {page} = await params;

    let pageNumber = Number(page);
    if(typeof pageNumber !== "number" || pageNumber <= 0) pageNumber = 1;

    const todayStockData = await getTodayStocks(pageNumber);

    return (
        <div className="flex flex-col gap-8">
            <div>{formatDateString(String(new Date()), "YYYY년 MM월 DD일")}</div>

            <div className="w-full flex flex-wrap gap-8">
                {todayStockData.detail.ok && todayStockData.data.map((stock: StockType) => {
                    return <TodayStockItem key={stock.symbol} stock={stock} />
                })}
            </div>

            <StockPagination nowPage={pageNumber} size={3} />
        </div>
    )
}