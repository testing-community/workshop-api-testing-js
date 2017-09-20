const listPublicEventsSchema = {
  type: 'object',
  properties: {
    status: {
      type: 'number',
      enum: [200]
    },
    body: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          public: { type: 'boolean' },
          created_at: { type: 'string' },
          type: {
            type: 'string',
            enum: ['PushEvent', 'PullRequestEvent', 'MemberEvent', 'CreateEvent', 'DeleteEvent', 'PullRequestReviewCommentEvent', 'IssueCommentEvent', 'WatchEvent', 'IssuesEvent', 'ForkEvent', 'GollumEvent', 'PublicEvent']
          },
          actor: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              login: { type: 'string' },
              display_login: { type: 'string' },
              gravatar_id: { type: 'string' },
              url: { type: 'string' },
              avatar_url: { type: 'string' }
            }
          },
          repo: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              name: { type: 'string' },
              url: { type: 'string' }
            }
          },
          payload: {
            type: 'object',
            properties: {
              push_id: { type: 'number' },
              size: { type: 'number' },
              distinct_size: { type: 'number' },
              ref: { type: ['null', 'string'] },
              head: { type: 'string' },
              before: { type: 'string' },
              commits: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    sha: { type: 'string' },
                    message: { type: 'string' },
                    distinct: { type: 'boolean' },
                    url: { type: 'string' },
                    author: {
                      type: 'object',
                      properties: {
                        email: { type: 'string' },
                        name: { type: 'string' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      required: ['status', 'body']
    }
  }
};

exports.listPublicEventsSchema = listPublicEventsSchema;
