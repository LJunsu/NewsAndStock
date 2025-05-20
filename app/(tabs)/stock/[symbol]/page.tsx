import { Chart } from "@/components/chart";

const getSymbolStock = async (symbol: string) => {
    const period: string[] = ["1m", "3m", "ty", "1y", "5y"];
    const periodCtr: number = 0;

    const resp = await fetch(`https://api-v2.deepsearch.com/v2/companies/${symbol}/stock?period=${period[periodCtr]}&api_key=${process.env.DEEPSEARCH_API_KEY}`, {
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

    return (
        <div className="flex py-4 w-full h-full">
            {symbolStock.detail.ok && <Chart data={symbolStock.data} />}
        </div>
    )
}