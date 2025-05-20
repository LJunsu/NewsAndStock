import { JSDOM } from "jsdom";
import * as d3 from "d3";
import { StockType } from "@/lib/StockDataType";

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

    // JSDOM(서버 환경에서 사용할 수 있는 가상 DOM)에서 document 객체
    const {document} = new JSDOM().window;
    // select로 document.body 요소 선택 - svg 태그 추가 - 최종적으로 svg 태그의 식별자
    const svg = d3.select(document.body).append("svg");

    // svg 및 차트 크기 설정 값
    const width = 1024;
    const height = 300;
    const padding = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 50
    }
    // 캔들 차트 높이
    const candleHeight = 250;

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
        .domain(stockData.map(d => d.date.toISOString())) 
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
            d3.min(stockData, d => d.low)! * 0.95,
            // 고가 기준 최대 값보다 조금 높게
            d3.max(stockData, d => d.high)! * 1.05,
        ])
        // svg 내 y축 위치(위에서 아래로)
        .range([padding.top + candleHeight, padding.top]);

    // g 그룹 생성
    // 여러 막대와 선을 그룹으로 묶어서 추가하기 위한 svg g 요소
    const gCandle = svg.append("g");

    // 캔들(시가~종가) 막대 그리기
    gCandle
        // candle 클래스(캔들) 모두 선택
        .selectAll("rect.candle")
        // 데이터 바인딩
        .data(stockData)
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
        .data(stockData)
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
            .tickFormat((d) => d3.timeFormat("%Y-%m-%d")(new Date(d)))
        );

    // y축 그리기(가격 눈금)
    svg
        .append("g")
        // 왼쪽 위치
        .attr("transform", `translate(${padding.left}, 0)`)
        .style("color", "#fff")
        // 왼쪽 y축
        .call(d3.axisLeft(yCandle));

    return (
        <>
            <div 
                className="flex w-full h-full"
                // React에서 직접 DOM 문자열을 삽입할 때 사용
                dangerouslySetInnerHTML={{__html: document.body.innerHTML}}
            ></div>
        </>
    )
}