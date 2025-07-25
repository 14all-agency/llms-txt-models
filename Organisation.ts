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

export const ScanStatusResult = z.union([
  z.literal("SUCCESS"),
  z.literal("WARNING"),
  z.literal("ERROR"),
]).optional().nullable();

export const ScanResult = z.object({
  details: z.string().nullable().optional().describe("Describes issues or warnings etc from scan results"),
  updatedAt: z.date().nullable().optional(),
  status: ScanStatusResult,
}).optional().nullable().describe("A scanned resource e.g. social media or reviews, null infers not scanned");

export type Scan = z.infer<typeof ScanResult>;

export const LlmsSettingsResult = z.object({
  url: z.string().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
  prompt: z.string().nullable().optional().describe("User can add extra text"),
  productsEnabled: z.boolean().nullable().optional(),
  collectionsEnabled: z.boolean().nullable().optional(),
  articlesEnabled: z.boolean().nullable().optional(),
  pagesEnabled: z.boolean().nullable().optional(),
}).optional().nullable().describe("Null infers not enabled");

export const GithubSettingsResult = z.object({
  url: z.string().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
}).optional().nullable().describe("Null infers not enabled");

export const OrganisationResult = z.object({
  _id: z.instanceof(ObjectId),
  country: z.string().optional().nullable().describe("country of origin"),
  contactEmail: z.string().optional().nullable().describe("The email to contact for this org"),
  locale: z.string().optional().nullable().describe("shop locale / language"),
  reviewed: z.boolean().optional().nullable().describe("whether or not store has engaged with review element"),
  rating: z.number().optional().nullable().describe("rating score"),
  plan: z.string().optional().nullable().describe("shopify plan"),
  website: z.string().optional().nullable().describe("website URL"),
  settingsLastSynced: z.date().nullable().optional(),
  createdAt: z.date().nullable().optional(),
  shopifyConnection: ShopifyConnectionResult,
  shopifyConnectionStatus: ShopifyStatusResult,
  name: z.string().optional().nullable().describe("Org/brand name"),
  socialMediaScan: ScanResult,
  homepageSchemaScan: ScanResult,
  reviewSitesScan: ScanResult,
  llmsSettings: LlmsSettingsResult,
  githubSettings: GithubSettingsResult,
  onboarded: z.boolean().optional().nullable().describe("Whether org has completed onboarding"),
  queriesAddedThisMonth: z.number().optional().nullable().describe("We track total queries added to prevent abuse"),
  topics: z.array(z.string()).optional().nullable().describe("Suggested topics"),
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
  locale: OrganisationResult.shape.locale,
  reviewed: OrganisationResult.shape.reviewed,
  rating: OrganisationResult.shape.rating,
  plan: OrganisationResult.shape.plan,
  website: OrganisationResult.shape.website,
  shopifyConnection: OrganisationResult.shape.shopifyConnection,
  shopifyConnectionStatus: OrganisationResult.shape.shopifyConnectionStatus,
  name: OrganisationResult.shape.name,
  socialMediaScan: OrganisationResult.shape.socialMediaScan,
  homepageSchemaScan: OrganisationResult.shape.homepageSchemaScan,
  reviewSitesScan: OrganisationResult.shape.reviewSitesScan,
  llmsSettings: OrganisationResult.shape.llmsSettings,
  githubSettings: OrganisationResult.shape.githubSettings,
  onboarded: OrganisationResult.shape.onboarded,
  queriesAddedThisMonth: OrganisationResult.shape.queriesAddedThisMonth,
  topics: OrganisationResult.shape.topics,
  createdAt: OrganisationResult.shape.createdAt,
  settingsLastSynced: OrganisationResult.shape.settingsLastSynced,
  shopifySite: z.string().nullable().optional(),
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
      contactEmail: entity.contactEmail || null,
      locale: entity.locale || null,
      reviewed: entity.reviewed || null,
      rating: entity.rating || null,
      plan: entity.plan || null,
      website: entity.website || null,
      name: entity.name || null,
      socialMediaScan: entity.socialMediaScan || null,
      homepageSchemaScan: entity.homepageSchemaScan || null,
      reviewSitesScan: entity.reviewSitesScan || null,
      llmsSettings: entity.llmsSettings || null,
      githubSettings: entity.githubSettings || null,
      onboarded: entity.onboarded || false,
      queriesAddedThisMonth: entity.queriesAddedThisMonth || 0,
      topics: entity.topics || [],
      createdAt: new Date(entity.createdAt || new Date()),
      settingsLastSynced: entity.settingsLastSynced ? new Date(entity.settingsLastSynced || new Date()) : null,
      shopifyConnection: includeCredentials ? (entity.shopifyConnection || null) : null,
      shopifyConnectionStatus: entity.shopifyConnectionStatus || "INACTIVE",
      shopifySite: entity?.shopifyConnection?.domain || null,
      billingPlanStatus: entity.billingPlanStatus || "INACTIVE",
      billingSubscriptionId: entity.billingSubscriptionId || null,
      billingPlanHandle: entity.billingPlanHandle || null,
      billingUpdatedAt: entity.billingUpdatedAt ? new Date(entity.billingUpdatedAt || new Date()) : null,
    };
    return OrganisationModelSchema.parse(obj);
  },
};