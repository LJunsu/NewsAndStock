"use client";

import * as d3 from "d3";
import { StockType } from "@/lib/StockDataType";
import { startTransition, useEffect, useRef, useState } from "react";
import { getSymbolStock } from "@/lib/getSymbolStock";
import { StockDatum, symbolStockDataConversion } from "@/lib/symbolStockDataConversion";
import formatDateString from "@/lib/formatDateString";

interface ChartProp {
    data: StockType[],
    symbol: string
}
export const Chart = ({data, symbol}: ChartProp) => {
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const svgRef = useRef<SVGSVGElement | null>(null);
    const [width, setWidth] = useState<number>(0);
    const [chartData, setChartData] = useState<StockDatum[] | null>();

    useEffect(() => {
        const stockData = symbolStockDataConversion(data);
        setChartData(stockData);
    }, []);

    const chartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = e.target.value;

        startTransition(async () => {
            const result = await getSymbolStock(symbol, newDate);

            const stockData = symbolStockDataConversion(result.data);
            setChartData(stockData);
        });
    };

    const height = 500;
    const padding = {
        top: 20,
         right: 20,
        bottom: 30,
        left: 50
    }
    // 캔들 차트 높이
    const candleHeight = 450;

    useEffect(() => {
        if (!wrapperRef.current) return;

        // ResizeObserver로 부모 요소 너비 추적
        const observer = new ResizeObserver(entries => {
            for (const entry of entries) {
                setWidth(entry.contentRect.width);
            }
        });

        observer.observe(wrapperRef.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!svgRef.current || !chartData) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove(); 

        // svg 기본 속성 설정
        svg
            .attr("width", width) // svg 가로 크기
            .attr("height", height) // svg 세로 크기
            .style("background", "#17181E"); // svg 배경색
        
        // x축, 시간축 스케일 정의(막대 위치 계산)
        const x = d3
            // 카테고리형 스케일
            // 범주형 데이터에 막대 너비 할당
            .scaleBand() 
            // domain - 입력 값 범위
            // 각 날짜를 문자열로 변환하여 도메인 설정
            .domain(chartData.map(d => d.date.toISOString())) 
            // range - 출력 값 범위(픽셀)
            // 실제 화면 위치 범위
            .range([padding.left, width - padding.right])
            // 막대 간 간격
            .padding(0.3);

        // y축 스케일(가격 값에 따라 높이 설정)
        const yCandle = d3
            // 연속형 숫자 스케일
            .scaleLinear() 
            .domain([
                // 저가 기준 최소 값보다 조금 낮게
                d3.min(chartData, d => d.low)! * 0.95,
                // 고가 기준 최대 값보다 조금 높게
                d3.max(chartData, d => d.high)! * 1.05,
            ])
            // svg 내 y축 위치(위에서 아래로)
            .range([padding.top + candleHeight, padding.top]);

        // x축 기준 수직 그리드 라인 추가
        svg.append("g")
        .attr("class", "x-grid")
        .attr("transform", `translate(0, ${height - padding.bottom})`)
        .call(
            d3.axisBottom(x)
            .tickSize(-(candleHeight)) // 위로 올라가는 선
            .tickFormat(() => "")      // 눈금 텍스트 제거
        )
        .selectAll("line")
        .attr("stroke", "#333")         // 선 색상
        .attr("stroke-dasharray", "2,2"); // 점선

        // y축 기준 수평 그리드 라인 추가
        svg.append("g")
        .attr("class", "y-grid")
        .attr("transform", `translate(${padding.left}, 0)`)
        .call(
            d3.axisLeft(yCandle)
            .tickSize(-(width - padding.left - padding.right)) // 왼쪽에서 오른쪽
            .tickFormat(() => "")
        )
        .selectAll("line")
        .attr("stroke", "#333")
        .attr("stroke-dasharray", "2,2");

        // g 그룹 생성
        // 여러 막대와 선을 그룹으로 묶어서 추가하기 위한 svg g 요소
        const gCandle = svg.append("g");

        // 캔들(시가~종가) 막대 그리기
        gCandle
            // candle 클래스(캔들) 모두 선택
            .selectAll("rect.candle")
            // 데이터 바인딩
            .data(chartData)
            .enter()
            // 각 데이터마다 막대 추가
            .append("rect")
            .attr("class", "candle")
            // x 위치
            .attr("x", d => x(d.date.toISOString())!)
            // 위쪽 y 위치
            .attr("y", d => yCandle(Math.max(d.open, d.close)))
            // 막대 너비
            .attr("width", x.bandwidth())
            // 막대 높이
            .attr("height", d => Math.abs(yCandle(d.open) - yCandle(d.close)))
            // 색상 (+ 초록, - 빨강)
            .attr("fill", d => (d.close >= d.open ? "lime" : "red"));
        
        // 고가/저가 선(심지) 그리기
        gCandle
            .selectAll("line.stem")
            .data(chartData)
            .enter()
            .append("line")
            .attr("class", "stem")
            .attr("x1", d => x(d.date.toISOString())! + x.bandwidth() / 2)
            .attr("x2", d => x(d.date.toISOString())! + x.bandwidth() / 2)
            // 고가 위치
            .attr("y1", d => yCandle(d.high))
            // 저가 위치
            .attr("y2", d => yCandle(d.low))
            .attr("stroke", d => (d.close >= d.open ? "lime" : "red"))
            .attr("stroke-width", 2);

        // x축 그리기(날짜 눈금)
        svg
            .append("g")
            // 아래쪽에 위치
            .attr("transform", `translate(0, ${height - padding.bottom})`)
            .style("color", "#fff")
            .call(d3
                // 아래쪽 x축
                .axisBottom(x)
                // 눈금 수
                .ticks(10)
                // 날짜 포맷
                .tickFormat((d) => {
                    if(width > 700) {
                        return d3.timeFormat("%Y-%m-%d")(new Date(d))
                    } else if(width > 400) {
                        return d3.timeFormat("%m-%d")(new Date(d))
                    } else {
                        return d3.timeFormat("%d")(new Date(d))
                    }
                })
            );

        // y축 그리기(가격 눈금)
        svg
            .append("g")
            // 왼쪽 위치
            .attr("transform", `translate(${padding.left}, 0)`)
            .style("color", "#fff")
            // 왼쪽 y축
            .call(d3.axisLeft(yCandle));

        const tooltip = d3
            .select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("background", "rgba(0, 0, 0, 0.7)")
            .style("color", "#fff")
            .style("padding", "6px 10px")
            .style("border-radius", "4px")
            .style("font-size", "12px")
            .style("pointer-events", "none")
            .style("opacity", "0");

        gCandle
            .selectAll("rect.candle")
            .on("mouseover", (e, data) => {
                const d = data as StockDatum;
                tooltip
                    .style("opacity", 1)
                    .html(`
                        <strong>${d3.timeFormat("%Y-%m-%d")(d.date)}</strong><br/>
                        시가: ${d.open}<br/>
                        고가: ${d.high}<br/>
                        저가: ${d.low}<br/>
                        종가: ${d.close}
                    `);
            })
            .on("mousemove", (e) => {
                tooltip
                    .style("left", e.pageX + 10 + "px")
                    .style("top", e.pageY - 28 + "px");
            })
            .on("mouseout", () => {
                tooltip
                    .style("opacity", 0);
            });

        gCandle
            .selectAll("line.stem")
            .on("mouseover", (e, data) => {
                const d = data as StockDatum;
                tooltip
                    .style("opacity", 1)
                    .html(`
                        <strong>${d3.timeFormat("%Y-%m-%d")(d.date)}</strong><br/>
                        시가: ${d.open}<br/>
                        고가: ${d.high}<br/>
                        저가: ${d.low}<br/>
                        종가: ${d.close}
                    `);
            })
            .on("mousemove", (e) => {
                tooltip
                    .style("left", e.pageX + 10 + "px")
                    .style("top", e.pageY - 28 + "px");
            })
            .on("mouseout", () => {
                tooltip
                    .style("opacity", 0);
            });
    }, [chartData, width]);

    return (
        <>
            <div
                ref={wrapperRef} 
                className="flex flex-col gap-4 w-full h-full"
            >
                <svg ref={svgRef}></svg>

                <div className="w-full flex justify-between gap-8 text-lg">
                    <div className="flex flex-col gap-4">
                        <div>{formatDateString(String(new Date()), "YYYY년 MM월 DD일")} 기준</div>

                        <div className="flex gap-4">
                            <div className="flex flex-col items-center">
                                <span className="text-[#767678]">전일</span>
                                <span className={`${data[0].change > 0 ? "text-red-600" : "text-[#3F63BF]"}`}>{data[0].change.toLocaleString("ko-KR")}</span>
                            </div>

                            <div className="flex flex-col items-center">
                                <span className="text-[#767678]">시가</span>
                                <span className={`${data[0].open > 0 ? "text-red-600" : "text-[#3F63BF]"}`}>{data[0].open.toLocaleString("ko-KR")}</span>
                            </div>

                            <div className="flex flex-col items-center">
                                <span className="text-[#767678]">고가</span>
                                <span className={`${data[0].high > 0 ? "text-red-600" : "text-[#3F63BF]"}`}>{data[0].high.toLocaleString("ko-KR")}</span>
                            </div>

                            <div className="flex flex-col items-center">
                                <span className="text-[#767678]">저가</span>
                                <span className={`${data[0].low > 0 ? "text-red-600" : "text-[#3F63BF]"}`}>{data[0].low.toLocaleString("ko-KR")}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 items-start text-sm">
                        <span>차트 날짜</span>
                        <input type="date" onChange={chartDateChange} />
                    </div>
                </div>
            </div>
        </>
    )
}