import { defineAction, ActionError } from 'astro:actions';
import { z } from 'zod';

// This template ships these actions unwired (they just console.log). If you're
// using this template for a real project, replace the TODOs below with calls
// to your own email/newsletter provider or CRM before going to production.
export const server = {
  newsletter: {
    subscribe: defineAction({
      accept: 'form',
      input: z.object({
        email: z.email(),
        // Honeypot field: real users never fill this in.
        b_name: z.string().optional(),
      }),
      handler: async ({ email, b_name }) => {
        if (b_name) {
          throw new ActionError({ code: 'BAD_REQUEST', message: 'Invalid submission.' });
        }

        // TODO: wire up to your newsletter provider (e.g. Resend, Mailchimp, Buttondown).
        console.log(`Newsletter subscription: ${email}`);

        return { success: true as const };
      },
    }),
  },
  contact: {
    send: defineAction({
      accept: 'form',
      input: z.object({
        name: z.string().trim().min(1, 'Name is required'),
        email: z.email('Please enter a valid email address').trim(),
        message: z.string().trim().min(1, 'Message is required'),
        // Honeypot field: real users never fill this in.
        b_name: z.string().optional(),
      }),
      handler: async ({ name, email, message, b_name }) => {
        if (b_name) {
          throw new ActionError({ code: 'BAD_REQUEST', message: 'Invalid submission.' });
        }

        // TODO: wire up to your email provider (e.g. Resend, SendGrid) or CRM.
        console.log(`Contact message from ${name} <${email}>: ${message}`);

        return { success: true as const };
      },
    }),
  },
};
