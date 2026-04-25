import { defineCollection, reference } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const blogCollection = defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
	// Type-check frontmatter using a schema
	schema: ({ image }) => z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: image().optional(),
		heroImageAlt: z.string().optional(),
        author: z.string().optional(),
        tags: z.array(z.string()).optional(),
        youtubeId: z.string().optional(),
        audioUrl: z.string().optional(),
        isVideo: z.boolean().optional().default(false),
        noindex: z.boolean().optional().default(false),
        nofollow: z.boolean().optional().default(false),
	}),
});

const portfolioCollection = defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/portfolio" }),
    schema: z.object({
        title: z.string(),
        description: z.string(),
        pubDate: z.coerce.date(),
        heroImage: z.string(),
        tags: z.array(z.string()),
        link: z.string().optional(),
        noindex: z.boolean().optional().default(false),
        nofollow: z.boolean().optional().default(false),
    }),
});

const docsCollection = defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/docs" }),
    schema: z.object({
        title: z.string(),
        description: z.string(),
        order: z.number().optional(),
        noindex: z.boolean().optional().default(false),
        nofollow: z.boolean().optional().default(false),
    }),
});

const changelogCollection = defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/changelog" }),
    schema: z.object({
        version: z.string(),
        title: z.string(),
        description: z.string(),
        pubDate: z.coerce.date(),
        type: z.enum(['major', 'feature', 'security', 'fix', 'improvement', 'planned', 'other']).default('feature'),
        isSecurity: z.boolean().optional().default(false),
        detailsUrl: z.string().optional(),
        migrationUrl: z.string().optional(),
        noindex: z.boolean().optional().default(false),
        nofollow: z.boolean().optional().default(false),
    }),
});

const authorsCollection = defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/authors" }),
    schema: ({ image }) => z.object({
        name: z.string(),
        description: z.string(),
        avatar: image(),
        social: z.object({
            twitter: z.string().optional(),
            linkedin: z.string().optional(),
            github: z.string().optional(),
        }).optional(),
    }),
});

export const collections = {
	'blog': blogCollection,
    'portfolio': portfolioCollection,
    'docs': docsCollection,
    'changelog': changelogCollection,
    'authors': authorsCollection,
};
