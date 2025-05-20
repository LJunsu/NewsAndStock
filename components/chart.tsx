import { JSDOM } from "jsdom";
import * as d3 from "d3";
import { StockType } from "@/lib/StockDataType";

// https://brunch.co.kr/@993679fb217e4e4/1
interface ChartProp {
    data: StockType[]
}
export const Chart = ({data}: ChartProp) => {
    type StockDatum = {
        date: Date;
        open: number;
        high: number;
        low: number;
        close: number;
        volume: number;
    };
    const stockData: StockDatum[] = data.map((item) => ({
        date: new Date(item.date),
        open: Number(item.open),
        high: Number(item.high),
        low: Number(item.low),
        close: Number(item.close),
        volume: Number(item.volume)
    }));

    const {document} = new JSDOM().window;
    const svg = d3.select(document.body).append("svg");

    const width = 1024;
    const height = 300;
    const padding = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 50
    }

    const candleHeight = 250;

    svg
        .attr("width", width)
        .attr("height", height)
        .style("background", "#17181E");
        
    const x = d3
        .scaleBand()
        .domain(stockData.map(d => d.date.toISOString()))
        .range([padding.left, width - padding.right])
        .padding(0.3);

    const xTime = d3
        .scaleTime()
        .domain(d3.extent(stockData, d => d.date) as [Date, Date])
        .range([padding.left, width - padding.right]);

    const yCandle = d3
        .scaleLinear()
        .domain([
            d3.min(stockData, d => d.low)! * 0.95,
            d3.max(stockData, d => d.high)! * 1.05,
        ])
        .range([padding.top + candleHeight, padding.top]);

    const gCandle = svg.append("g");

    gCandle
        .selectAll("rect.candle")
        .data(stockData)
        .enter()
        .append("rect")
        .attr("class", "candle")
        .attr("x", d => x(d.date.toISOString())!)
        .attr("y", d => yCandle(Math.max(d.open, d.close)))
        .attr("width", x.bandwidth())
        .attr("height", d => Math.abs(yCandle(d.open) - yCandle(d.close)))
        .attr("fill", d => (d.close >= d.open ? "lime" : "red"));
    
    gCandle
        .selectAll("line.stem")
        .data(stockData)
        .enter()
        .append("line")
        .attr("class", "stem")
        .attr("x1", d => x(d.date.toISOString())! + x.bandwidth() / 2)
        .attr("x2", d => x(d.date.toISOString())! + x.bandwidth() / 2)
        .attr("y1", d => yCandle(d.high))
        .attr("y2", d => yCandle(d.low))
        .attr("stroke", d => (d.close >= d.open ? "lime" : "red"));

    svg
        .append("g")
        .attr("transform", `translate(0, ${height - padding.bottom})`)
        .style("color", "#fff")
        .call(
            d3.axisBottom(xTime).ticks(20).tickFormat((d) => d3.timeFormat("%Y-%m-%d")(d as Date))
        );

    svg
        .append("g")
        .attr("transform", `translate(${padding.left}, 0)`)
        .style("color", "#fff")
        .call(d3.axisLeft(yCandle));

    return (
        <>
            <div 
                className="flex w-full h-full"
                dangerouslySetInnerHTML={{__html: document.body.innerHTML}}
            ></div>
        </>
    )
}