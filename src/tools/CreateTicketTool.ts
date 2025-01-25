import { MCPTool } from "mcp-framework";
import { z } from "zod";
import jira from '../clients/jira.client.js';

const ISSUE_TYPE = "Task";

const CreateTicketSchema = z.object({
  projectKey: z.string().min(1),
  ticketName: z.string().min(1),
  description: z.string().optional(),
  assigneeId: z.string().optional(),
  dueDate: z.string().optional(),
  priority: z.string().optional()
});

type CreateTicketInput = z.infer<typeof CreateTicketSchema>;

const createJiraIssue = async (fields: any) => {
  const response = await jira.addNewIssue({ fields });
  if (!response) throw new Error("No issue created");
  return response;
};

const buildIssueFields = ({ projectKey, ticketName, description, assigneeId, dueDate, priority }: CreateTicketInput) => ({
  project: { key: projectKey },
  summary: ticketName,
  issuetype: { name: ISSUE_TYPE },
  description,
  ...(assigneeId && { assignee: { id: assigneeId } }),
  ...(dueDate && { duedate: dueDate }),
  ...(priority && { priority: { name: priority } })
});

class CreateTicketTool extends MCPTool<CreateTicketInput> {
  name = "create_ticket";
  description = "Create a jira ticket";
  schema = {
    projectKey: {
      type: CreateTicketSchema.shape.projectKey,
      description: "Key of Jira project"
    },
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
    },
    dueDate: {
      type: CreateTicketSchema.shape.dueDate,
      description: "Due date for the ticket in ISO format (e.g., '2025-01-30')"
    },
    priority: {
      type: CreateTicketSchema.shape.priority,
      description: "Priority level of the ticket (e.g., 'Highest', 'High', 'Medium', 'Low', 'Lowest')"
    }
  };

  async execute(input: CreateTicketInput) {
    try {
      const fields = buildIssueFields(input);
      const ticket = await createJiraIssue(fields);
      
      return {
        content: [{
          type: "text",
          text: `Created ticket: ${ticket.key}`
        }]
      };
    } catch (error: any) {
      console.error('Error creating ticket:', error);
      return {
        content: [{
          type: "text",
          text: `Error creating ticket: ${error?.message || 'Unknown error'}`
        }],
        isError: true
      };
    }
  }
}

export default CreateTicketTool;
