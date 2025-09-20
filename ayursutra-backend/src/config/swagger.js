const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AyurSutra API',
      version: '1.0.0',
      description: 'Panchakarma Patient Management and Therapy Scheduling Software API',
      contact: {
        name: 'AyurSutra Team',
        email: 'support@ayursutra.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://api.ayursutra.com' 
          : `http://localhost:${process.env.PORT || 3000}`,
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['name', 'email', 'password', 'phone', 'dateOfBirth', 'gender'],
          properties: {
            _id: {
              type: 'string',
              description: 'User ID'
            },
            name: {
              type: 'string',
              description: 'User full name'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            phone: {
              type: 'string',
              description: 'User phone number'
            },
            dateOfBirth: {
              type: 'string',
              format: 'date',
              description: 'User date of birth'
            },
            gender: {
              type: 'string',
              enum: ['male', 'female', 'other'],
              description: 'User gender'
            },
            role: {
              type: 'string',
              enum: ['patient', 'doctor', 'admin'],
              description: 'User role'
            },
            isEmailVerified: {
              type: 'boolean',
              description: 'Email verification status'
            },
            isPhoneVerified: {
              type: 'boolean',
              description: 'Phone verification status'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Account creation date'
            }
          }
        },
        Appointment: {
          type: 'object',
          required: ['patient', 'doctor', 'date', 'time', 'reason'],
          properties: {
            _id: {
              type: 'string',
              description: 'Appointment ID'
            },
            patient: {
              type: 'string',
              description: 'Patient ID'
            },
            doctor: {
              type: 'string',
              description: 'Doctor ID'
            },
            date: {
              type: 'string',
              format: 'date',
              description: 'Appointment date'
            },
            time: {
              type: 'string',
              description: 'Appointment time'
            },
            reason: {
              type: 'string',
              description: 'Appointment reason'
            },
            status: {
              type: 'string',
              enum: ['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show', 'rescheduled'],
              description: 'Appointment status'
            },
            payment: {
              type: 'object',
              properties: {
                amount: {
                  type: 'number',
                  description: 'Payment amount'
                },
                status: {
                  type: 'string',
                  enum: ['pending', 'paid', 'failed', 'refunded'],
                  description: 'Payment status'
                }
              }
            }
          }
        },
        Treatment: {
          type: 'object',
          required: ['patient', 'doctor', 'appointment', 'diagnosis'],
          properties: {
            _id: {
              type: 'string',
              description: 'Treatment ID'
            },
            patient: {
              type: 'string',
              description: 'Patient ID'
            },
            doctor: {
              type: 'string',
              description: 'Doctor ID'
            },
            appointment: {
              type: 'string',
              description: 'Appointment ID'
            },
            diagnosis: {
              type: 'object',
              properties: {
                primary: {
                  type: 'string',
                  description: 'Primary diagnosis'
                },
                secondary: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Secondary diagnoses'
                },
                symptoms: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Symptoms'
                }
              }
            },
            status: {
              type: 'string',
              enum: ['draft', 'active', 'paused', 'completed', 'cancelled'],
              description: 'Treatment status'
            },
            progress: {
              type: 'object',
              properties: {
                overall: {
                  type: 'number',
                  minimum: 0,
                  maximum: 100,
                  description: 'Overall progress percentage'
                }
              }
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              description: 'Error message'
            },
            error: {
              type: 'string',
              description: 'Detailed error information'
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              description: 'Success message'
            },
            data: {
              type: 'object',
              description: 'Response data'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js'] // paths to files containing OpenAPI definitions
};

const specs = swaggerJSDoc(options);

module.exports = specs;
