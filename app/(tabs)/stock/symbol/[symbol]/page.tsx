import { Chart } from "@/components/chart";
import { SymbolNews } from "@/components/symbolNews";
import { getSymbolStock } from "@/lib/getSymbolStock";

interface StockSymbolProps {
    params: Promise<{symbol: string}>;
}
export default async function StockSymbol({params}: StockSymbolProps) {
    const {symbol} = await params;

    const todayDate = String(new Date());
    const symbolStock = await getSymbolStock(symbol, todayDate);

    return (
        <div className="flex flex-col gap-4 w-full h-full">
            <div className="flex justify-between items-center mb-4">
                <div className="flex flex-col">
                    <div className="text-[0.7rem] text-[#767678]">
                        {symbolStock.data[0].symbol}
                    </div>

                    <div className="w-full text-lg font-bold text-ellipsis overflow-hidden whitespace-nowrap">
                        {symbolStock.data[0].entity_name}
                    </div>
                </div>
            </div>

            {symbolStock.detail.ok && <Chart data={symbolStock.data} symbol={symbol} />}

            {symbolStock.detail.ok && <SymbolNews symbol={symbol} />}
        </div>
    )
}