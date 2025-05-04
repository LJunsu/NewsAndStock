export enum NewsKeyword {
    politics = "정치",
    economy = "경제",
    society = "사회",
    culture = "문화",
    world = "세계",
    tech = "기술",
    entertainment = "엔터테이먼트",
    opinion = "의견"
}

const keywordMap: Record<string, NewsKeyword> = {
    politics: NewsKeyword.politics,
    economy: NewsKeyword.economy,
    society: NewsKeyword.society,
    culture: NewsKeyword.culture,
    world: NewsKeyword.world,
    tech: NewsKeyword.tech,
    entertainment: NewsKeyword.entertainment,
    opinion: NewsKeyword.opinion
}

export function getKorNewsKeyword(keyword: string): NewsKeyword | undefined {
    return keywordMap[keyword];
}