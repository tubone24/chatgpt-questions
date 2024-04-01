// ChatGPTから質問を受け取る

import { DefineFunction, Schema } from "deno-slack-sdk/mod.ts";

export const ChatGPTQuestionDefinition = DefineFunction({
  callback_id: "chatgpt_question",
  title: "ChatGPTから質問を受け取る",
  description: "ChatGPTから質問を受け取る",
  source_file: "functions/chatgpt_question/handler.ts",
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
        description:
          "A special input parameter that will allow this function to handle user interaction with our manage workflow for",
      },
      user: {
        type: Schema.slack.types.user_id,
        description: "workflow user id",
      },
      channel: {
        type: Schema.slack.types.channel_id,
        description: "Channel",
      },
    },
    required: ["user", "interactivity", "channel"],
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
          "A special input parameter that will allow this function to handle user interaction with our manage workflow for",
      },
      user: {
        type: Schema.slack.types.user_id,
        description: "workflow userid",
      },
      channel: {
        type: Schema.slack.types.channel_id,
        description: "Channel",
      },
    },
    required: ["question", "user", "interactivity", "channel"],
  },
});
