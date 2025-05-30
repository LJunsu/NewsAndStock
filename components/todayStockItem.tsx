import { StockType } from "@/lib/StockDataType"
import Link from "next/link"

interface TodayStockItemProp {
    stock: StockType
}
export const TodayStockItem = ({stock}: TodayStockItemProp) => {

    return (
        <Link href={`/stock/symbol/${stock.symbol}`} className="w-[calc(50%-1rem)] p-2 flex justify-between gap-4 cursor-pointer border-[#E5E5E5] border-b-1 duration-100 bg-[#F4F6F8] hover:bg-[#e5e7ea]">
            <div className="w-2/3 flex flex-col gap-4">
                <div className="flex flex-col">
                    <div className="text-[0.7rem] text-[#767678]">
                        {stock.symbol}
                    </div>

                    <div className="w-full text-lg font-bold text-ellipsis overflow-hidden whitespace-nowrap">
                        {stock.entity_name}
                    </div>
                </div>

                <div className="flex gap-4 items-end text-sm">
                    <div className={`text-2xl font-bold ${stock.change > 0 ? "text-red-600" : "text-[#3F63BF]"}`}>
                        {stock.close.toLocaleString("ko-KR")}
                    </div>

                    <div className={`${stock.change > 0 ? "text-red-600" : "text-[#3F63BF]"}`}>{stock.change_percent} %</div>
                </div>
            </div>

            <div className="flex gap-8 text-sm">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col items-center">
                        <span className="text-[#767678]">전일</span>
                        <span className={`${stock.change > 0 ? "text-red-600" : "text-[#3F63BF]"}`}>{stock.change.toLocaleString("ko-KR")}</span>
                    </div>

                    <div className="flex flex-col items-center">
                        <span className="text-[#767678]">시가</span>
                        <span className={`${stock.open > 0 ? "text-red-600" : "text-[#3F63BF]"}`}>{stock.open.toLocaleString("ko-KR")}</span>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex flex-col items-center">
                        <span className="text-[#767678]">고가</span>
                        <span className={`${stock.high > 0 ? "text-red-600" : "text-[#3F63BF]"}`}>{stock.high.toLocaleString("ko-KR")}</span>
                    </div>

                    <div className="flex flex-col items-center">
                        <span className="text-[#767678]">저가</span>
                        <span className={`${stock.low > 0 ? "text-red-600" : "text-[#3F63BF]"}`}>{stock.low.toLocaleString("ko-KR")}</span>
                    </div>
                </div>
            </div>
        </Link>
    )
}