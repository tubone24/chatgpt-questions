import { SlackFunction } from "deno-slack-sdk/mod.ts";
import {ChatGPTQuestionDefinition} from "./definition.ts";
import QuestionsDatastore from "../../datastores/questions.ts";
import HistoryQuestionsDatastore from "../../datastores/history_questions.ts";

export default SlackFunction(
    ChatGPTQuestionDefinition,
    async ({ inputs, client, env }) => {

        const queryResp = await client.apps.datastore.query<
            typeof HistoryQuestionsDatastore.definition
        >({
            datastore: HistoryQuestionsDatastore.name,
            expression: "contains (#question_id, :question_id)",
            expression_attributes: { "#question_id": "question_id" },
            expression_values: { ":question_id": "test" },
        });
        console.log(queryResp.items);
        const historyQuestion = queryResp.items.map((item) => item.question);

        const role = "user";
        const message = `あなたはSlackの雑談を促進するファシリテーターです。
チームメンバーになにか質問することで、その人の意外な一面や大切にしていることを他のチームメンバーがしることができ、チームの雰囲気がよくなるような質問を考えてください。

例をあげます。

「これだけは絶対ムリ」というくらい苦手なものを教えてください
故郷でオススメのソウルフードってなんですか？
面白いギャグをどうぞ！

例にならって、質問だけを1つだけ返してください。
質問自体を「」で囲む必要はありません。
なお同じような質問を繰り返すのはやめてください。
下記に過去質問したものを示しますのでそちらに似た質問はしないようにしてください。
${historyQuestion.join("\n")}`;

        console.log(message);

        const res = await fetch(
            "https://api.openai.com/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            "role": role,
                            "content": message,
                        },
                    ],
                    temperature: 0.9,
                }),
            },
        );
        if (res.status != 200) {
            const body = await res.text();
            return {
                error: `API Error status:${res.status} body:${body}`,
            };
        }
        const body = await res.json();
        console.log(body);
        if (body.choices && body.choices.length >= 0) {
            const answer = body.choices[0].message.content as string;
            return { outputs: { question: answer, channel: inputs.channel, user: inputs.user, interactivity: inputs.interactivity } };
        }
        return {
            error: `No choices. body:${JSON.stringify(body)}`,
        };
    },
);
