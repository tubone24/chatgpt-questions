// 質問を回答する

import { DefineFunction, Schema } from "deno-slack-sdk/mod.ts";


export const SendAnswerDefinition = DefineFunction({
    callback_id: "send_answer",
    title: "回答を投稿する",
    description: "回答を投稿する",
    source_file: "functions/send_answer/handler.ts",
    input_parameters: {
        properties: {
            interactivity: {
                type: Schema.slack.types.interactivity,
                description:
                    "workflow interactivity",
            },
            user: {
                type: Schema.slack.types.user_id,
                description:
                    "workflow userid",
            },
            channel: {
                type: Schema.slack.types.channel_id,
                description:
                    "Channel",
            },
            question: {
                type: Schema.types.string,
                description: "Question for AI",
            },
            answer: {
                type: Schema.types.string,
                description: "Answer",
            },
        },
        required: ["user", "interactivity", "channel", "question", "answer"],
    },
    output_parameters: {
        properties: {
            question: {
                type: Schema.types.string,
                description: "Question for AI",
            },
            interactivity: {
                type: Schema.slack.types.interactivity,
                description:
                    "workflow interactivity",
            },
            user: {
                type: Schema.slack.types.user_id,
                description:
                    "workflow userid",
            },
            channel: {
                type: Schema.slack.types.channel_id,
                description:
                    "Channel",
            },
            answer: {
                type: Schema.types.string,
                description: "Answer",
            },
        },
        required: ["question", "user", "interactivity", "channel", "answer"],
    },
});