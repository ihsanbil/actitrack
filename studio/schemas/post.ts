import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Judul', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Ringkasan',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(240),
    }),
    defineField({
      name: 'mainImage',
      title: 'Gambar Utama',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'categories',
      title: 'Kategori',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'category'}]}],
    }),
    defineField({
      name: 'author',
      title: 'Penulis',
      type: 'reference',
      to: [{type: 'author'}],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Tanggal Terbit',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({name: 'body', title: 'Konten', type: 'blockContent'}),
  ],
  orderings: [
    {title: 'Terbaru', name: 'publishedAtDesc', by: [{field: 'publishedAt', direction: 'desc'}]},
  ],
})
