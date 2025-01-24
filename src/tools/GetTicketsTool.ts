import { MCPTool } from "mcp-framework";
import { z } from "zod";
import jira from "../jira.client";

async function getAllTickets(projectKey: string) {
  try {
    const response = await jira.issueSearch.searchForIssuesUsingJql({
      jql: `project = ${projectKey}`,
      maxResults: 100, 
      fields: ['summary', 'status', 'assignee'], 
    });

    if(!response){
      throw new Error("No response received")
    }
    console.log(`Response:`, response)

    return response
  } catch (error) {
    console.error('Error fetching tickets:', error);
  }
}
interface GetTicketsInput {
  projectName: string;
}

class GetTicketsTool extends MCPTool<GetTicketsInput> {
  name = "get_tickets";
  description = "Get all jira tickets for a specific project";

  schema = {
    projectName: {
      type: z.string(),
      description: "Key of Jira project",
    },
  };

  async execute(input: GetTicketsInput) {
    const tickets = getAllTickets(input.projectName)
    return tickets;
  }
}

export default GetTicketsTool;
