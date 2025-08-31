import { ObjectId } from 'bson';
import { z } from "zod";

export const ShopifyConnectionResult = z.object({
  apiKey: z.string(),
  domain: z.string(),
  scopes: z.string().nullable().optional().describe("The scopes approved (comma seperated string)")
}).optional().nullable();

export type ShopifyConnection = z.infer<typeof ShopifyConnectionResult>;

export const ShopifyStatusResult = z.union([
  z.literal("ACTIVE"),
  z.literal("PENDING"),
  z.literal("INACTIVE"),
  z.literal("ERROR"),
]).optional().nullable();

export const LlmsSettingsResult = z.object({
  // Detail overrides
  storeName: z.string().nullable().optional().describe("User can override default"),
  storeDescription: z.string().nullable().optional().describe("User can override default"),
  storeEmail: z.string().nullable().optional().describe("User can override default"),
  storePhone: z.string().nullable().optional().describe("User can override default"),
  storeAddress: z.string().nullable().optional().describe("User can override default"),
  // Custom stuff
  customIntro: z.string().nullable().optional().describe("Intro"),
  customFooter: z.string().nullable().optional().describe("Footer"),
  customSections: z.string().nullable().optional().describe("multiline sections at bottom"),
  // Page inclusions
  includeBlogs: z.boolean().nullable().optional().describe("Whether to include blogs and articles"),
  includePages: z.boolean().nullable().optional().describe("Whether to include pages"),
  includeProducts: z.boolean().nullable().optional().describe("Whether to include products"),
  includeCollections: z.boolean().nullable().optional().describe("Whether to include collections"),
  // Policy Toggles
  includePrivacyPolicy: z.boolean().nullable().optional().describe("Whether to include privacy policy"),
  includeRefundPolicy: z.boolean().nullable().optional().describe("Whether to include refund policy"),
  includeShippingPolicy: z.boolean().nullable().optional().describe("Whether to include shipping policy"),
  includeTermsPolicy: z.boolean().nullable().optional().describe("Whether to include terms of service policy"),
  includeContactPolicy: z.boolean().nullable().optional().describe("Whether to include contact details policy link"),
  // Toggles
  includeContactDetails: z.boolean().nullable().optional().describe("Whether to include phone, email, etc"),
  includeStoreDetails: z.boolean().nullable().optional().describe("Whether to show store timezone, currency, locale, and created date"),
  includeProductPricing: z.boolean().nullable().optional().describe("Whether to show product pricing"),
  includeCollectionMetadata: z.boolean().nullable().optional().describe("Whether to show collection total products"),
  includeProductMetadata: z.boolean().nullable().optional().describe("Whether to show product page vendor, type, availability, tags, variants, images"),
  includeBlogMetadata: z.boolean().nullable().optional().describe("Whether to show blog tags, author, total blog posts"),
  excludeOutOfStockProducts: z.boolean().nullable().optional().describe("Whether to exclude out of stock products from file"),
  // Indexing Settings
  indexChatGpt: z.boolean().nullable().optional().describe("Whether to submit our links to chatgpt"),
  indexGemini: z.boolean().nullable().optional().describe("Whether to submit our links to gemini"),
  indexPerplexity: z.boolean().nullable().optional().describe("Whether to submit our links to perplexity"),
  indexGrok: z.boolean().nullable().optional().describe("Whether to submit our links to grok"),
  indexCopilot: z.boolean().nullable().optional().describe("Whether to submit our links to copilot"),
  indexSearchEngines: z.boolean().nullable().optional().describe("Whether to submit our links to search engines"),
  // Advanced Settings
  includeGenerationTimestamp: z.boolean().nullable().optional().describe("Whether to show when was last generated/updated"),
  includeSitemap: z.boolean().nullable().optional().describe("Whether to link sitemap"),
  includeRobotsTxt: z.boolean().nullable().optional().describe("Whether to link robots.txt"),
  includePageTimestamp: z.boolean().nullable().optional().describe("Whether to show when a page was last updated"),
  includeSEO: z.boolean().nullable().optional().describe("Whether to show seo titles and descriptions"),
  urlExclusions: z.string().nullable().optional().describe("multiline or comma-seperated list of urls to exclude e.g. products"),
  marketsEnabled: z.boolean().nullable().optional().describe("Whether to have market specific LLMS.txt files"),
  githubEnabled: z.boolean().nullable().optional().describe("Whether to sync to github"),
}).optional().nullable().describe("Null infers not onboarded/saved");

export type LlmsSettings = z.infer<typeof LlmsSettingsResult>;

