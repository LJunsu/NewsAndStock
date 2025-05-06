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
                </div>
            </div>
        </div>
    )
}