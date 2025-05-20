import { Chart } from "@/components/chart";
import formatDateString from "@/lib/formatDateString";

const getSymbolStock = async (symbol: string) => {
    const period: string[] = ["1m", "3m", "ty", "1y", "5y"];
    const periodCtr: number = 0;

    const todayDate = String(new Date());
    const today = formatDateString(todayDate, "YYYY-MM-DD");

    const resp = await fetch(`https://api-v2.deepsearch.com/v2/companies/${symbol}/stock?date_to=${today}&page_size=10&period=${period[periodCtr]}&api_key=${process.env.DEEPSEARCH_API_KEY}`, {
        next: { revalidate: 3600 }
    });
    const symbolStock = await resp.json();

    return symbolStock;
}

interface StockSymbolProps {
    params: Promise<{symbol: string}>;
}
export default async function StockSymbol({params}: StockSymbolProps) {
    const {symbol} = await params;

    const symbolStock = await getSymbolStock(symbol);
    console.log(symbolStock)

    return (
        <div className="flex flex-col w-full h-full">
            <div className="flex justify-between items-center mb-4">
                <div className="flex flex-col">
                    <div className="text-[0.7rem] text-[#767678]">
                        {symbolStock.data[0].symbol}
                    </div>

                    <div className="w-full text-lg font-bold text-ellipsis overflow-hidden whitespace-nowrap">
                        {symbolStock.data[0].entity_name}
                    </div>
                </div>

                <div>{formatDateString(String(new Date()), "YYYY년 MM월 DD일")}</div>
            </div>

            {symbolStock.detail.ok && <Chart data={symbolStock.data} />}
        </div>
    )
}