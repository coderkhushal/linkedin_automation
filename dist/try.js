"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mailservice_1 = __importDefault(require("./mailservice"));
const from = 'makennavtesh@gmail.com';
const to = 'sunitamaken555@gmail.com,makensonal2000@gmail.com,khushalbhasin4488@gmail.com';
const subject = '<subject>';
const html = `
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        h1 {
            color: #0077b5; /* LinkedIn blue */
            font-size: 24px;
            margin-bottom: 20px;
        }
        p {
            color: #333;
            font-size: 16px;
            line-height: 1.6;
        }
        .footer {
            margin-top: 20px;
            text-align: center;
            color: #666;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to <span style="color: #0077b5;">LinkedIn</span> Family</h1>
        <p>Thank you for joining us! We are excited to have you as part of our community.</p>
        <p>Stay connected and grow your professional network with LinkedIn.</p>
        <div class="footer">
            <p>This email was sent from an automated system. Please do not reply.</p>
        </div>
    </div>
</body>
</html>
`;
(0, mailservice_1.default)({ from, to, subject, html });
