import { getKorNewsKeyword } from "@/lib/NewsKeywordEnum";
import { NewsTab } from "./newsTab";
import { NewsItem } from "@/lib/NewsIteminterface";

interface NewsLineProps {
    newsList: NewsItem[],
    keyword: string,
    selectNews: (id: string) => void
}
export const NewsLine = ({newsList, keyword, selectNews}: NewsLineProps) => {
    const keywordTitle = getKorNewsKeyword(keyword);

    return (
        <div className="w-full p-8 bg-white">
            <div className="text-2xl font-bold mb-4">{keywordTitle} 뉴스</div>

            <div className="w-full flex flex-wrap gap-8">
                {newsList.map((item, index) => (
                    <NewsTab 
                        key={index} 
                        selectNews={selectNews}
                        id={item.id}
                        title={item.title} 
                        publisher={item.publisher} 
                        image_url={item.image_url} 
                    />
                ))}
            </div>
        </div>
    );
}
