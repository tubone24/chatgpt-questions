// 質問を回答する

import { DefineFunction, Schema } from "deno-slack-sdk/mod.ts";

export const GetAllAnswersDefinition = DefineFunction({
  callback_id: "get_all_answers",
  title: "すべての回答を取得する",
  description: "すべての回答を取得する",
  source_file: "functions/get_all_answers/handler.ts",
  input_parameters: {
    properties: {
      channel: {
        type: Schema.slack.types.channel_id,
        description: "Channel",
      },
      question_id: {
        type: Schema.types.string,
        description: "questionId",
      },
    },
    required: ["channel", "question_id"],
  },
});
