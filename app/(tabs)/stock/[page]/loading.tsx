
const stockPageLoading = () => {
    const todatStockMock = new Array(16).fill(0);

    return (
        <div className="flex flex-col gap-8 ">
            <div className="w-1/5 h-6 bg-gray-300 rounded-lg animate-pulse" />

            <div className="w-full flex flex-wrap gap-8">
                {todatStockMock.map((_, i) => (
                    <div 
                        key={i} 
                        className="w-[calc(50%-1rem)] h-28 p-2 flex justify-between gap-4 bg-gray-300 rounded-lg animate-pulse"
                    />
                ))}
            </div>
        </div>
    )
}

export default stockPageLoading;