import { config, fields, collection } from '@keystatic/core';

export default config({
    storage: {
        kind: 'local',
    },
    collections: {
        posts: collection({
            label: 'Posts',
            slugField: 'title',
            path: 'src/content/blog/*',
            format: { contentField: 'content' },
            schema: {
                title: fields.slug({ name: { label: 'Title' } }),
                description: fields.text({ label: 'Description', multiline: true }),
                pubDate: fields.date({ label: 'Published Date' }),
                heroImage: fields.text({ label: 'Hero Image URL' }),
                category: fields.select({
                    label: 'Category',
                    options: [
                        { label: 'Technology', value: 'Technology' },
                        { label: 'Lifestyle', value: 'Lifestyle' },
                        { label: 'Travel', value: 'Travel' },
                        { label: 'Food', value: 'Food' },
                        { label: 'Personal', value: 'Personal' },
                    ],
                    defaultValue: 'Technology',
                }),
                content: fields.mdx({
                    label: 'Content',
                }),
            },
        }),
    },
});
