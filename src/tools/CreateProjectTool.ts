import { MCPTool } from "mcp-framework";
import { z } from "zod";
import jira from '../clients/jira.client.js';

const CreateProjectSchema = z.object({
  key: z.string().min(2).max(10),
  name: z.string().min(1),
  description: z.string().optional(),
  leadAccountId: z.string().optional()
});

type CreateProjectInput = z.infer<typeof CreateProjectSchema>;

const createJiraProject = async (projectData: any) => {
  const response = await jira.createProject(projectData);
  if (!response) throw new Error("No project created");
  return response;
};

const buildProjectData = ({ key, name, description, leadAccountId }: CreateProjectInput) => ({
  key,
  name,
  description,
  projectTypeKey: "software",
  ...(leadAccountId && { leadAccountId })
});

class CreateProjectTool extends MCPTool<CreateProjectInput> {
  name = "create_project";
  description = "Create a jira project";
  schema = {
    key: {
      type: CreateProjectSchema.shape.key,
      description: "Project key (2-10 characters, uppercase)"
    },
    name: {
      type: CreateProjectSchema.shape.name,
      description: "Name of the project"
    },
    description: {
      type: CreateProjectSchema.shape.description,
      description: "Description of the project"
    },
    leadAccountId: {
      type: CreateProjectSchema.shape.leadAccountId,
      description: "Jira account ID of the project lead. Only assign if it exists"
    }
  };

  async execute(input: CreateProjectInput) {
    try {
      const projectData = buildProjectData(input);
      const project = await createJiraProject(projectData);
      
      return {
        content: {
          type: "text",
          text: `Created project: ${project.key} - ${project.self}`
        }
      };
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }
}

export default CreateProjectTool;
