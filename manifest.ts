import { Manifest } from "deno-slack-sdk/mod.ts";
import PostQuestionWorkflow from "./workflows/post_question.ts";
import QuestionsDatastore from "./datastores/questions.ts";
import GetAllPostsWorkflow from "./workflows/get_all_posts.ts";

export default Manifest({
  name: "chatgpt-question",
  description: "ChatGPTから質問を受け取り、回答を促してチームビルディングする",
  icon: "assets/icon.png",
  workflows: [PostQuestionWorkflow, GetAllPostsWorkflow],
  datastores: [QuestionsDatastore],
  outgoingDomains: ["api.openai.com"],
  botScopes: [
    "commands",
    "chat:write",
    "chat:write.public",
    "datastore:read",
    "datastore:write",
    "channels:manage",
    "groups:write",
    "triggers:write",
    "users:read",
    "im:write",]
});