export const OrganisationResult = z.object({
  _id: z.instanceof(ObjectId),
  country: z.string().optional().nullable().describe("country of origin"),
  contactEmail: z.string().optional().nullable().describe("The email to contact for this org"),
  locale: z.string().optional().nullable().describe("shop locale / language"),
  passwordProtected: z.boolean().optional().nullable().describe("whether or not store is password protected"),
  reviewed: z.boolean().optional().nullable().describe("whether or not store has engaged with review element"),
  reviewSurface: z.string().optional().nullable().describe("where they left a review"),
  rating: z.number().optional().nullable().describe("rating score"),
  plan: z.string().optional().nullable().describe("shopify plan"),
  website: z.string().optional().nullable().describe("website URL"),
  settingsLastSynced: z.date().nullable().optional(),
  createdAt: z.date().nullable().optional(),
  shopifyConnection: ShopifyConnectionResult,
  shopifyConnectionStatus: ShopifyStatusResult,
  name: z.string().optional().nullable().describe("Org/brand name"),
  currency: z.string().optional().nullable().describe("shop base currency code"),
  timezone: z.string().optional().nullable().describe("shop timezone"),
  shopCreatedAt: z.string().optional().nullable().describe("shop created at"),
  // Custom
  llmsSettings: LlmsSettingsResult,
  // Billing stuff
  billingPlanStatus: z.union([
    z.literal("INACTIVE"),
    z.literal("ACTIVE"),
  ]).optional().nullable(),
  billingSubscriptionId: z.string().optional().nullable(),
  billingPlanHandle: z.string().optional().nullable(),
  billingUpdatedAt: z.date().nullable().optional(),
});

export type OrganisationResultEntity = z.infer<typeof OrganisationResult>;

export const OrganisationModelSchema = z.object({
  id: z.string(),
  country: OrganisationResult.shape.country,
  contactEmail: OrganisationResult.shape.contactEmail,
  passwordProtected: OrganisationResult.shape.passwordProtected,
  locale: OrganisationResult.shape.locale,
  reviewed: OrganisationResult.shape.reviewed,
  reviewSurface: OrganisationResult.shape.reviewSurface,
  rating: OrganisationResult.shape.rating,
  plan: OrganisationResult.shape.plan,
  website: OrganisationResult.shape.website,
  shopifyConnection: OrganisationResult.shape.shopifyConnection,
  shopifyConnectionStatus: OrganisationResult.shape.shopifyConnectionStatus,
  name: OrganisationResult.shape.name,
  shopCreatedAt: OrganisationResult.shape.shopCreatedAt,
  timezone: OrganisationResult.shape.timezone,
  currency: OrganisationResult.shape.currency,
  createdAt: OrganisationResult.shape.createdAt,
  settingsLastSynced: OrganisationResult.shape.settingsLastSynced,
  shopifySite: z.string().nullable().optional(),
  // custom
  llmsSettings: OrganisationResult.shape.llmsSettings,
  // billing
  billingPlanStatus: OrganisationResult.shape.billingPlanStatus,
  billingSubscriptionId: OrganisationResult.shape.billingSubscriptionId,
  billingPlanHandle: OrganisationResult.shape.billingPlanHandle,
  billingUpdatedAt: OrganisationResult.shape.billingUpdatedAt,
});

export type OrganisationModel = z.infer<typeof OrganisationModelSchema>;

export const OrganisationModel = {
  convertFromEntity(entity: OrganisationResultEntity, includeCredentials = false): OrganisationModel {
    if(includeCredentials) {
      console.log("includeCredentials IS TRUE")
    }

    const obj: OrganisationModel = {
      id: entity._id.toHexString(),
      country: entity.country || null,
      passwordProtected: entity.passwordProtected || null,
      contactEmail: entity.contactEmail || null,
      locale: entity.locale || null,
      reviewed: entity.reviewed || null,
      reviewSurface: entity.reviewSurface || null,
      rating: entity.rating || null,
      plan: entity.plan || null,
      website: entity.website || null,
      name: entity.name || null,
      timezone: entity.timezone || null,
      shopCreatedAt: entity.shopCreatedAt || null,
      currency: entity.currency || null,
      createdAt: new Date(entity.createdAt || new Date()),
      settingsLastSynced: entity.settingsLastSynced ? new Date(entity.settingsLastSynced || new Date()) : null,
      shopifyConnection: includeCredentials ? (entity.shopifyConnection || null) : null,
      shopifyConnectionStatus: entity.shopifyConnectionStatus || "INACTIVE",
      shopifySite: entity?.shopifyConnection?.domain || null,
      // custom
      llmsSettings: entity.llmsSettings || null,
      // billing
      billingPlanStatus: entity.billingPlanStatus || "INACTIVE",
      billingSubscriptionId: entity.billingSubscriptionId || null,
      billingPlanHandle: entity.billingPlanHandle || null,
      billingUpdatedAt: entity.billingUpdatedAt ? new Date(entity.billingUpdatedAt || new Date()) : null,
    };
    return OrganisationModelSchema.parse(obj);
  },
};