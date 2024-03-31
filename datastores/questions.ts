import { DefineDatastore, Schema } from "deno-slack-sdk/mod.ts";
import { DatastoreItem } from "deno-slack-api/types.ts";

const QuestionsDatastore = DefineDatastore({
        name: "questions",
        primary_key: "question_id",
        time_to_live_attribute: "ttl_timestamp",
        attributes: {
            question_id: {
                type: Schema.types.string,
            },
            question: {
                type: Schema.types.string,
            },
            answer: {
                type: Schema.types.string,
            },
            user: {
                type: Schema.slack.types.user_id,
            },
            user_thumbnail: {
                type: Schema.types.string,
            },
            timestamp: {
                type: Schema.slack.types.timestamp
            },
            ttl_timestamp: {
                type: Schema.slack.types.timestamp
            }
        }
    },
);

export type Question = Partial<
    DatastoreItem<typeof QuestionsDatastore.definition>
>;

export default QuestionsDatastore;
