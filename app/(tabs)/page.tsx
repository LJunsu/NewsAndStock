"use client";

import { NewsLineLoading } from "@/components/loading/newsLineLoading";
import { NewsLine } from "@/components/newsLine";
import { NewsModal } from "@/components/newsModal";
import { getNews } from "@/lib/getNews";
import { NewsItem } from "@/lib/NewsIteminterface";
import useHeaderKeywordStore from "@/stores/HeaderKeywordStore";
import { useEffect, useRef, useState } from "react";

export default function Home() {
    const {keyword, page, nextPage} = useHeaderKeywordStore();
    const [news, setNews] = useState<NewsItem[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        setNews(null);
    }, [keyword]);
    
    useEffect(() => {
        async function fetchGetNews() {
            if(keyword) {
                const resp = await getNews(keyword, page);
                setNews(prev => [...(prev || []), ...resp.data]);
                setIsLoading(false);
            }
        }

        fetchGetNews();
    }, [keyword, page]);

    const trigger = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const observer = new IntersectionObserver(
            async (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
                const element = entries[0];

                if(element.isIntersecting && trigger.current) {
                    observer.unobserve(trigger.current);

                    setIsLoading(true);
                    nextPage();
                }
            }, {
                threshold: 1.0
            }
        );
        
        if(trigger.current) {
            observer.observe(trigger.current);
        }

        return () => {
            observer.disconnect();
        }
    }, [news]);

    const [modal, setModal] = useState<string | null>(null);
    const selectNews = (id: string) => {
        setModal(id);
    }
    const closeModal = () => {
        setModal(null);
    }

    const [modalNews, setModalNews] = useState<NewsItem | null>(null);
    useEffect(() => {
        if(!modal || !news) return;

        const modalIndex = news.findIndex(item => {
            if(item.id === modal) return item
        });
        setModalNews(news[modalIndex]);
    }, [modal]);

    console.log(news);
    
    return (
        <div className="relative flex flex-col items-center gap-8 mb-8">
            {modal
            ? <NewsModal closeModal={closeModal} modalNews={modalNews} />
            : null}

            {news
            ? (<>
                <NewsLine newsList={news} keyword={keyword} selectNews={selectNews} />

                <div ref={trigger} className={`px-6 py-3 ${isLoading ? "bg-gray-400" : "bg-[#3F63BF]"} text-white rounded-full animate-pulse`}>
                    {isLoading ? "로딩 중..." : "내려서 더 보기"}
                </div>
            </>)
            : <NewsLineLoading />}
        </div>
    );
}