import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Button,
} from '@react-email/components';

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Verification Code</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
        {/* Add custom CSS for styling */}
        <style>
          {`
            body {
              font-family: 'Roboto', sans-serif;
              line-height: 1.6;
              background-color: #f7f7f7;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #ffffff;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
            }
            .button {
              display: inline-block;
              background-color: #61dafb;
              color: #ffffff;
              text-decoration: none;
              padding: 10px 20px;
              border-radius: 5px;
            }
          `}
        </style>
      </Head>
      <Preview>Here&apos;s your verification code: {otp}</Preview>
      <Section>
        <div className="container">
          <div className="header">
            <Heading as="h2">Hello {username},</Heading>
          </div>
          <Row>
            <Text>
              Thank you for registering. Please use the following verification
              code to complete your registration:
            </Text>
          </Row>
          <Row>
            <Text>{otp}</Text> 
          </Row>
          <Row>
            <Text>
              If you did not request this code, please ignore this email.
            </Text>
          </Row>
          <Row>
            {/* Replace the commented-out Button with a styled anchor tag */}
            <a href={`http://localhost:3000/verify/${username}`} className="button">
              Verify here
            </a>
          </Row>
        </div>
      </Section>
    </Html>
  );
} 
