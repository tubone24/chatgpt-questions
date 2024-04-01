import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import {GetAllAnswersDefinition} from "../functions/get_all_answers/definition.ts";

const GetAllPostsWorkflow = DefineWorkflow({
    callback_id: "get_all_posts",
    title: "質問された内容をDatastoreから取得する",
    description: "質問された内容をDatastoreから取得する",
    input_parameters: {
        properties: {
            channel: {
                type: Schema.slack.types.channel_id,
                description:
                    "ChannelId",
            },
        },
        required: ["channel"],
    },
});

// Step 1: 質問された内容をDatastoreから取得し、まとめて投稿する
GetAllPostsWorkflow.addStep(
    GetAllAnswersDefinition,
    {
        channel: GetAllPostsWorkflow.inputs.channel,
        // DynamoDBのprefix
        question_id: "test",
    },
);

export default GetAllPostsWorkflow;
