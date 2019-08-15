export interface EditBlockConfig {
    mainAreaId: string;
    moreAreaId: string;
    textAreaId: string;
    getContent: () => string;
    setContent: (content: string) => {};
}
