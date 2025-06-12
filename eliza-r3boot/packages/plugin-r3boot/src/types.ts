export interface Tweet {
    authorUsername: string;
    createdAt: string;
    engagementsCount: number;
    impressionsCount: number;
    isQuote: boolean;
    isReply: boolean;
    likesCount: number;
    quotesCount: number;
    repliesCount: number;
    retweetsCount: number;
    smartEngagementPoints: number;
    text: string;
    matchingScore: number;
}