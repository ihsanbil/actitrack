import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'category',
  title: 'Kategori',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Nama', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'slug',  title: 'Slug', type: 'slug', options: {source: 'title'}, validation: (Rule) => Rule.required()}),
    defineField({name: 'desc',  title: 'Deskripsi', type: 'text'}),
  ],
})
