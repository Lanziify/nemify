import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Button,
  Section,
  Hr,
} from 'react-email';

interface OwnerInvitationEmailProps {
  recipientName?: string;
  organizationName: string;
  inviterName: string;
  invitationUrl: string;
}

export default function OwnerInvitationEmail({
  recipientName,
  organizationName,
  inviterName,
  invitationUrl,
}: OwnerInvitationEmailProps) {
  return (
    <Html>
      <Head />
      <Body
        style={{
          backgroundColor: '#f6f9fc',
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          padding: '40px 20px',
        }}>
        <Container
          style={{
            maxWidth: '560px',
            margin: '0 auto',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            padding: '40px',
            border: '1px solid #e5e7eb',
          }}>
          <Heading
            style={{
              fontSize: '28px',
              margin: '0 0 24px',
              color: '#111827',
            }}>
            You're invited to become an organization owner
          </Heading>

          <Text
            style={{
              color: '#374151',
              fontSize: '16px',
              lineHeight: '24px',
            }}>
            Hi {recipientName ?? 'there'},
          </Text>

          <Text
            style={{
              color: '#374151',
              fontSize: '16px',
              lineHeight: '24px',
            }}>
            <strong>{inviterName}</strong> has invited you to become an
            <strong> Owner</strong> of the <strong>{organizationName}</strong>{' '}
            organization.
          </Text>

          <Text
            style={{
              color: '#374151',
              fontSize: '16px',
              lineHeight: '24px',
            }}>
            As an owner, you'll have full administrative access to the
            organization, including managing members, settings, and other
            organization resources.
          </Text>

          <Section
            style={{
              textAlign: 'center',
              margin: '32px 0',
            }}>
            <Button
              href={invitationUrl}
              style={{
                backgroundColor: '#111827',
                color: '#ffffff',
                padding: '14px 24px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontWeight: 600,
                display: 'inline-block',
              }}>
              Accept Invitation
            </Button>
          </Section>

          <Text
            style={{
              color: '#6b7280',
              fontSize: '14px',
              lineHeight: '22px',
            }}>
            If the button doesn't work, copy and paste this link into your
            browser:
          </Text>

          <Text
            style={{
              color: '#2563eb',
              fontSize: '14px',
              wordBreak: 'break-all',
            }}>
            {invitationUrl}
          </Text>

          <Hr
            style={{
              borderColor: '#e5e7eb',
              margin: '32px 0',
            }}
          />

          <Text
            style={{
              color: '#9ca3af',
              fontSize: '12px',
              lineHeight: '18px',
            }}>
            If you weren't expecting this invitation, you can safely ignore this
            email. No changes will be made unless you accept the invitation.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
