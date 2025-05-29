"use client";

import { getSymbolNews } from "@/lib/getSymbolNews";
import { NewsItem } from "@/lib/NewsIteminterface";
import { NewsTab } from "./newsTab";
import { useEffect, useState } from "react";
import { useModal } from "@/lib/useModal";
import { NewsModal } from "./newsModal";

interface SymbolNewsProp {
    symbol: string
}
export const SymbolNews = ({symbol}: SymbolNewsProp) => {
    const [symbolNews, SetSymbolNews] = useState<NewsItem[]>([]);
    const { modal, modalNews, selectNews, closeModal } = useModal(symbolNews!);

    useEffect(() => {
        const symbolNewsFn = async () => {
            const symbolNewsGet = await getSymbolNews(symbol);
            SetSymbolNews(symbolNewsGet);
        }

        symbolNewsFn();
    }, []);

    if(symbolNews.length <= 0) return
    else return (
        <div className="w-full p-8 bg-white">
            {modal
            ? <NewsModal closeModal={closeModal} modalNews={modalNews} />
            : null}

            <div className="text-2xl font-bold mb-4">관련 뉴스</div>

            <div className="w-full flex flex-wrap gap-8">
                {symbolNews.map((item, index) => (
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
    )
}