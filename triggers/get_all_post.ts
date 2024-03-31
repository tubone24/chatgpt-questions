import { Trigger } from "deno-slack-sdk/types.ts";
import GetAllPostsWorkflow from "../workflows/get_all_posts.ts";
const getAllPost: Trigger<
    typeof GetAllPostsWorkflow.definition
> = {
    type: "shortcut",
    name: "すべての質問を取得する",
    description: "すべての質問を取得する",
    workflow: "#/workflows/get_all_posts",
    inputs: {
        channel: {
            value: "{{data.channel_id}}",
        },
    },
};

export default getAllPost;
