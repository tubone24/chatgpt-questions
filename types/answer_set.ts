import {DefineType, Schema} from "deno-slack-sdk/mod.ts";

export default DefineType(
    {
        name: "answer_set",
        description: "answer_set",
        type: Schema.types.object,
        properties: {
            answer: {
                type: Schema.types.string,
                description: "Answer",
            },
            user: {
                type: Schema.slack.types.user_id,
                description:
                    "The user id of the person who triggered the manage rotation workflow",
            },
            question: {
                type: Schema.types.string,
                description: "Question for AI",
            },
        },
    }
);