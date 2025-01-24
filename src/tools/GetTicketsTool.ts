import { MCPTool } from "mcp-framework";
import { z } from "zod";
import JiraApi from 'jira-client';

const jira = new JiraApi({
  protocol: 'https',
  host: 'braindone.atlassian.net',
  username: 'alex007d@gmail.com',
  password: 'ATATT3xFfGF0355oN9zSjkcbT2vtgbW8PcaRDzo1lsGx6UBpBTtN3hKiquG22Xyu1gJ0Vwy8t50Y2AmpT51q1vQBaoFP7b0yjMv1CUub8ZV4HFzpS69Gasv66WDt_39Bk8KmXUZy1QIYn2QHvlVM5ztp3-eh6eUEJld81Q0N4AVrX6ItyBXYy6E=7243BFA4',
  apiVersion: '2',
  strictSSL: true
});

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
