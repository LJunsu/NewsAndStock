
/** 
 * date: 해당 주식 데이터가 속한 날짜
 * 
 * symbol: 주식의 고유 식별자
 * 
 * entity_name: 주식을 대표하는 기업명
 * 
 * open: 해당 거래일의 시가 - date에 주식이 거래된 첫 가격 (원)
 * 
 * high: 해당 거래일의 최고가 - date 동안 주식이 거래된 중 가장 높은 가격 (원)
 * 
 * low: 해당 거래일의 최저가 - date 동안 주식이 거래된 중 가장 낮은 가격 (원)
 * 
 * volume: 해당 거래일에 거래된 주식의 수 - date에 거래된 수 (주)
 * 
 * change: 해당 거래일의 주식 가격 변화 - 시가와 비교한 가격 변화 (원)
 * 
 * value: 해당 거래일의 거래 총액 - 주식이 거래된 총 가치로 단가 * 거래량 (원)
 * 
 * change_percent: 주식 가격의 변화율 - date 주식 가격이 전일 대비 변경 수치 (%)
 * 
 * trading_halted: 해당 주식이 거래 정지 상태인지 - false는 주식이 정상적으로 거래, true는 거래가 일시적으로 중단
 * 
 * market_cap: 해당 기업의 시가 총액 - 주식의 전체 시장 가치로 가격 * 발행된 주식 수 (원)
 * 
 * shares_listed: 해당 기업의 상장 주식 수 (주)
 * 
 * type: 이 데이터가 나타내는 형태
 * 
 * close: 해당 거래일의 종가 - date에 주식의 마지막 거래 가격 (원)
*/
export type StockType = {
    date: string,
    symbol: string
    entity_name: string,
    open: number,
    high: number,
    low: number,
    volume: number
    change: number,
    value: number,
    change_percent: number
    trading_halted: boolean
    market_cap: number,
    shares_listed: number,
    type: string,
    close: number,
}