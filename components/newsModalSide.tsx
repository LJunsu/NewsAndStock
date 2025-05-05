import Image from "next/image"
import { NewsModalCommentInput } from "./newsModalCommentInput";
import { NewsModalCommentList } from "./newsModalCommentList";
import { UserInfo } from "@/lib/UserInfo";

interface NewsModalSideProps {
    user: UserInfo | null
}
export const NewsModalSide = ({user}: NewsModalSideProps) => {

    return (
        <div className="flex flex-col gap-4">
            {user ?
            <div className="flex justify-between items-center">
                <span>이 기사를 추천합니다</span>

                <div className="flex items-center gap-2 cursor-pointer px-2 py-1 border-2 rounded-full">
                    <Image 
                        src={"/images/좋아요 전.png"}
                        alt="좋아요 전"
                        width={20} height={20}
                    />
                    <div>10</div>
                </div>
            </div>
            : null}


            <div>
                <NewsModalCommentInput user={user} />
                <NewsModalCommentList />
            </div>
        </div>
    );
}