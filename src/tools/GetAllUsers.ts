import { MCPTool } from "mcp-framework";
import { z } from "zod";
import jira from '../clients/jira.client.js';

async function GetAllUsers(startAt?: string, maxResults?: string) {
  let options: any = {}
  if(startAt){
    options.startAt = Number.parseInt(startAt)
  }
  if(maxResults){
    options.maxResults = Number.parseInt(maxResults)
  }
  
  try {
    const response = await jira.getUsers(options);
    if (!response) {
      throw new Error("No response received");
    }
    return response;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

interface GetAllUsersInput {
  startAt?: string;
  maxResults?: string;
}

class GetAllUsersTool extends MCPTool<GetAllUsersInput> {
  name = "get_all_users";
  description = "Get all jira users.";
  schema = {
    startAt: {
      type: z.optional(z.string()),
      description: "The index of the first user to return (0-based)",
    },
    maxResults: {
      type: z.optional(z.string()),
      description: "The maximum number of users to return (defaults to 50)",
    },
  };

  async execute(input: GetAllUsersInput = {}) {
    const users = await GetAllUsers(input.startAt, input.maxResults);
    return {
      content: {
        type: "text",
        text: JSON.stringify(users, null, 2)
      }
    };
  }
}

export default GetAllUsersTool;
