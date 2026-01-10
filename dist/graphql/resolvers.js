"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const services_1 = require("../services");
const auth_1 = require("../middleware/auth");
exports.resolvers = {
    Query: {
        // Auth
        me: async (_, __, context) => {
            const user = await (0, auth_1.authenticateGraphQL)(context);
            return user;
        },
        // Weddings
        userWeddings: async (_, __, context) => {
            const user = await (0, auth_1.authenticateGraphQL)(context);
            const weddingService = new services_1.WeddingService();
            return weddingService.getUserWeddings(user._id.toString());
        },
        weddings: async (_, __) => {
            const weddingService = new services_1.WeddingService();
            return weddingService.getWeddings();
        },
        wedding: async (_, { id }, context) => {
            const user = await (0, auth_1.authenticateGraphQL)(context);
            const weddingService = new services_1.WeddingService();
            return weddingService.getWeddingById(id, user);
        },
        weddingBySlug: async (_, { slug }, context) => {
            const user = await (0, auth_1.authOptionalFriendlyGraphQL)(context);
            const weddingService = new services_1.WeddingService();
            return weddingService.getWeddingBySlug(slug, user);
        },
        searchWeddings: async (_, { query }, context) => {
            const user = await (0, auth_1.authenticateGraphQL)(context);
            const weddingService = new services_1.WeddingService();
            return weddingService.searchWeddings(query, user._id.toString());
        },
        // Public
        publicWedding: async (_, { slug }) => {
            const weddingService = new services_1.WeddingService();
            return weddingService.getWeddingBySlug(slug);
        },
        // Guests
        guests: async (_, { weddingId }, context) => {
            const user = await (0, auth_1.authenticateGraphQL)(context);
            const guestService = new services_1.GuestService();
            return guestService.getWeddingGuests(weddingId, user._id.toString());
        },
        guestStats: async (_, { weddingId }, context) => {
            const user = await (0, auth_1.authenticateGraphQL)(context);
            const guestService = new services_1.GuestService();
            return guestService.getGuestStats(weddingId, user._id.toString());
        },
        // Wedding Details
        weddingDetail: async (_, { weddingId }, context) => {
            const user = await (0, auth_1.authenticateGraphQL)(context);
            const weddingDetailService = new services_1.WeddingDetailService();
            return weddingDetailService.getWeddingDetail(weddingId, user._id.toString());
        },
    },
    Mutation: {
        // Auth
        register: async (_, args) => {
            const authService = new services_1.AuthService();
            const { user, tokens } = await authService.register(args);
            return {
                user,
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
            };
        },
        login: async (_, args) => {
            const authService = new services_1.AuthService();
            const { user, tokens } = await authService.login(args);
            return {
                user,
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
            };
        },
        logout: async (_, __, context) => {
            const user = await (0, auth_1.authenticateGraphQL)(context);
            const authService = new services_1.AuthService();
            await authService.logout(user._id.toString());
            return true;
        },
        refreshToken: async (_, { refreshToken }) => {
            const authService = new services_1.AuthService();
            return authService.refreshToken(refreshToken);
        },
        // Weddings
        createWedding: async (_, args, context) => {
            const user = await (0, auth_1.authenticateGraphQL)(context);
            const weddingService = new services_1.WeddingService();
            return weddingService.createWedding(user, args);
        },
        updateWedding: async (_, { id, ...data }, context) => {
            const user = await (0, auth_1.authenticateGraphQL)(context);
            const weddingService = new services_1.WeddingService();
            return weddingService.updateWedding(id, data);
        },
        deleteWedding: async (_, { id }, context) => {
            const user = await (0, auth_1.authenticateGraphQL)(context);
            const weddingService = new services_1.WeddingService();
            return weddingService.deleteWedding(id, user);
        },
        publishWedding: async (_, { id }, context) => {
            const user = await (0, auth_1.authenticateGraphQL)(context);
            const weddingService = new services_1.WeddingService();
            return weddingService.publishWedding(id, user);
        },
        unpublishWedding: async (_, { id }, context) => {
            const user = await (0, auth_1.authenticateGraphQL)(context);
            const weddingService = new services_1.WeddingService();
            return weddingService.unpublishWedding(id, user);
        },
        // Wedding Details
        updateBride: async (_, { weddingId, bride }, context) => {
            const user = await (0, auth_1.authenticateGraphQL)(context);
            const weddingDetailService = new services_1.WeddingDetailService();
            return weddingDetailService.updateBride(weddingId, user, bride);
        },
        updateGroom: async (_, { weddingId, groom }, context) => {
            const user = await (0, auth_1.authenticateGraphQL)(context);
            const weddingDetailService = new services_1.WeddingDetailService();
            return weddingDetailService.updateGroom(weddingId, user, groom);
        },
        addLoveStory: async (_, { weddingId, story }, context) => {
            const user = await (0, auth_1.authenticateGraphQL)(context);
            const weddingDetailService = new services_1.WeddingDetailService();
            return weddingDetailService.addLoveStory(weddingId, user, story);
        },
        updateLoveStory: async (_, { weddingId, storyId, story }, context) => {
            const user = await (0, auth_1.authenticateGraphQL)(context);
            const weddingDetailService = new services_1.WeddingDetailService();
            return weddingDetailService.updateLoveStory(weddingId, user, storyId, story);
        },
        addWeddingEvent: async (_, { weddingId, event }, context) => {
            const user = await (0, auth_1.authenticateGraphQL)(context);
            const service = new services_1.WeddingDetailService();
            return service.addWeddingEvent(weddingId, user, event);
        },
        updateWeddingEvent: async (_, { weddingId, eventId, event }, context) => {
            const user = await (0, auth_1.authenticateGraphQL)(context);
            const service = new services_1.WeddingDetailService();
            return service.updateWeddingEvent(weddingId, eventId, user, event);
        },
        deleteWeddingEvent: async (_, { weddingId, eventId }, context) => {
            const user = await (0, auth_1.authenticateGraphQL)(context);
            const weddingDetailService = new services_1.WeddingDetailService();
            return weddingDetailService.deleteWeddingEvent(weddingId, eventId, user);
        },
        // Guests
        submitRSVP: async (_, { weddingId, rsvp }) => {
            const guestService = new services_1.GuestService();
            return guestService.submitRSVP(weddingId, rsvp);
        },
        // Bank Accounts
        addBankAccount: async (_, { weddingId, bankAccount }, context) => {
            const user = await (0, auth_1.authenticateGraphQL)(context);
            const bankAccountService = new services_1.BankAccountService();
            return bankAccountService.addBankAccount(weddingId, user._id.toString(), bankAccount);
        },
        // Wishes
        addWish: async (_, { weddingId, wish }) => {
            const wishService = new services_1.WishService();
            return wishService.addWish(weddingId, wish);
        },
    },
    // Field resolvers
    Wedding: {
        weddingDetail: async (parent) => {
            const weddingDetailService = new services_1.WeddingDetailService();
            return weddingDetailService.getWeddingDetail(parent.id);
        },
    },
};
//# sourceMappingURL=resolvers.js.map