import {defineArrayMember, defineType} from 'sanity'

export default defineType({
  name: 'blockContent',
  title: 'Konten',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'H1', value: 'h1'},
        {title: 'H2', value: 'h2'},
        {title: 'H3', value: 'h3'},
        {title: 'Quote', value: 'blockquote'},
      ],
      lists: [{title: 'Bullet', value: 'bullet'}, {title: 'Numbered', value: 'number'}],
      marks: {
        decorators: [
          {title: 'Strong', value: 'strong'},
          {title: 'Emphasis', value: 'em'},
          {title: 'Code', value: 'code'},
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              {name: 'href', type: 'url', title: 'URL', validation: (Rule) => Rule.uri({allowRelative: true})},
              {name: 'blank', type: 'boolean', title: 'Buka di tab baru?'},
            ],
          },
        ],
      },
    }),
    defineArrayMember({type: 'image', options: {hotspot: true}}),
  ],
})
