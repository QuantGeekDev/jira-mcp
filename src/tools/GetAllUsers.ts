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

async function GetAllUsers(startAt?: number, maxResults?: number) {
  try {
    const response = await jira.getUsers(startAt, maxResults);

    if (!response) {
      throw new Error("No response received");
    }

    console.log(`Response:`, response);
    return response;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

interface GetAllUsersInput {
  startAt?: number;
  maxResults?: number;
}

class GetAllUsersTool extends MCPTool<GetAllUsersInput> {
  name = "get_all_users";
  description = "Get all jira users.";
  schema = {
    startAt: {
      type: z.number().optional(),
      description: "The index of the first user to return (0-based)",
    },
    maxResults: {
      type: z.number().optional(),
      description: "The maximum number of users to return (defaults to 50)",
    },
  };

  async execute(input: GetAllUsersInput = {}) {
    const users = await GetAllUsers(input.startAt, input.maxResults);
    return users;
  }
}

export default GetAllUsersTool;
