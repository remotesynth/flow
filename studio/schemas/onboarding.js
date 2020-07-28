export default {
  type: 'document',
  name: 'onboarding',
  title: 'Onboarding',
  initialValue: () => ({
    template: 'standalone',
    component: 'onboarding',
  }),
  fields: [
    {
      type: 'string',
      name: 'title',
      title: 'Title',
      description: 'The title of the section',
      validation: null,
    },
    {
      type: 'string',
      name: 'section_id',
      title: 'Element ID',
      description:
        'Element ID can be used in links to scroll the page to this section when link clicked',
      validation: null,
    },
    {
      type: 'string',
      name: 'type',
      title: 'Object Type',
      description: 'The type of the object',
      hidden: false,
      validation: (Rule) => Rule.required(),
      options: {
        list: ['onboarding'],
      },
    },
    {
      type: 'string',
      name: 'stackbit_url_path',
      title: 'URL Path',
      description:
        'The URL path of this page relative to site root. For example, the site root page would be "/", and post page would be "posts/new-post/"',
      validation: (Rule) => Rule.required(),
    },
    {
      type: 'string',
      name: 'stackbit_model_type',
      title: 'Stackbit Model Type',
      description: 'Stackbit model type',
      hidden: false,
      validation: (Rule) => Rule.required(),
      options: {
        list: ['page'],
      },
    },
    {
      type: 'string',
      name: 'template',
      title: 'Template',
      options: {
        list: ['page', 'post', 'standalone'],
      },
    },
    {
      type: 'string',
      name: 'component',
      options: { list: [{ title: 'Onboarding', value: 'onboarding' }] },
    },
    {
      type: 'object',
      name: 'meta',
      fields: [
        {
          type: 'image',
          name: 'logo',
          title: 'Logo'
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
};
