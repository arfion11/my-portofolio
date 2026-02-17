// EmailJS Configuration
// 
// SETUP INSTRUCTIONS:
// 1. Go to https://www.emailjs.com/
// 2. Sign up with your email (diotama2arfi@gmail.com)
// 3. Add Email Service (Gmail recommended)
// 4. Create Email Template with these variables:
//    - {{from_name}} - sender's name
//    - {{from_email}} - sender's email
//    - {{subject}} - message subject
//    - {{message}} - message content
// 5. Get your credentials from EmailJS dashboard
// 6. Replace the values below with your actual credentials

export const EMAILJS_CONFIG = {
  // Your EmailJS Public Key (from Account > API Keys)
  PUBLIC_KEY: 'cs8esnwktfbl79EdC',
  
  // Your EmailJS Service ID (from Email Services)
  SERVICE_ID: 'service_9ocfzwb',
  
  // Your EmailJS Template ID (from Email Templates)
  TEMPLATE_ID: 'template_fa1yd9h',
};

// Example Email Template (create this in EmailJS dashboard):
/*
Subject: New Contact Form Message from {{from_name}}

You have received a new message from your portfolio website:

Name: {{from_name}}
Email: {{from_email}}
Subject: {{subject}}

Message:
{{message}}

---
Sent from QA Portfolio Contact Form
*/

