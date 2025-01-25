# braindone-mcp

A Model Context Protocol (MCP) server that provides Jira integration tools, built with mcp-framework.

## Quick Start

```bash
# Install dependencies
npm install

# Build the project
npm run build
```

## Local Development Setup

### ROO CLINE Configuration

For local development with ROO CLINE, update the args to contain the path to dist/index.js of this repo on your machine. Make sure to `npm run build` beforehand:

```json
{
  "mcpServers": {
    "braindone": {
      "command": "node",
      "args":["/home/user/braindone-mcp/dist/index.js"]
    }
  }
}
```

### Claude Desktop Configuration

Add this configuration to your Claude Desktop config file, updating the path to match your local setup:

```json
{
  "mcpServers": {
    "braindone": {
      "command": "node",
      "args": ["/path/to/your/braindone-mcp/dist/index.js"]
    }
  }
}
```

Config file locations:
- MacOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%/Claude/claude_desktop_config.json`

## Available Tools

This MCP server provides the following Jira integration tools:

### Create Ticket Tool
Creates new Jira tickets with customizable fields:
- Ticket name/summary
- Description
- Assignee ID

### Update Ticket Tool
Updates existing Jira tickets with:
- Summary
- Description
- Assignee
- Status

### Get All Tickets Tool
Retrieves tickets from a specified Jira project with:
- Summary
- Status
- Assignee
- Description

### Get All Users Tool
Fetches Jira users with pagination support:
- Configurable start index
- Adjustable results per page

## Project Structure

```
braindone-mcp/
├── src/
│   ├── tools/
│   │   ├── CreateTicketTool.ts
│   │   ├── UpdateTicketTool.ts
│   │   ├── GetTicketsTool.ts
│   │   └── GetAllUsers.ts
│   ├── clients/
│   │   └── jira.client.js
│   └── index.ts
├── package.json
└── tsconfig.json
```

## Building and Testing

1. Make your changes to the tools
2. Run `npm run build` to compile
3. Restart the client, or restart the server inside of Roo-Cline's MCP server section

## Configuration

The Jira integration uses the following default settings:
- Project Key: MFLP
- Issue Type: Task

These can be modified in the CreateTicketTool configuration.
