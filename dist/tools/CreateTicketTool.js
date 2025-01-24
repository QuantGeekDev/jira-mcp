import { MCPTool } from "mcp-framework";
import { z } from "zod";
import jira from "../jira.client";
async function createTicket(ticketName) {
    try {
        const projectKey = "MLPF";
        const summary = "Do some work!!!";
        const createdIssue = await jira.issues.createIssue({ fields: { issuetype: { id: "1", name: ticketName }, project: { key: projectKey }, summary } });
        if (!createdIssue) {
            throw new Error("No issue created");
        }
        console.log(`created issue:`, createdIssue);
        return createdIssue;
    }
    catch (error) {
        console.error('Error fetching tickets:', error);
    }
}
class GetTicketsTool extends MCPTool {
    name = "create_ticket";
    description = "Create a jira ticket";
    schema = {
        ticketName: {
            type: z.string(),
            description: "Key of Jira project",
        },
    };
    async execute(input) {
        const tickets = createTicket(input.ticketName);
        return tickets;
    }
}
export default GetTicketsTool;
