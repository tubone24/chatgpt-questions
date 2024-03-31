import { Trigger } from "deno-slack-sdk/types.ts";
import PostQuestions from "../workflows/post_question.ts";
const postQuestionWorkflow: Trigger<
    typeof PostQuestions.definition
> = {
    type: "shortcut",
    name: "質問に回答する",
    description: "質問に回答する",
    workflow: "#/workflows/post_question",
    inputs: {
        channel: {
            value: "{{data.channel_id}}",
        },
        user: {
            value: "{{data.user_id}}",
        },
        interactivity: {
            value: "{{data.interactivity}}",
        },
    },
};

export default postQuestionWorkflow;
