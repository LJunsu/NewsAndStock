"use client";

import { useRouter } from "next/navigation";

export const StockPagination = ({nowPage, size}: {nowPage: number, size: number}) => {
    const router = useRouter();

    const pageList: number[] = new Array(nowPage).fill(0).map((cur, i) => i + 1);

    const pageListCut: number[] = pageList.slice(-size);

    const StockPage = (page: number) => {
        router.push(`/stock/${page}`);
    }
    
    return (
        <div className="w-full flex justify-center gap-4 pt-4 pb-8">
            {pageListCut[0] !== 1 && <div className="cursor-pointer" onClick={() => StockPage(1)}>&lt; 처음</div>}

            {pageListCut.map((p) => (
                <div
                    key={p}
                    className={`${p === nowPage && "text-[#3F63BF] border-b-1 border-[#3F63BF]"} cursor-pointer`} 
                    onClick={() => StockPage(p)}
                >{p}</div>
            ))}
            <div className="cursor-pointer" onClick={() => StockPage(nowPage + 1)}>다음 &gt;</div>
        </div>
    )
}