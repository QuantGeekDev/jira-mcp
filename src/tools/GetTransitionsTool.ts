import { MCPTool } from "mcp-framework";
import { z } from "zod";
import jira from '../clients/jira.client.js';

const GetTransitionsSchema = z.object({
  issueKey: z.string().min(1)
});

type GetTransitionsInput = z.infer<typeof GetTransitionsSchema>;

const getTransitions = async (issueIdOrKey: string) => {
  try {
    const transitions = await jira.listTransitions(issueIdOrKey);
    console.log('Available transitions:', transitions);
    return transitions;
  } catch (error) {
    console.error('Error fetching transitions:', error);
    throw error;
  }
};

class GetTransitionsTool extends MCPTool<GetTransitionsInput> {
  name = "get_transitions";
  description = "Get available transitions for a Jira issue";
  schema = {
    issueKey: {
      type: GetTransitionsSchema.shape.issueKey,
      description: "Key or ID of the Jira issue (e.g., 'PROJ-123')"
    }
  };

  async execute(input: GetTransitionsInput) {
    try {
      const transitions = await getTransitions(input.issueKey);
      
      return {
        content: [{
          type: "text",
          text: JSON.stringify(transitions, null, 2)
        }]
      };
    } catch (error: any) {
      console.error('Error getting transitions:', error);
      return {
        content: [{
          type: "text",
          text: `Error getting transitions: ${error?.message || 'Unknown error'}`
        }],
        isError: true
      };
    }
  }
}

export default GetTransitionsTool;
