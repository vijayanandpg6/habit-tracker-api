import { OpenAPIV3 } from 'openapi-types';

const bearerAuth: OpenAPIV3.SecuritySchemeObject = {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
};

const errorResponse = (description: string): OpenAPIV3.ResponseObject => ({
  description,
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string' },
        },
      },
    },
  },
});

const validationErrorResponse: OpenAPIV3.ResponseObject = {
  description: 'Validation failed',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Validation failed' },
          errors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                field: { type: 'string' },
                message: { type: 'string' },
              },
            },
          },
        },
      },
    },
  },
};

export const swaggerSpec: OpenAPIV3.Document = {
  openapi: '3.0.3',
  info: {
    title: 'habit-tracker-api',
    version: '1.0.0',
    description:
      'REST API for a Smart Task & Habit Tracker mobile application. Supports offline-first sync via last-write-wins conflict resolution using `clientUpdatedAt` timestamps.',
  },
  servers: [
    {
      url: 'https://habit-tracker-api-hiis.onrender.com',
      description: 'Production',
    },
    {
      url: 'http://localhost:3000',
      description: 'Local development',
    },
  ],
  tags: [
    { name: 'Auth', description: 'Authentication and email verification' },
    { name: 'Tasks', description: 'Task management' },
    { name: 'Habits', description: 'Habit tracking and streak management' },
    { name: 'System', description: 'Health check' },
  ],
  components: {
    securitySchemes: { bearerAuth },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '664f1c2e8a1b2c3d4e5f6a7b' },
          email: { type: 'string', example: 'user@example.com' },
          isEmailVerified: { type: 'boolean', example: true },
        },
      },
      Task: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '664f1c2e8a1b2c3d4e5f6a7c' },
          userId: { type: 'string', example: '664f1c2e8a1b2c3d4e5f6a7b' },
          title: { type: 'string', example: 'Review PR' },
          description: { type: 'string', example: 'Review the auth module PR', nullable: true },
          dueDate: { type: 'string', format: 'date-time', nullable: true },
          completed: { type: 'boolean', example: false },
          clientUpdatedAt: { type: 'string', format: 'date-time' },
          deletedAt: { type: 'string', format: 'date-time', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Habit: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '664f1c2e8a1b2c3d4e5f6a7d' },
          userId: { type: 'string', example: '664f1c2e8a1b2c3d4e5f6a7b' },
          title: { type: 'string', example: 'Morning run' },
          description: { type: 'string', example: '5km every morning', nullable: true },
          streakCount: { type: 'integer', example: 7 },
          lastCompletedAt: { type: 'string', format: 'date-time', nullable: true },
          completionHistory: {
            type: 'array',
            items: { type: 'string', format: 'date-time' },
          },
          clientUpdatedAt: { type: 'string', format: 'date-time' },
          deletedAt: { type: 'string', format: 'date-time', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  },
  paths: {
    '/api/v1/auth/signup': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'user@example.com' },
                  password: { type: 'string', minLength: 8, example: 'SecurePass1' },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Account created. Verification email sent.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string' },
                    data: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        email: { type: 'string' },
                      },
                    },
                  },
                },
              },
            },
          },
          '409': errorResponse('Email already registered'),
          '422': validationErrorResponse,
        },
      },
    },
    '/api/v1/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login and receive JWT',
        description: 'Email must be verified before login is permitted.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'user@example.com' },
                  password: { type: 'string', example: 'SecurePass1' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string' },
                    data: {
                      type: 'object',
                      properties: {
                        token: { type: 'string' },
                        user: { $ref: '#/components/schemas/User' },
                      },
                    },
                  },
                },
              },
            },
          },
          '401': errorResponse('Invalid credentials or email not verified'),
          '422': validationErrorResponse,
        },
      },
    },
    '/api/v1/auth/verify-email': {
      post: {
        tags: ['Auth'],
        summary: 'Verify email address',
        description: 'Accepts the token sent to the user email. Token expires after 24 hours.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['token'],
                properties: {
                  token: { type: 'string', example: 'abc123def456...' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Email verified successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string' },
                    data: {
                      type: 'object',
                      properties: {
                        email: { type: 'string' },
                      },
                    },
                  },
                },
              },
            },
          },
          '400': errorResponse('Invalid or expired verification token'),
        },
      },
    },
    '/api/v1/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Get authenticated user',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'User retrieved',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string' },
                    data: { $ref: '#/components/schemas/User' },
                  },
                },
              },
            },
          },
          '401': errorResponse('Missing or invalid token'),
        },
      },
    },
    '/api/v1/tasks': {
      get: {
        tags: ['Tasks'],
        summary: 'List all tasks',
        description: 'Returns all non-deleted tasks for the authenticated user, sorted by most recently updated.',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Tasks retrieved',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Task' },
                    },
                  },
                },
              },
            },
          },
          '401': errorResponse('Unauthorized'),
        },
      },
      post: {
        tags: ['Tasks'],
        summary: 'Create a task',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title', 'clientUpdatedAt'],
                properties: {
                  title: { type: 'string', maxLength: 200, example: 'Review PR' },
                  description: { type: 'string', maxLength: 1000, example: 'Review the auth module PR' },
                  dueDate: { type: 'string', format: 'date-time', example: '2025-05-10T00:00:00.000Z' },
                  completed: { type: 'boolean', example: false },
                  clientUpdatedAt: { type: 'string', format: 'date-time', example: '2025-05-06T14:30:00.000Z' },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Task created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string' },
                    data: { $ref: '#/components/schemas/Task' },
                  },
                },
              },
            },
          },
          '401': errorResponse('Unauthorized'),
          '422': validationErrorResponse,
        },
      },
    },
    '/api/v1/tasks/{id}': {
      patch: {
        tags: ['Tasks'],
        summary: 'Update a task',
        description:
          'Last-write-wins sync. If `clientUpdatedAt` is not newer than the stored value, the write is ignored and the current server state is returned.',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Task MongoDB ID' },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['clientUpdatedAt'],
                properties: {
                  title: { type: 'string', maxLength: 200 },
                  description: { type: 'string', maxLength: 1000 },
                  dueDate: { type: 'string', format: 'date-time' },
                  completed: { type: 'boolean' },
                  clientUpdatedAt: { type: 'string', format: 'date-time' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Task updated (or unchanged if write was stale)',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string' },
                    data: { $ref: '#/components/schemas/Task' },
                  },
                },
              },
            },
          },
          '401': errorResponse('Unauthorized'),
          '404': errorResponse('Task not found'),
          '422': validationErrorResponse,
        },
      },
      delete: {
        tags: ['Tasks'],
        summary: 'Delete a task',
        description: 'Soft-delete. Sets `deletedAt` and excludes the task from future list responses.',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Task MongoDB ID' },
        ],
        responses: {
          '200': {
            description: 'Task deleted',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string' },
                  },
                },
              },
            },
          },
          '401': errorResponse('Unauthorized'),
          '404': errorResponse('Task not found'),
        },
      },
    },
    '/api/v1/habits': {
      get: {
        tags: ['Habits'],
        summary: 'List all habits',
        description: 'Returns all non-deleted habits for the authenticated user, sorted by most recently updated.',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Habits retrieved',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Habit' },
                    },
                  },
                },
              },
            },
          },
          '401': errorResponse('Unauthorized'),
        },
      },
      post: {
        tags: ['Habits'],
        summary: 'Create a habit',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title', 'clientUpdatedAt'],
                properties: {
                  title: { type: 'string', maxLength: 200, example: 'Morning run' },
                  description: { type: 'string', maxLength: 1000, example: '5km every morning' },
                  clientUpdatedAt: { type: 'string', format: 'date-time', example: '2025-05-06T06:00:00.000Z' },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Habit created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string' },
                    data: { $ref: '#/components/schemas/Habit' },
                  },
                },
              },
            },
          },
          '401': errorResponse('Unauthorized'),
          '422': validationErrorResponse,
        },
      },
    },
    '/api/v1/habits/{id}': {
      patch: {
        tags: ['Habits'],
        summary: 'Update a habit',
        description: 'Last-write-wins sync. Stale writes are ignored and current server state is returned.',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Habit MongoDB ID' },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['clientUpdatedAt'],
                properties: {
                  title: { type: 'string', maxLength: 200 },
                  description: { type: 'string', maxLength: 1000 },
                  clientUpdatedAt: { type: 'string', format: 'date-time' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Habit updated (or unchanged if write was stale)',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string' },
                    data: { $ref: '#/components/schemas/Habit' },
                  },
                },
              },
            },
          },
          '401': errorResponse('Unauthorized'),
          '404': errorResponse('Habit not found'),
          '422': validationErrorResponse,
        },
      },
      delete: {
        tags: ['Habits'],
        summary: 'Delete a habit',
        description: 'Soft-delete. Sets `deletedAt` and excludes the habit from future list responses.',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Habit MongoDB ID' },
        ],
        responses: {
          '200': {
            description: 'Habit deleted',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string' },
                  },
                },
              },
            },
          },
          '401': errorResponse('Unauthorized'),
          '404': errorResponse('Habit not found'),
        },
      },
    },
    '/api/v1/habits/{id}/check-in': {
      post: {
        tags: ['Habits'],
        summary: 'Record daily check-in',
        description:
          'Marks the habit as completed for today, recalculates streak, and appends to completion history. Idempotent per calendar day - a second check-in on the same day returns 409.',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Habit MongoDB ID' },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['clientUpdatedAt'],
                properties: {
                  clientUpdatedAt: { type: 'string', format: 'date-time', example: '2025-05-06T07:00:00.000Z' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Check-in recorded',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string' },
                    data: { $ref: '#/components/schemas/Habit' },
                  },
                },
              },
            },
          },
          '401': errorResponse('Unauthorized'),
          '404': errorResponse('Habit not found'),
          '409': errorResponse('Habit already checked in today'),
          '422': validationErrorResponse,
        },
      },
    },
    '/health': {
      get: {
        tags: ['System'],
        summary: 'Health check',
        responses: {
          '200': {
            description: 'Server and database status',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'OK' },
                    data: {
                      type: 'object',
                      properties: {
                        status: { type: 'string', example: 'healthy' },
                        db: { type: 'string', example: 'connected' },
                        uptime: { type: 'integer', example: 120 },
                        timestamp: { type: 'string', format: 'date-time' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
