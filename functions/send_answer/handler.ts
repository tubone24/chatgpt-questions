import { SlackFunction } from "deno-slack-sdk/mod.ts";
import { SendAnswerDefinition } from "./definition.ts";
import { DatastoreItem } from "deno-slack-api/typed-method-types/apps.ts";
import QuestionsDatastore from "../../datastores/questions.ts";
import HistoryQuestionsDatastore from "../../datastores/history_questions.ts";

export default SlackFunction(
  SendAnswerDefinition,
  async ({ inputs, client }) => {
    const userInfo = await client.users.info({
      user: inputs.user,
    });

    const userThumbnail = userInfo.user?.profile.image_192 ||
      userInfo.user?.profile.image_72;

    // 1. Create a new question item
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

    // 2. Put the new question item into the datastore
    const putResp = await client.apps.datastore.put<
      typeof QuestionsDatastore.definition
    >({
      datastore: QuestionsDatastore.definition.name,
      item: newQuestion,
    });

    console.log(putResp);

    // 3. Create a new history question item
    const newHistoryQuestion: DatastoreItem<
      typeof HistoryQuestionsDatastore.definition
    > = {
      question_id: `test-${inputs.user}-${String(Date.now())}`,
      question: inputs.question,
      user: inputs.user,
    };

    // 4. Put the new history question item into the datastore
    const putResp2 = await client.apps.datastore.put<
      typeof HistoryQuestionsDatastore.definition
    >({
      datastore: HistoryQuestionsDatastore.definition.name,
      item: newHistoryQuestion,
    });

    if (putResp.ok && putResp2.ok) {
      // 5. Send a message to the channel
      const msgResponse = await client.chat.postEphemeral({
        channel: inputs.channel,
        user: inputs.user,
        text: `ありがとうございます！！
質問を受け付けました！😁チームの雰囲気を盛り上げるために、後ほどみんなに質問をシェアしますね！`,
      });
      console.log(msgResponse);
      return {
        outputs: {
          question: inputs.question,
          channel: inputs.channel,
          user: inputs.user,
          interactivity: inputs.interactivity,
          answer: inputs.answer,
        },
      };
    } else {
      return {
        error: `Failed to put. ${putResp.error}`,
      };
    }
  },
);
