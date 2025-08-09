import { ObjectId } from 'bson';
import { z } from "zod";
import { OrganisationModel, OrganisationModelSchema, OrganisationResult } from './Organisation';

export const LlmsResult = z.object({
  _id: z.instanceof(ObjectId),
  org: z.union([
    z.instanceof(ObjectId),
    OrganisationResult,
  ]).describe("The owner of this document"),
  domain: z.string().nullable().optional().describe("The website domain (for faster access)"),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional().describe("When the file settings were last changed"),
  generationRequestedAt: z.date().nullable().optional().describe("When the file regen was requested, blank once completed"),
  lastHit: z.date().nullable().optional().describe("Date of last tracked hit"),
  totalHits: z.number().nullable().optional().describe("Total amount of tracked hits to file"),
  totalLinks: z.number().nullable().optional().describe("Total amount of links in the file"),
  generatedFile: z.string().nullable().optional().describe("The generated file to return"),
  githubLink: z.string().nullable().optional().describe("The github link (if enabled)"),
});

export type LlmsResultEntity = z.infer<typeof LlmsResult>;

export const LlmsModelSchema = z.object({
  id: z.string(),
  org: z.union([
    z.string(),
    OrganisationModelSchema,
  ]),
  createdAt: LlmsResult.shape.createdAt,
  updatedAt: LlmsResult.shape.updatedAt,
  generationRequestedAt: LlmsResult.shape.generationRequestedAt,
  lastHit: LlmsResult.shape.lastHit,
  totalHits: LlmsResult.shape.totalHits,
  totalLinks: LlmsResult.shape.totalLinks,
  domain: LlmsResult.shape.domain,
  generatedFile: LlmsResult.shape.generatedFile,
  githubLink: LlmsResult.shape.githubLink,
});

export type LlmsModel = z.infer<typeof LlmsModelSchema>;

export const LlmsModel = {
  convertFromEntity(entity: LlmsResultEntity): LlmsModel {
    const obj: LlmsModel = {
      id: entity._id.toHexString(),
      // @ts-ignore
      org: ObjectId.isValid(entity.org) ? entity.org.toHexString() : OrganisationModel.convertFromEntity(entity.org, includeCredentials),
      ...entity.createdAt && { createdAt: new Date(entity.createdAt || new Date()) },
      ...entity.updatedAt && { updatedAt: new Date(entity.updatedAt || new Date()) },
      ...entity.generationRequestedAt && { generationRequestedAt: new Date(entity.generationRequestedAt || new Date()) },
      ...entity.lastHit && { lastHit: new Date(entity.lastHit || new Date()) },
      totalHits: entity.totalHits || 0,
      totalLinks: entity.totalLinks || 0,
      domain: entity.domain || "",
      generatedFile: entity.generatedFile || "",
      githubLink: entity.githubLink || "",
    };
    return LlmsModelSchema.parse(obj);
  },
};