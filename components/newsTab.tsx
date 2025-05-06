"use client";

import Image from "next/image"

export interface NewsTabProps {
    selectNews: (id: string) => void,
    id: string,
    title: string,
    publisher: string,
    image_url: string
}
export const NewsTab = ({selectNews, id, title, publisher, image_url}: NewsTabProps) => {

    return (
        <div onClick={() => selectNews(id)} className="w-[calc(50%-1rem)] py-2 flex items-center gap-4 cursor-pointer border-[#E5E5E5] border-b-1">
            {image_url
            ? <Image
                src={image_url} alt={title}
                width={110} height={60}
                loading="lazy"
                className="w-28 max-h-16 object-cover"
            />
            : <Image
                src="/images/default_image.png" alt={title}
                width={110} height={60}
                loading="lazy"
                className="w-28 max-h-16 object-contain"
            />}

            <div className="w-[calc(100%-7rem-1rem)] flex flex-col gap-4">
                <div className="truncate">
                    {title}
                </div>

                <div className="flex justify-between text-xs text-[#767678]">
                    <div>{publisher}</div>

                    <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 512 512" className="fill-[#767678]">
                            <path d="M313.4 32.9c26 5.2 42.9 30.5 37.7 56.5l-2.3 11.4c-5.3 26.7-15.1 52.1-28.8 75.2l144 0c26.5 0 48 21.5 48 48c0 18.5-10.5 34.6-25.9 42.6C497 275.4 504 288.9 504 304c0 23.4-16.8 42.9-38.9 47.1c4.4 7.3 6.9 15.8 6.9 24.9c0 21.3-13.9 39.4-33.1 45.6c.7 3.3 1.1 6.8 1.1 10.4c0 26.5-21.5 48-48 48l-97.5 0c-19 0-37.5-5.6-53.3-16.1l-38.5-25.7C176 420.4 160 390.4 160 358.3l0-38.3 0-48 0-24.9c0-29.2 13.3-56.7 36-75l7.4-5.9c26.5-21.2 44.6-51 51.2-84.2l2.3-11.4c5.2-26 30.5-42.9 56.5-37.7zM32 192l64 0c17.7 0 32 14.3 32 32l0 224c0 17.7-14.3 32-32 32l-64 0c-17.7 0-32-14.3-32-32L0 224c0-17.7 14.3-32 32-32z"/>
                        </svg>

                        <div>0</div>
                    </div>
                </div>
            </div>
        </div>
    )
}