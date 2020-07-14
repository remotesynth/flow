export default {
  type: 'document',
  name: 'dashboard',
  title: 'Dashboard',
  initialValue: () => ({
    template: 'page',
    component: { title: 'Dashboard', value: 'dashboard' },
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
      name: 'header',
      title: 'Header',
      description: 'The header of the section',
      validation: (Rule) => Rule.required(),
    },
    {
      type: 'string',
      name: 'type',
      title: 'Object Type',
      description: 'The type of the object',
      hidden: false,
      validation: (Rule) => Rule.required(),
      options: {
        list: ['dashboard'],
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
        list: ['page', 'standalone'],
      },
    },
    {
      type: 'string',
      name: 'component',
      options: { list: [{ title: 'Dashboard', value: 'dashboard' }] },
    },
  ],
  singleInstance: true,
  preview: {
    select: {
      title: 'title',
    },
  },
};
