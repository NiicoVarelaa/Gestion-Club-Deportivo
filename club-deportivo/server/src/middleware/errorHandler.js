import { logger } from '../utils/logger.js';

const KNOWN_ERRORS = {
  '23505': { status: 409, error: 'A record with this value already exists' },
  '23503': { status: 409, error: 'Related record does not exist' },
  '23502': { status: 400, error: 'Required field is missing' },
  '23514': { status: 400, error: 'Value rejected by a database constraint' },
  '22001': { status: 400, error: 'Value is too long for its column' },
  '22P02': { status: 400, error: 'Invalid input format' },
  PGRST116: { status: 404, error: 'Record not found' },
  PGRST204: { status: 404, error: 'Record not found' },

  invalid_credentials: { status: 401, error: 'Invalid email or password' },
  email_not_confirmed: { status: 403, error: 'Email not confirmed' },
  user_already_exists: { status: 409, error: 'Email already registered' },
  email_exists: { status: 409, error: 'Email already registered' },
  weak_password: { status: 400, error: 'Password does not meet the requirements' },
  over_request_rate_limit: { status: 429, error: 'Too many requests, try again later' },
  over_email_send_rate_limit: { status: 429, error: 'Too many requests, try again later' },

  SUPABASE_NOT_CONFIGURED: { status: 503, error: 'Service temporarily unavailable' },
};

function toResponse(err) {
  if (err?.name === 'ZodError') {
    return {
      status: 400,
      body: { error: 'Validation error', details: err.issues ?? err.errors },
    };
  }

  const known = err?.code && KNOWN_ERRORS[err.code];
  if (known) {
    return { status: known.status, body: { error: known.error } };
  }

  const status = err?.status ?? err?.statusCode;
  if (Number.isInteger(status) && status >= 400 && status < 500) {
    return { status, body: { error: err.message || 'Bad request' } };
  }

  return { status: 500, body: { error: 'Internal server error' } };
}

export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  const { status, body } = toResponse(err);
  const context = { path: req?.originalUrl, status, code: err?.code, err };

  if (status >= 500) {
    logger.error(context, 'Request failed');
  } else {
    logger.warn(context, 'Request rejected');
  }

  return res.status(status).json(body);
}
