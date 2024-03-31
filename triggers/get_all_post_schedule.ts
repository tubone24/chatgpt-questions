import { Trigger } from "deno-slack-sdk/types.ts";
import workflowDef from "../workflows/get_all_posts.ts";
import { TriggerTypes } from "deno-slack-api/mod.ts";

/**
 * A trigger that periodically starts the "maintenance-job" workflow.
 */
const trigger: Trigger<typeof workflowDef.definition> = {
    type: TriggerTypes.Scheduled,
    name: "質問の回答を定期投稿する",
    workflow: `#/workflows/${workflowDef.definition.callback_id}`,
    inputs: {
        channel: {
            value: "C06S6PAR5SQ",
        },

    },
    schedule: {
        // Schedule the first execution 60 seconds from when the trigger is created
        start_time: new Date(new Date().getTime() + 60000).toISOString(),
        end_time: "2037-12-31T23:59:59Z",
        frequency: { type: "daily", repeats_every: 1 },
    },
};

export default trigger;