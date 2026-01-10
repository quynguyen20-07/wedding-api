import {
  AuthService,
  BankAccountService,
  GuestService,
  WeddingDetailService,
  WeddingService,
  WishService,
} from "../services";
import {
  authenticateGraphQL,
  authOptionalFriendlyGraphQL,
} from "../middleware/auth";
import { IUser } from "../models/User";

export const resolvers = {
  Query: {
    // Auth
    me: async (_: any, __: any, context: any) => {
      const user = await authenticateGraphQL(context);
      return user;
    },

    // Weddings
    userWeddings: async (_: any, __: any, context: any) => {
      const user: IUser = await authenticateGraphQL(context);
      const weddingService = new WeddingService();
      return weddingService.getUserWeddings(user._id.toString());
    },

    weddings: async (_: any, __: any) => {
      const weddingService = new WeddingService();
      return weddingService.getWeddings();
    },

    wedding: async (_: any, { id }: { id: string }, context: any) => {
      const user = await authenticateGraphQL(context);
      const weddingService = new WeddingService();
      return weddingService.getWeddingById(id, user);
    },

    weddingBySlug: async (_: any, { slug }: { slug: string }, context: any) => {
      const user = await authOptionalFriendlyGraphQL(context);
      const weddingService = new WeddingService();
      return weddingService.getWeddingBySlug(slug, user);
    },

    searchWeddings: async (
      _: any,
      { query }: { query: string },
      context: any
    ) => {
      const user = await authenticateGraphQL(context);
      const weddingService = new WeddingService();
      return weddingService.searchWeddings(query, user._id.toString());
    },

    // Public
    publicWedding: async (_: any, { slug }: { slug: string }) => {
      const weddingService = new WeddingService();
      return weddingService.getWeddingBySlug(slug);
    },

    // Guests
    guests: async (
      _: any,
      { weddingId }: { weddingId: string },
      context: any
    ) => {
      const user = await authenticateGraphQL(context);
      const guestService = new GuestService();
      return guestService.getWeddingGuests(weddingId, user._id.toString());
    },

    guestStats: async (
      _: any,
      { weddingId }: { weddingId: string },
      context: any
    ) => {
      const user = await authenticateGraphQL(context);
      const guestService = new GuestService();
      return guestService.getGuestStats(weddingId, user._id.toString());
    },

    // Wedding Details
    weddingDetail: async (
      _: any,
      { weddingId }: { weddingId: string },
      context: any
    ) => {
      const user = await authenticateGraphQL(context);
      const weddingDetailService = new WeddingDetailService();
      return weddingDetailService.getWeddingDetail(
        weddingId,
        user._id.toString()
      );
    },
  },

  Mutation: {
    // Auth
    register: async (_: any, args: any) => {
      const authService = new AuthService();
      const { user, tokens } = await authService.register(args);

      return {
        user,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
    },

    login: async (_: any, args: any) => {
      const authService = new AuthService();
      const { user, tokens } = await authService.login(args);

      return {
        user,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
    },

    logout: async (_: any, __: any, context: any) => {
      const user = await authenticateGraphQL(context);
      const authService = new AuthService();
      await authService.logout(user._id.toString());
      return true;
    },

    refreshToken: async (
      _: any,
      { refreshToken }: { refreshToken: string }
    ) => {
      const authService = new AuthService();
      return authService.refreshToken(refreshToken);
    },

    // Weddings
    createWedding: async (_: any, args: any, context: any) => {
      const user = await authenticateGraphQL(context);
      const weddingService = new WeddingService();
      return weddingService.createWedding(user, args);
    },

    updateWedding: async (_: any, { id, ...data }: any, context: any) => {
      const user = await authenticateGraphQL(context);
      const weddingService = new WeddingService();

      return weddingService.updateWedding(id, data);
    },

    deleteWedding: async (_: any, { id }: { id: string }, context: any) => {
      const user = await authenticateGraphQL(context);
      const weddingService = new WeddingService();
      return weddingService.deleteWedding(id, user);
    },

    publishWedding: async (_: any, { id }: { id: string }, context: any) => {
      const user = await authenticateGraphQL(context);
      const weddingService = new WeddingService();
      return weddingService.publishWedding(id, user);
    },

    unpublishWedding: async (_: any, { id }: { id: string }, context: any) => {
      const user = await authenticateGraphQL(context);
      const weddingService = new WeddingService();
      return weddingService.unpublishWedding(id, user);
    },

    // Wedding Details
    updateBride: async (_: any, { weddingId, bride }: any, context: any) => {
      const user = await authenticateGraphQL(context);
      const weddingDetailService = new WeddingDetailService();
      return weddingDetailService.updateBride(weddingId, user, bride);
    },

    updateGroom: async (_: any, { weddingId, groom }: any, context: any) => {
      const user = await authenticateGraphQL(context);
      const weddingDetailService = new WeddingDetailService();
      return weddingDetailService.updateGroom(weddingId, user, groom);
    },

    addLoveStory: async (_: any, { weddingId, story }: any, context: any) => {
      const user = await authenticateGraphQL(context);
      const weddingDetailService = new WeddingDetailService();
      return weddingDetailService.addLoveStory(weddingId, user, story);
    },

    updateLoveStory: async (
      _: any,
      { weddingId, storyId, story }: any,
      context: any
    ) => {
      const user = await authenticateGraphQL(context);
      const weddingDetailService = new WeddingDetailService();

      return weddingDetailService.updateLoveStory(
        weddingId,
        user,
        storyId,
        story
      );
    },

    addWeddingEvent: async (
      _: any,
      { weddingId, event }: any,
      context: any
    ) => {
      const user = await authenticateGraphQL(context);
      const service = new WeddingDetailService();

      return service.addWeddingEvent(weddingId, user, event);
    },

    updateWeddingEvent: async (
      _: any,
      { weddingId, eventId, event }: any,
      context: any
    ) => {
      const user = await authenticateGraphQL(context);
      const service = new WeddingDetailService();

      return service.updateWeddingEvent(weddingId, eventId, user, event);
    },

    deleteWeddingEvent: async (
      _: any,
      { weddingId, eventId }: { weddingId: string; eventId: string },
      context: any
    ) => {
      const user = await authenticateGraphQL(context);
      const weddingDetailService = new WeddingDetailService();

      return weddingDetailService.deleteWeddingEvent(weddingId, eventId, user);
    },

    // Guests
    submitRSVP: async (_: any, { weddingId, rsvp }: any) => {
      const guestService = new GuestService();
      return guestService.submitRSVP(weddingId, rsvp);
    },

    // Bank Accounts
    addBankAccount: async (
      _: any,
      { weddingId, bankAccount }: any,
      context: any
    ) => {
      const user = await authenticateGraphQL(context);
      const bankAccountService = new BankAccountService();
      return bankAccountService.addBankAccount(
        weddingId,
        user._id.toString(),
        bankAccount
      );
    },

    // Wishes
    addWish: async (_: any, { weddingId, wish }: any) => {
      const wishService = new WishService();
      return wishService.addWish(weddingId, wish);
    },
  },

  // Field resolvers
  Wedding: {
    weddingDetail: async (parent: any) => {
      const weddingDetailService = new WeddingDetailService();
      return weddingDetailService.getWeddingDetail(parent.id);
    },
  },
};
