
export const NewsLineLoading = () => {

    return (
        <div className="w-full p-8 bg-white">
            <div className="mb-4 w-1/6 h-8 bg-gray-300 rounded-lg animate-pulse"></div>

            <div className="w-full flex flex-wrap gap-8">
                {Array.from({length: 16}).map((_, index) => (
                    <div key={index} className="w-[calc(50%-1rem)] py-2 flex items-center gap-4">
                        <div className="w-28 h-16 bg-gray-300 rounded-lg animate-pulse" />

                        <div className="w-[calc(100%-7rem-1rem)] flex flex-col gap-4">
                            <div className="w-full h-4 bg-gray-300 rounded-lg animate-pulse" />

                            <div className="flex justify-between">
                                <div className="w-1/4 h-4 bg-gray-300 rounded-lg animate-pulse" />

                                <div className="w-1/4 h-4 bg-gray-300 rounded-lg animate-pulse" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}