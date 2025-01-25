import { MCPTool } from "mcp-framework";
import { z } from "zod";
import jira from '../clients/jira.client.js';

const TransitionIssueSchema = z.object({
  issueKey: z.string().min(1),
  transitionId: z.string().min(1),
  comment: z.string().optional(),
  resolution: z.string().optional()
});

type TransitionIssueInput = z.infer<typeof TransitionIssueSchema>;

const transitionIssue = async (issueId: string, transitionObject: any) => {
  try {
    const response = await jira.transitionIssue(issueId, transitionObject);
    return response;
  } catch (error) {
    console.error('Error transitioning issue:', error);
    throw error;
  }
};

const buildTransitionObject = ({ transitionId, comment, resolution }: Omit<TransitionIssueInput, 'issueKey'>) => ({
  transition: { id: transitionId },
  ...(comment && {
    update: {
      comment: [{
        add: { body: comment }
      }]
    }
  }),
  ...(resolution && {
    fields: {
      resolution: { name: resolution }
    }
  })
});

class TransitionIssueTool extends MCPTool<TransitionIssueInput> {
  name = "transition_issue";
  description = "Transition a Jira issue to a new status";
  schema = {
    issueKey: {
      type: TransitionIssueSchema.shape.issueKey,
      description: "Key or ID of the Jira issue (e.g., 'PROJ-123')"
    },
    transitionId: {
      type: TransitionIssueSchema.shape.transitionId,
      description: "ID of the transition to perform (use get_transitions tool to find available transitions)"
    },
    comment: {
      type: TransitionIssueSchema.shape.comment,
      description: "Optional comment to add during the transition"
    },
    resolution: {
      type: TransitionIssueSchema.shape.resolution,
      description: "Optional resolution name when transitioning to a resolved state"
    }
  };

  async execute(input: TransitionIssueInput) {
    try {
      const transitionObject = buildTransitionObject(input);
      await transitionIssue(input.issueKey, transitionObject);
      
      return {
        content: [{
          type: "text",
          text: `Successfully transitioned issue ${input.issueKey}`
        }]
      };
    } catch (error: any) {
      console.error('Error transitioning issue:', error);
      return {
        content: [{
          type: "text",
          text: `Error transitioning issue: ${error?.message || 'Unknown error'}`
        }],
        isError: true
      };
    }
  }
}

export default TransitionIssueTool;
