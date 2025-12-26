export declare const resolvers: {
    Query: {
        me: (_: any, __: any, context: any) => Promise<import("mongoose").Document<unknown, {}, import("..").IUser> & import("..").IUser & {
            _id: import("mongoose").Types.ObjectId;
        }>;
        weddings: (_: any, __: any, context: any) => Promise<import("..").IWedding[]>;
        wedding: (_: any, { id }: {
            id: string;
        }, context: any) => Promise<import("..").IWedding | null>;
        weddingBySlug: (_: any, { slug }: {
            slug: string;
        }, context: any) => Promise<import("..").IWedding | null>;
        searchWeddings: (_: any, { query }: {
            query: string;
        }, context: any) => Promise<import("..").IWedding[]>;
        publicWedding: (_: any, { slug }: {
            slug: string;
        }) => Promise<import("..").IWedding | null>;
        guests: (_: any, { weddingId }: {
            weddingId: string;
        }, context: any) => Promise<import("..").IGuest[]>;
        guestStats: (_: any, { weddingId }: {
            weddingId: string;
        }, context: any) => Promise<import("..").GuestStats>;
        weddingDetail: (_: any, { weddingId }: {
            weddingId: string;
        }, context: any) => Promise<import("mongoose").Document<unknown, {}, import("..").IWeddingDetail> & import("..").IWeddingDetail & {
            _id: import("mongoose").Types.ObjectId;
        }>;
    };
    Mutation: {
        register: (_: any, args: any) => Promise<{
            user: import("..").IUser;
            tokens: import("..").AuthTokens;
        }>;
        login: (_: any, args: any) => Promise<{
            user: import("..").IUser;
            tokens: import("..").AuthTokens;
        }>;
        logout: (_: any, __: any, context: any) => Promise<boolean>;
        refreshToken: (_: any, { refreshToken }: {
            refreshToken: string;
        }) => Promise<import("..").AuthTokens>;
        createWedding: (_: any, args: any, context: any) => Promise<import("..").IWedding>;
        updateWedding: (_: any, { id, ...data }: any, context: any) => Promise<import("..").IWedding | null>;
        deleteWedding: (_: any, { id }: {
            id: string;
        }, context: any) => Promise<import("..").IWedding | null>;
        publishWedding: (_: any, { id }: {
            id: string;
        }, context: any) => Promise<import("..").IWedding | null>;
        unpublishWedding: (_: any, { id }: {
            id: string;
        }, context: any) => Promise<import("..").IWedding | null>;
        updateBride: (_: any, { weddingId, bride }: any, context: any) => Promise<import("mongoose").Document<unknown, {}, import("..").IWeddingDetail> & import("..").IWeddingDetail & {
            _id: import("mongoose").Types.ObjectId;
        }>;
        updateGroom: (_: any, { weddingId, groom }: any, context: any) => Promise<import("mongoose").Document<unknown, {}, import("..").IWeddingDetail> & import("..").IWeddingDetail & {
            _id: import("mongoose").Types.ObjectId;
        }>;
        addLoveStory: (_: any, { weddingId, story }: any, context: any) => Promise<import("mongoose").Document<unknown, {}, import("..").IWeddingDetail> & import("..").IWeddingDetail & {
            _id: import("mongoose").Types.ObjectId;
        }>;
        addWeddingEvent: (_: any, { weddingId, event }: any, context: any) => Promise<import("mongoose").Document<unknown, {}, import("..").IWeddingDetail> & import("..").IWeddingDetail & {
            _id: import("mongoose").Types.ObjectId;
        }>;
        submitRSVP: (_: any, { weddingId, rsvp }: any) => Promise<import("..").IGuest>;
        addBankAccount: (_: any, { weddingId, bankAccount }: any, context: any) => Promise<import("..").IBankAccount>;
        addWish: (_: any, { weddingId, wish }: any) => Promise<import("..").IWish>;
    };
    Wedding: {
        weddingDetail: (parent: any) => Promise<import("mongoose").Document<unknown, {}, import("..").IWeddingDetail> & import("..").IWeddingDetail & {
            _id: import("mongoose").Types.ObjectId;
        }>;
    };
};
//# sourceMappingURL=resolvers.d.ts.map