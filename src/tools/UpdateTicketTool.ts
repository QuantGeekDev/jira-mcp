import { MCPTool } from "mcp-framework";
import { z } from "zod";
import jira from '../clients/jira.client.js';

const UpdateTicketSchema = z.object({
  ticketId: z.string().min(1),
  summary: z.string().optional(),
  description: z.string().optional(),
  assigneeId: z.string().optional(),
  status: z.string().optional()
});

type UpdateTicketInput = z.infer<typeof UpdateTicketSchema>;

const updateJiraIssue = async (issueId: string, fields: any) => {
  const response = await jira.updateIssue(issueId, { fields });
  return response;
};

const buildUpdateFields = ({ summary, description, assigneeId, status }: Omit<UpdateTicketInput, 'ticketId'>) => {
  const fields: any = {};
  
  if (summary) fields.summary = summary;
  if (description) fields.description = description;
  if (assigneeId) fields.assignee = { id: assigneeId };
  if (status) fields.status = { name: status };

  return fields;
};

class UpdateTicketTool extends MCPTool<UpdateTicketInput> {
  name = "update_ticket";
  description = "Update an existing Jira ticket. Only pass updated fields as parameters";
  schema = {
    ticketId: {
      type: UpdateTicketSchema.shape.ticketId,
      description: "ID or key of the ticket to update (e.g., MFLP-123)"
    },
    summary: {
      type: UpdateTicketSchema.shape.summary,
      description: "New summary/title for the ticket"
    },
    description: {
      type: UpdateTicketSchema.shape.description,
      description: "New description for the ticket"
    },
    assigneeId: {
      type: UpdateTicketSchema.shape.assigneeId,
      description: "Jira user ID to reassign the ticket to"
    },
    status: {
      type: UpdateTicketSchema.shape.status,
      description: "New status for the ticket (e.g., 'In Progress', 'Done')"
    }
  };

  async execute(input: UpdateTicketInput) {
    try {
      const { ticketId, ...updateData } = input;
      const fields = buildUpdateFields(updateData);
      
      if (Object.keys(fields).length === 0) {
        throw new Error("No fields provided for update");
      }

      await updateJiraIssue(ticketId, fields);
      
      return {
        content: {
          type: "text",
          text: `Successfully updated ticket: ${ticketId}`
        }
      };
    } catch (error) {
      console.error('Error updating ticket:', error);
      throw error;
    }
  }
}

export default UpdateTicketTool;
