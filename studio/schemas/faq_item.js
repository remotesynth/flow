export default {
    "type": "object",
    "name": "faq_item",
    "title": "FAQ Item",
    "fields": [
        {
            "type": "text",
            "name": "question",
            "title": "Question",
            "validation": null
        },
        {
            "type": "markdown",
            "name": "answer",
            "title": "Answer",
            "validation": null
        },
        {
            "type": "string",
            "name": "stackbit_model_type",
            "title": "Stackbit Model Type",
            "description": "Stackbit model type",
            "hidden": false,
            "validation": Rule => Rule.required(),
            "options": {
                "list": [
                    "object"
                ]
            }
        }
    ]
}