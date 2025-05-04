import { NewsItem } from "@/lib/NewsIteminterface";
import { useEffect } from "react";

interface NewsModalProps {
    closeModal: () => void;
    modalNews: NewsItem | null
}
export const NewsModal = ({closeModal, modalNews}: NewsModalProps) => {
    console.log(modalNews);

    useEffect(() => {
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    return (
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-screen h-screen bg-[#00000050]">
            <div className="relative w-3/4 xl:w-1/2 min-h-3/4 max-h-[90vh] overflow-auto p-4 pr-8 bg-white rounded-lg">
                <div className="absolute top-4 right-4 cursor-pointer *:transform *:duration-200 hover:*:border-[#3F63BF] hover:*:animate-pulse" onClick={closeModal}>
                    <div className="absolute top-4 right-0 border-b-2 w-5 rotate-130" />
                    <div className="absolute top-4 right-0 border-b-2 w-5 rotate-230" />
                </div>

                {modalNews
                ? (
                    <div className="flex flex-col gap-8 w-full h-full mt-10">
                        <div className="flex flex-col gap-4 pb-4 border-b-1 border-[#E5E5E5]">
                            <div className="text-xs font-bold">
                                {modalNews.publisher}
                            </div>

                            <div className="text-3xl font-bold">
                                {modalNews.title}
                            </div>

                            <div className="flex justify-between text-xs text-[#767678]">
                                <div>{modalNews.author} 기자</div>
                                <div>{modalNews.published_at.replace("T", " ")}</div>
                            </div>
                        </div>

                        <iframe
                            src={modalNews.content_url}
                            width="100%" height="600"
                            allowFullScreen
                            className="rounded-xl shadow-lg"
                        >
                            {modalNews.summary}
                        </iframe>
                    
                        <div>
                            좋아요 댓글 기능 구현하고, CORS 문제도 보완
                        </div>
                    </div>
                )
                : "loading..."}
            </div>
        </div>
    );
}