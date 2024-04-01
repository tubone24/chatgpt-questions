import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
// import { OpenFormFunctionDefinition } from "../functions/openQuestionForm/definition.ts";
import { ChatGPTQuestionDefinition } from "../functions/chatgpt_question/definition.ts";
import {SendAnswerDefinition} from "../functions/send_answer/definition.ts";

const PostQuestionWorkflow = DefineWorkflow({
    callback_id: "post_question",
    title: "質問を投稿する",
    description: "test",
    input_parameters: {
        properties: {
            interactivity: {
                type: Schema.slack.types.interactivity,
                description:
                    "A special input parameter that will allow this function to handle user interaction with our manage workflow for",
            },
            user: {
                type: Schema.slack.types.user_id,
                description:
                    "workflow userid",
            },
            channel: {
                type: Schema.slack.types.channel_id,
                description:
                    "ChannelId",
            },
        },
        required: ["user", "interactivity", "channel"],
        },
    });

// Step 1: ChatGPTから質問を受け取る
const getQuestionFromChatGPT = PostQuestionWorkflow.addStep(
    ChatGPTQuestionDefinition,
    {
        user: PostQuestionWorkflow.inputs.user,
        interactivity: PostQuestionWorkflow.inputs.interactivity,
        channel: PostQuestionWorkflow.inputs.channel,
    },

);

// Step 2: 質問を入力させる
const inputForm = PostQuestionWorkflow.addStep(
    Schema.slack.functions.OpenForm,
    {
        title: "質問です！",
        interactivity: getQuestionFromChatGPT.outputs.interactivity,
        submit_label: "質問を投稿する",
        fields: {
            elements: [{
                name: `message`,
                title: `${getQuestionFromChatGPT.outputs.question}`,
                type: Schema.types.string,
                long: true,
            }],
            required: ["message"],
        },
    },
);

// Step 3: 質問を投稿する
// PostQuestionWorkflow.addStep(Schema.slack.functions.SendMessage, {
//     channel_id: PostQuestionWorkflow.inputs.channel,
//     message: `<@${PostQuestionWorkflow.inputs.user}>さんに質問しました！
// 「${getQuestionFromChatGPT.outputs.question}」
//
// ${inputForm.outputs.fields.message}`,
// });

const sendAnswer = PostQuestionWorkflow.addStep(
    SendAnswerDefinition,
    {
        user: PostQuestionWorkflow.inputs.user,
        interactivity: inputForm.outputs.interactivity,
        channel: PostQuestionWorkflow.inputs.channel,
        question: getQuestionFromChatGPT.outputs.question,
        answer: inputForm.outputs.fields.message,
    },

);

export default PostQuestionWorkflow;
