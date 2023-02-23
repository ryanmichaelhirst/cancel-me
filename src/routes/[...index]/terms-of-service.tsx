import { Title } from 'solid-start'
import { Page } from '~/components/page'

const Label = (props: { text: string }) => <p class='my-4 text-lg'>{props.text}</p>

export default function TermsOfService() {
  return (
    <Page>
      <Title>CancelMe - Terms of Service</Title>
      <h1 class='mt-10 text-5xl text-blue-800'>TERMS OF SERVICE AGREEMENT</h1>
      <section class='my-5'>
        <p>
          Welcome to cancelme.io! Please read these Terms of Service carefully before using our
          website.
        </p>

        <Label text='ACCEPTANCE OF TERMS' />
        <p>
          By accessing or using our website, you agree to be bound by these Terms of Service, as
          well as any additional terms and conditions that may apply to specific sections of our
          website or to products and services available through our website. If you do not agree
          with these Terms of Service, please do not access or use our website.
        </p>

        <Label text='USE OF WEBSITE' />
        <p>
          Our website is intended for your personal, non-commercial use. You may not use our website
          for any illegal or unauthorized purpose, including but not limited to violating any
          applicable laws, regulations, or rules.
        </p>

        <Label text='INTELLECTUAL PROPERTY' />
        <p>
          All content on our website, including but not limited to text, graphics, logos, images,
          and software, is the property of cancelme.io and is protected by United States and
          international copyright laws. You may not reproduce, distribute, display, or create
          derivative works of any content on our website without our prior written consent.
        </p>

        <Label text='PRIVACY POLICY' />
        <p>
          Our Privacy Policy explains how we collect, use, and share your personal information. By
          accessing or using our website, you agree to the terms of our Privacy Policy.
        </p>

        <Label text='DISCLAIMERS' />
        <p>
          We make no representations or warranties of any kind, express or implied, as to the
          operation of our website or the information, content, materials, or products included on
          our website. You expressly agree that your use of our website is at your own risk.
        </p>

        <Label text='LIMITATION OF LIABILITY' />
        <p>
          We will not be liable for any damages of any kind arising from the use of our website,
          including but not limited to direct, indirect, incidental, punitive, and consequential
          damages.
        </p>

        <Label text='MODIFICATION OF TERMS' />
        <p>
          We may revise these Terms of Service at any time without notice. By using our website, you
          agree to be bound by the current version of these Terms of Service.
        </p>

        <Label text='GOVERNING LAW' />
        <p>
          These Terms of Service are governed by the laws of the United States and the state in
          which cancelme.io is located, without giving effect to any principles of conflicts of
          laws.
        </p>

        <Label text='CONTACT US' />
        <p>
          If you have any questions about these Terms of Service, please contact us. By using our
          website, you acknowledge that you have read, understood, and agree to be bound by these
          Terms of Service.
        </p>
      </section>
    </Page>
  )
}
