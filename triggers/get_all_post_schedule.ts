import { Trigger } from "deno-slack-sdk/types.ts";
import workflowDef from "../workflows/get_all_posts.ts";
import { TriggerTypes } from "deno-slack-api/mod.ts";

// Trigger for the scheduled workflow
const trigger: Trigger<typeof workflowDef.definition> = {
    type: TriggerTypes.Scheduled,
    name: "質問の回答を定期投稿する",
    workflow: `#/workflows/${workflowDef.definition.callback_id}`,
    inputs: {
        channel: {
            // Channel ID for the channel to post the message to
            value: "C06S6PAR5SQ",
        },

    },
    schedule: {
        // Schedule the first execution 60 seconds from when the trigger is created
        // start_time: new Date(new Date().getTime() + 60000).toISOString(),
        start_time: "2024-04-01T10:00:00+09:00",
        end_time: "2037-12-31T23:59:59Z",
        frequency: { type: "daily", repeats_every: 1 },
    },
};

export default trigger;