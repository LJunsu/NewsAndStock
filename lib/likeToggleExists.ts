
export const likeCheckNowUser = async (newsId: string, email: string) => {
    return await fetch(`/api/news/likeCheck`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({id: newsId, email: email})
    })
    .then((res) => res.json())
    .then((data) => {
        if(data.ok) return data.likeOn;
        else return false;
    })
    .catch((err) => {
        console.error(err);
        return false;
    })
}