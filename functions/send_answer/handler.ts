import { SlackFunction } from "deno-slack-sdk/mod.ts";
import { SendAnswerDefinition } from "./definition.ts";
import postQuestionWorkflow from "../../triggers/post_question.ts";
import {DatastoreItem} from "deno-slack-api/typed-method-types/apps.ts";
import QuestionsDatastore from "../../datastores/questions.ts";

export default SlackFunction(
    SendAnswerDefinition,
    async ({ inputs, client, env }) => {
        const userInfo = await client.users.info({
            user: inputs.user,
        });

        const userThumbnail = userInfo.user?.profile.image_192 || userInfo.user?.profile.image_72;

        // const msgResponse = await client.chat.postMessage({
        //     channel: inputs.channel,
        //     blocks: [
        //         {
        //             "type": "section",
        //             "text": {
        //                 "type": "mrkdwn",
        //                 "text": "今日もチームのみんなに聞いたことをシェアしますね！"
        //             }
        //         },
        //         {
        //             "type": "divider"
        //         },
        //         {
        //             "type": "section",
        //             "text": {
        //                 "type": "mrkdwn",
        //                 "text": `<@${inputs.user}>さんに聞いてみました！`
        //             }
        //         },
        //         {
        //             "type": "section",
        //             "text": {
        //                 "type": "mrkdwn",
        //                 "text": `*${inputs.question}*`
        //             }
        //         },
        //         {
        //             "type": "section",
        //             "text": {
        //                 "type": "mrkdwn",
        //                 "text": `${inputs.answer}`
        //             },
        //             "accessory": {
        //                 "type": "image",
        //                 "image_url": `${userThumbnail}`,
        //                 "alt_text": "User Image"
        //             }
        //         },
        //         {
        //             "type": "section",
        //             "text": {
        //                 "type": "mrkdwn",
        //                 "text": " "
        //             },
        //             "accessory": {
        //                 "type": "workflow_button",
        //                 "text": {
        //                     "type": "plain_text",
        //                     "text": "私も質問に回答する！"
        //                 },
        //                 "style": "primary",
        //                 "action_id": "workflowbutton123",
        //                 "workflow": {
        //                     "trigger": {
        //                         "url": "https://slack.com/shortcuts/Ft06SH1KHSL9/74fae2191dd6657dab34d4b37f76f0e6"
        //                     }
        //                 }
        //             }
        //         },
        //         {
        //             "type": "context",
        //             "elements": [
        //                 {
        //                     "type": "image",
        //                     "image_url": "https://image.freepik.com/free-photo/red-drawing-pin_1156-445.jpg",
        //                     "alt_text": "images"
        //                 },
        //                 {
        //                     "type": "mrkdwn",
        //                     "text": "質問はChatGPTで作成しております"
        //                 }
        //             ]
        //         }
        //     ],
        // });

        // 1. Create a new question item shape
        const newQuestion: DatastoreItem<typeof QuestionsDatastore.definition> = {
            question_id: `test-${inputs.user}-${String(Date.now())}`,
            question: inputs.question,
            answer: inputs.answer,
            user: inputs.user,
            user_thumbnail: userThumbnail,
            timestamp: Date.now() / 1000,
            // Set the time to live for 7 days
            ttl_timestamp: (Date.now() + 7 * 24 * 60 * 60 * 1000) / 1000,
        };

        const putResp = await client.apps.datastore.put<
            typeof QuestionsDatastore.definition
        >({
            datastore: QuestionsDatastore.definition.name,
            item: newQuestion,
        });

        console.log(putResp);

        if (putResp.ok) {
            const msgResponse = await client.chat.postMessage({
                channel: inputs.channel,
                text: `<@${inputs.user}>さん、ありがとうございます！！
質問を受け付けました！😁チームの雰囲気を盛り上げるために、後ほどみんなに質問をシェアしますね！`,
            });
            return { outputs: { question: inputs.question, channel: inputs.channel, user: inputs.user, interactivity: inputs.interactivity, answer: inputs.answer } };
        } else {
            return {
                error: `Failed to put. ${putResp.error}`,
            };
        }

    });
