import * as React from 'npm:react@18.3.1'
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface GiftPromptProps {
  buyerEmail?: string
  note?: string | null
}

const GiftPrompt = ({ buyerEmail, note }: GiftPromptProps) => {
  const benefactor = buyerEmail || 'your secret benefactor'
  return (
    <Html>
      <Head />
      <Preview>Someone vibe-coded world peace at you</Preview>
      <Body
        style={{
          fontFamily: 'ui-monospace, Menlo, monospace',
          backgroundColor: '#ede4d0',
          margin: 0,
          padding: '24px 0',
        }}
      >
        <Container
          style={{
            maxWidth: '540px',
            margin: '0 auto',
            padding: '24px',
            backgroundColor: '#f6f0e1',
            border: '3px solid #14213d',
          }}
        >
          <Section
            style={{
              backgroundColor: '#005bbb',
              color: '#ffffff',
              padding: '6px 10px',
              display: 'inline-block',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontSize: '11px',
            }}
          >
            a gift · world peace
          </Section>
          <Heading
            style={{
              fontSize: '32px',
              lineHeight: 1,
              margin: '16px 0',
              textTransform: 'uppercase',
              color: '#14213d',
            }}
          >
            Someone bought you The Prompt.
          </Heading>
          <Text style={{ fontSize: '14px', lineHeight: 1.5, color: '#14213d' }}>
            It is the literal one-and-done prompt Mark used to vibe-code world
            peace. You did not ask for this. That's part of the gift.
          </Text>
          {note ? (
            <Section
              style={{
                backgroundColor: '#ffffff',
                border: '2px solid #14213d',
                padding: '12px',
                margin: '16px 0',
              }}
            >
              <Text
                style={{
                  fontSize: '10px',
                  textTransform: 'uppercase',
                  color: '#5a6478',
                  margin: '0 0 6px 0',
                }}
              >
                Note from {benefactor}
              </Text>
              <Text
                style={{
                  fontSize: '14px',
                  whiteSpace: 'pre-wrap',
                  margin: 0,
                  color: '#14213d',
                }}
              >
                {note}
              </Text>
            </Section>
          ) : null}
          <Text style={{ fontSize: '14px', color: '#14213d' }}>
            Read it, sit with it, photosynthesize accordingly:
          </Text>
          <Link
            href="https://ivibecodedworldpeace.com/open-source"
            style={{ color: '#005bbb', fontWeight: 700, fontSize: '14px' }}
          >
            → ivibecodedworldpeace.com/open-source
          </Link>
          <Text
            style={{
              fontSize: '11px',
              color: '#5a6478',
              marginTop: '24px',
            }}
          >
            There will be snacks. — Spike 🪴
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: GiftPrompt,
  subject: 'Someone vibe-coded world peace at you 🕊️',
  displayName: 'Gift: The Prompt',
  previewData: {
    buyerEmail: 'mark@ivibecodedworldpeace.com',
    note: 'thinking of you. go make peace, you beautiful weirdo.',
  } satisfies GiftPromptProps,
} satisfies TemplateEntry