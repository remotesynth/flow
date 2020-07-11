export default {
  type: 'object',
  name: 'onboarding',
  title: 'Onboarding',
  fields: [
    {
        "type": "string",
        "name": "title",
        "title": "Title",
        "description": "The title of the section",
        "validation": null
    },
    {
        "type": "string",
        "name": "section_id",
        "title": "Element ID",
        "description": "Element ID can be used in links to scroll the page to this section when link clicked",
        "validation": null
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
      name: 'stackbit_model_type',
      title: 'Stackbit Model Type',
      description: 'Stackbit model type',
      hidden: false,
      validation: (Rule) => Rule.required(),
      options: {
        list: ['object'],
      },
    },
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
};
