import { NextResponse } from "next/server";

export async function GET() {
  const openapi = {
    openapi: "3.0.0",
    info: {
      title: "Project Nova API",
      version: "1.0.0",
      description: "Enterprise API Gateway for Project Nova"
    },
    servers: [
      {
        url: "/api/v1"
      }
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "better-auth.session_token"
        }
      }
    },
    security: [
      { cookieAuth: [] }
    ],
    paths: {
      "/health": {
        get: {
          summary: "Get system health",
          responses: {
            "200": { description: "System is healthy" }
          }
        }
      },
      "/auth": {
        get: {
          summary: "Get current authenticated user",
          responses: {
            "200": { description: "User data" },
            "401": { description: "Unauthorized" }
          }
        }
      },
      "/candidates": {
        get: {
          summary: "List candidates",
          parameters: [
            { name: "search", in: "query", schema: { type: "string" } }
          ],
          responses: {
            "200": { description: "List of candidates" }
          }
        },
        post: {
          summary: "Create candidate",
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["firstName", "lastName", "email"],
                  properties: {
                    firstName: { type: "string" },
                    lastName: { type: "string" },
                    email: { type: "string" },
                    phone: { type: "string" }
                  }
                }
              }
            }
          },
          responses: {
            "201": { description: "Created" }
          }
        }
      },
      "/documents": {
        get: {
          summary: "List documents",
          parameters: [
            { name: "candidateId", in: "query", schema: { type: "string" } }
          ],
          responses: {
            "200": { description: "List of documents" }
          }
        },
        post: {
          summary: "Upload document",
          requestBody: {
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  required: ["candidateId", "file", "documentType"],
                  properties: {
                    candidateId: { type: "string" },
                    file: { type: "string", format: "binary" },
                    documentType: { type: "string" },
                    notes: { type: "string" }
                  }
                }
              }
            }
          },
          responses: {
            "201": { description: "Uploaded" }
          }
        }
      },
      "/verifications": {
        get: {
          summary: "List verifications",
          parameters: [
            { name: "candidateId", in: "query", schema: { type: "string" } }
          ],
          responses: {
            "200": { description: "List of verifications" }
          }
        },
        post: {
          summary: "Create verification request",
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["candidateId", "type"],
                  properties: {
                    candidateId: { type: "string" },
                    type: { type: "string" }
                  }
                }
              }
            }
          },
          responses: {
            "201": { description: "Created" }
          }
        }
      },
      "/ai": {
        get: {
          summary: "List AI Jobs",
          responses: {
            "200": { description: "List of AI Jobs" }
          }
        },
        post: {
          summary: "Queue AI Job",
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["documentId", "jobType"],
                  properties: {
                    documentId: { type: "string" },
                    jobType: { type: "string" }
                  }
                }
              }
            }
          },
          responses: {
            "202": { description: "Queued" }
          }
        }
      },
      "/providers": {
        get: {
          summary: "List AI Providers",
          responses: {
            "200": { description: "List of AI Providers" }
          }
        }
      },
      "/users": {
        get: {
          summary: "List Users",
          responses: {
            "200": { description: "List of Users" }
          }
        }
      },
      "/organizations": {
        get: {
          summary: "Get Organization info",
          responses: {
            "200": { description: "Organization info" }
          }
        }
      }
    }
  };

  return NextResponse.json(openapi);
}
