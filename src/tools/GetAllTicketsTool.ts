import { MCPTool } from "mcp-framework";
import { z } from "zod";
import jira from '../clients/jira.client.js';

async function getAllTickets(projectKey: string) {
  try {
    const response = await jira.searchJira(`project = ${projectKey}`, {
      maxResults: 100,
      fields: ['summary', 'status', 'assignee', 'description']
    });

    if (!response) {
      throw new Error("No response received");
    }

    console.log(`Response:`, response);
    return response;
  } catch (error) {
    console.error('Error fetching tickets:', error);
    throw error;
  }
}

interface GetAllTicketsInput {
  projectName: string;
}

class GetAllTicketsTool extends MCPTool<GetAllTicketsInput> {
  name = "get_all_tickets";
  description = "Get all jira tickets for a specific project.";
  schema = {
    projectName: {
      type: z.string(),
      description: "Key of Jira project",
    },
  };

  async execute(input: GetAllTicketsInput) {
    const tickets = await getAllTickets(input.projectName);
    return tickets;
  }
}

export default GetAllTicketsTool;
