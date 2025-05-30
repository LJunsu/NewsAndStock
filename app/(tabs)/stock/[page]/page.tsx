import { StockPagination } from "@/components/stockPagination";
import { TodayStockItem } from "@/components/todayStockItem";
import formatDateString from "@/lib/formatDateString";
import { StockType } from "@/lib/StockDataType";

// https://api-v2.deepsearch.com/v2/manual/redoc#tag/Company/operation/get_all_stock
// https://api-v2.deepsearch.com/v2/manual/redoc#tag/Company/operation/get_company_stock
// https://finance.naver.com/item/fchart.naver?code=034020

const getTodayStocks = async (page: number) => {
    const resp = await fetch(`https://api-v2.deepsearch.com/v2/companies/stocks?market=kr&page=${page}&page_size=16&api_key=${process.env.DEEPSEARCH_API_KEY}`);
    const todayStocks = await resp.json();

    return todayStocks;
}

interface StockPageProps {
    params: Promise<{page: string}>;
}
export default async function Stock({params}: StockPageProps) {
    // 로딩 구현하기
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