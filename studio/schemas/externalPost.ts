import {defineType, defineField} from 'sanity';

export default defineType({
  name: 'externalPost',
  title: 'External Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'Source URL',
      type: 'url',
      validation: (Rule) =>
        Rule.required().uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'sourceName',
      title: 'Source Name',
      type: 'string',
    }),
    defineField({
      name: 'imageUrl',
      title: 'Image URL (remote)',
      type: 'url',
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'sourceName',
    },
    prepare({ title, subtitle }) {
      return {
        title,
        subtitle: subtitle ?? 'External source',
      };
    },
  },
});
