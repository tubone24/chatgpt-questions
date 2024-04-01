import { DefineDatastore, Schema } from "deno-slack-sdk/mod.ts";
import { DatastoreItem } from "deno-slack-api/types.ts";

const HistoryQuestionsDatastore = DefineDatastore({
  name: "history_questions",
  primary_key: "question_id",
  attributes: {
    question_id: {
      type: Schema.types.string,
    },
    question: {
      type: Schema.types.string,
    },
    user: {
      type: Schema.slack.types.user_id,
    },
  },
});

export type HistoryQuestion = Partial<
  DatastoreItem<typeof HistoryQuestionsDatastore.definition>
>;

export default HistoryQuestionsDatastore;
