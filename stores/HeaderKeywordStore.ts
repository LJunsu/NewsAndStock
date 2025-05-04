import { create } from "zustand";

interface KeywordState {
    keyword: string;
    keywordClick: (select: string) => void;
    page: number;
    nextPage: () => void;
}
const useHeaderKeywordStore = create<KeywordState>((set) => ({
    keyword: "politics",
    keywordClick: (select: string) => {
        set(() => ({keyword: select}));
        set(() => ({page: 1}));
    },
    page: 1,
    nextPage: () => set((state) => ({page: state.page + 1})),
}));

export default useHeaderKeywordStore;