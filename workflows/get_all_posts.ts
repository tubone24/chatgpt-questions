import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
// import { OpenFormFunctionDefinition } from "../functions/openQuestionForm/definition.ts";
import { ChatGPTQuestionDefinition } from "../functions/chatgpt_question/definition.ts";
import {SendAnswerDefinition} from "../functions/send_answer/definition.ts";
import {GetAllAnswersDefinition} from "../functions/get_all_answers/definition.ts";

const GetAllPostsWorkflow = DefineWorkflow({
    callback_id: "get_all_posts",
    title: "質問された内容をDatastoreから取得する",
    description: "test",
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

GetAllPostsWorkflow.addStep(
    GetAllAnswersDefinition,
    {
        channel: GetAllPostsWorkflow.inputs.channel,
        question_id: "test",
    },
);

export default GetAllPostsWorkflow;
