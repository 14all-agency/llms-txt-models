import { ObjectId } from 'bson';
import { z } from "zod";
import { OrganisationModel, OrganisationModelSchema } from './Organisation';

export const PlatformResult = z.union([
  z.literal("ChatGPT"),
  z.literal("Gemini"),
  z.literal("Perplexity"),
]).optional().nullable().describe("The platform the prompt was conducted on");

export type Platform = z.infer<typeof PlatformResult>;

export const CitationResult = z.object({
  brandName: z.string().nullable().optional().describe("The name of the cited brand, if applicable"),
  brandDomain: z.string().nullable().optional().describe("The name of the cited brand, if applicable"),
  link: z.string().nullable().optional().describe("The URL that was cited, if applicable"),
  linkText: z.string().nullable().optional().describe("The label/text that was linked"),
  position: z.number().nullable().optional().describe("The 0th index of where the citation appears relative to other citations (e.g. 2nd is 1)")
}).nullable().optional().describe("A brand mention or link from the response");

export type Citation = z.infer<typeof CitationResult>;

export const QueryResult = z.object({
  _id: z.instanceof(ObjectId),
  prompt: z.string().nullable().optional().describe("The typed in prompt to the LLM"),
  trackingOrgs: z.array(z.instanceof(ObjectId)).nullable().optional().describe("The orgs tracking this query"),
  platform: PlatformResult,
  citations: z.array(CitationResult).nullable().optional(),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional().describe("When the query was last scanned"),
});

export type QueryResultEntity = z.infer<typeof QueryResult>;

export const QueryModelSchema = z.object({
  id: z.string(),
  prompt: QueryResult.shape.prompt,
  trackingOrgs: z.array(z.union([
    z.string(),
    OrganisationModelSchema,
  ]),),
  platform: QueryResult.shape.platform,
  citations: QueryResult.shape.citations,
  createdAt: QueryResult.shape.createdAt,
  updatedAt: QueryResult.shape.updatedAt,
});

export type QueryModel = z.infer<typeof QueryModelSchema>;

export const QueryModel = {
  convertFromEntity(entity: QueryResultEntity): QueryModel {
    const obj: QueryModel = {
      id: entity._id.toHexString(),
      prompt: entity.prompt || null,
      // @ts-ignore
      trackingOrgs: entity?.trackingOrgs?.map((x) => ObjectId.isValid(x) ? x.toHexString() : OrganisationModel.convertFromEntity(x)) || [],
      platform: entity.platform || null,
      citations: entity.citations || [],
      ...entity.createdAt && { createdAt: new Date(entity.createdAt || new Date()) },
      ...entity.updatedAt && { updatedAt: new Date(entity.updatedAt || new Date()) },
    };
    return QueryModelSchema.parse(obj);
  },
};