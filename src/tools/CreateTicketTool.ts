import { MCPTool } from "mcp-framework";
import { z } from "zod";
import jira from '../clients/jira.client.js';

const PROJECT_KEY = "MFLP";
const ISSUE_TYPE = "Task";

const CreateTicketSchema = z.object({
  ticketName: z.string().min(1),
  description: z.string().optional(),
  assigneeId: z.string().optional()
});

type CreateTicketInput = z.infer<typeof CreateTicketSchema>;

const createJiraIssue = async (fields: any) => {
  const response = await jira.addNewIssue({ fields });
  if (!response) throw new Error("No issue created");
  return response;
};

const buildIssueFields = ({ ticketName, description, assigneeId }: CreateTicketInput) => ({
  project: { key: PROJECT_KEY },
  summary: ticketName,
  issuetype: { name: ISSUE_TYPE },
  description,
  ...(assigneeId && { assignee: { id: assigneeId } })
});

class CreateTicketTool extends MCPTool<CreateTicketInput> {
  name = "create_ticket";
  description = "Create a jira ticket";
  schema = {
    ticketName: {
      type: CreateTicketSchema.shape.ticketName,
      description: "Name/Summary of the ticket"
    },
    description: {
      type: CreateTicketSchema.shape.description,
      description: "Description of the ticket"
    },
    assigneeId: {
      type: CreateTicketSchema.shape.assigneeId,
      description: "Jira user ID to assign the ticket to. Do not halucinate this, only assign if it exists"
    }
  };

  async execute(input: CreateTicketInput) {
    try {
      const fields = buildIssueFields(input);
      const ticket = await createJiraIssue(fields);
      
      return {
        content: {
          type: "text",
          text: `Created ticket: ${ticket.key} - ${ticket.self}`
        }
      };
    } catch (error) {
      console.error('Error creating ticket:', error);
      throw error;
    }
  }
}

export default CreateTicketTool;
