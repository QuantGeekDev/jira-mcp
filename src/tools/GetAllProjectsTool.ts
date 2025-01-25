import { MCPTool } from "mcp-framework";
import jira from '../clients/jira.client.js';

async function getAllProjects() {
  try {

    const response = await jira.listProjects();

    if (!response) {
      throw new Error("No response received");
    }

    console.log(`Response:`, response);
    return response;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
}



class GetAllProjectsTool extends MCPTool {
  name = "get_all_projects";
  description = "Get all Jira projects with optional pagination.";
  schema = {
  };

  async execute() {
    const projects = await getAllProjects();
    return projects;
  }
}

export default GetAllProjectsTool;
