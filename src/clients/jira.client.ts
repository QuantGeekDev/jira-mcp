import JiraApi from 'jira-client';

export const jiraClient = new JiraApi({
  protocol: 'https',
  host: 'braindone.atlassian.net',
  username: 'alex007d@gmail.com',
  password: 'ATATT3xFfGF0355oN9zSjkcbT2vtgbW8PcaRDzo1lsGx6UBpBTtN3hKiquG22Xyu1gJ0Vwy8t50Y2AmpT51q1vQBaoFP7b0yjMv1CUub8ZV4HFzpS69Gasv66WDt_39Bk8KmXUZy1QIYn2QHvlVM5ztp3-eh6eUEJld81Q0N4AVrX6ItyBXYy6E=7243BFA4',
  apiVersion: '2',
  strictSSL: true
});

export default jiraClient;
