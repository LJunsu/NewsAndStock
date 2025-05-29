import { useEffect, useState } from "react";
import { NewsItem } from "./NewsIteminterface";


export const useModal = (news: NewsItem[]) => {
    const [modal, setModal] = useState<string | null>(null);
    const [modalNews, setModalNews] = useState<NewsItem | null>(null);

    useEffect(() => {
        if(!modal || !news) return;

        const modalIndex = news.findIndex(item => {
            if(item.id === modal) return item
        });
        setModalNews(news[modalIndex]);
    }, [modal, news]);

    const selectNews = (id: string) => {
        setModal(id);

        fetch(`/api/news/selectNews?id=${id}`)
            .then((res) => res.json())
            .then((data) => {
                console.log(data.message);
            });
    }
    const closeModal = () => {
        setModal(null);
    }

    return {
        modal,
        modalNews,
        selectNews,
        closeModal
    }
}