import { SlackFunction } from "deno-slack-sdk/mod.ts";
import { GetAllAnswersDefinition } from "./definition.ts";
import postQuestionWorkflow from "../../triggers/post_question.ts";
import {DatastoreItem} from "deno-slack-api/typed-method-types/apps.ts";
import QuestionsDatastore from "../../datastores/questions.ts";

export default SlackFunction(
    GetAllAnswersDefinition,
    async ({ inputs, client, env }) => {

        // 1. Query all questions from the datastore
        const queryResp = await client.apps.datastore.query<
            typeof QuestionsDatastore.definition
        >({
            datastore: QuestionsDatastore.name,
            expression: "contains (#question_id, :question_id)",
            expression_attributes: { "#question_id": "question_id" },
            expression_values: { ":question_id": inputs.question_id },
        });
        console.log(queryResp.items);

        const itemsAllIds = queryResp.items.map((item) => item.question_id);

        if (queryResp.items.length > 0) {
            const answersBlocks = queryResp.items.map((item) => {
                return [
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": `<@${item.user}>さんに聞いてみました！`
                        }
                    },
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": `*${item.question}*`
                        }
                    },
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": `${item.answer}`
                        },
                        "accessory": {
                            "type": "image",
                            "image_url": `${item.user_thumbnail}`,
                            "alt_text": "User Image"
                        }
                    }
                ];
            });
            const msgResponse = await client.chat.postMessage({
                channel: inputs.channel,
                blocks: [
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": "今日もチームのみんなに聞いたことをシェアしますね！"
                        }
                    },
                    {
                        "type": "divider"
                    },
                    ...(answersBlocks.flat()),
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": " "
                        },
                        "accessory": {
                            "type": "workflow_button",
                            "text": {
                                "type": "plain_text",
                                "text": "私も質問に回答する！"
                            },
                            "style": "primary",
                            "action_id": "workflowbutton123",
                            "workflow": {
                                "trigger": {
                                    "url": "https://slack.com/shortcuts/Ft06SH1KHSL9/74fae2191dd6657dab34d4b37f76f0e6"
                                }
                            }
                        }
                        },
                    {
                        "type": "context",
                        "elements": [
                            {
                                "type": "image",
                                "image_url": "https://image.freepik.com/free-photo/red-drawing-pin_1156-445.jpg",
                                "alt_text": "images"
                            },
                            {
                                "type": "mrkdwn",
                                "text": "質問はChatGPTで作成しております"
                            }
                        ]
                    }
                ],
            });
            if (!msgResponse.ok) {
                console.log("Error during request chat.postMessage!", msgResponse.error);
            } else {
                console.log("Message sent successfully!");
                await client.apps.datastore.bulkDelete({
                    datastore: QuestionsDatastore.name,
                    ids: itemsAllIds,
                })
            }
        } else {
            const msgResponse = await client.chat.postMessage({
                channel: inputs.channel,
                blocks: [
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": `紹介するシャッフル回答がなくなってしまいました 😢
みなさんの事をもっと知りたいので、わたしのインタビューに答えてくれると嬉しいです！`
                        }
                    },
                            {
                                "type": "section",
                                "text": {
                                    "type": "mrkdwn",
                                    "text": " "
                                },
                                "accessory": {
                                    "type": "workflow_button",
                                    "text": {
                                        "type": "plain_text",
                                        "text": "質問に回答する！"
                                    },
                                    "style": "primary",
                                    "action_id": "workflowbutton123",
                                    "workflow": {
                                        "trigger": {
                                            "url": "https://slack.com/shortcuts/Ft06SH1KHSL9/74fae2191dd6657dab34d4b37f76f0e6"
                                        }
                                    }
                                }
                            },
                    ]
            });
            if (!msgResponse.ok) {
                console.log("Error during request chat.postMessage!", msgResponse.error);
            }
        }

        return 'ok'
    });
