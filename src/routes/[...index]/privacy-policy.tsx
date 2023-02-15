import { Title } from 'solid-start'
import { Page } from '~/components/page'

const Label = (props: { text: string }) => <p class='my-4 text-lg'>{props.text}</p>

export default function TermsOfService() {
  return (
    <Page>
      <Title>Privacy Policy - Cancel Me</Title>
      <h1 class='mt-10 text-5xl text-blue-800'>Privacy Policy</h1>
      <section class='my-5'>
        <Label text='Last updated: 02/15/2023' />
        <p>
          Cancel Me ("us", "we", or "our") operates https://cancelme.io (the "Site"). This page
          informs you of our policies regarding the collection, use, and disclosure of Personal
          Information we receive from users of the Site. We use your Personal Information only to
          power the dashboard page of the Site. By using the Site, you agree to the collection and
          use of information in accordance with this policy.
        </p>

        <Label text='Information Collection And Use' />
        <p>
          While using our Site, we may ask you to provide us with certain personally identifiable
          information that can be used to contact or identify you. Personally identifiable
          information may include, but is not limited to your name, email address, mailing address,
          and phone number ("Personal Information").
        </p>

        <Label text='Log Data' />
        <p>
          Like many site operators, we collect information that your browser sends whenever you
          visit our Site ("Log Data"). This Log Data may include information such as your computer's
          Internet Protocol ("IP") address, browser type, browser version, the pages of our Site
          that you visit, the time and date of your visit, the time spent on those pages, and other
          statistics. In addition, we may use third-party services such as Google Analytics that
          collect, monitor, and analyze this data.
        </p>

        <Label text='Communications' />
        <p>
          We may use your Personal Information to contact you with newsletters, marketing, or
          promotional materials and other information that may be of interest to you. You may
          opt-out of receiving any, or all, of these communications from us by following the
          unsubscribe link or instructions provided in any email we send.
        </p>

        <Label text='Cookies' />
        <p>
          Cookies are files with a small amount of data, which may include an anonymous unique
          identifier. Cookies are sent to your browser from a web site and stored on your computer's
          hard drive. Like many sites, we use "cookies" to collect information. You can instruct
          your browser to refuse all cookies or to indicate when a cookie is being sent. However, if
          you do not accept cookies, you may not be able to use some portions of our Site.
        </p>

        <Label text='Security' />
        <p>
          The security of your Personal Information is important to us, but remember that no method
          of transmission over the Internet, or method of electronic storage, is 100% secure. While
          we strive to use commercially acceptable means to protect your Personal Information, we
          cannot guarantee its absolute security.
        </p>

        <Label text='Changes To This Privacy Policy' />
        <p>
          This Privacy Policy is effective as of the date listed above and will remain in effect
          except with respect to any changes in its provisions in the future, which will be in
          effect immediately after being posted on this page. We reserve the right to update or
          change our Privacy Policy at any time, and you should check this Privacy Policy
          periodically. Your continued use of the Service after we post any modifications to the
          Privacy Policy on this page will constitute your acknowledgment of the modifications and
          your consent to abide and be bound by the modified Privacy Policy. If we make any material
          changes to this Privacy Policy, we will notify you either through the email address you
          have provided us, or by placing a prominent notice on our website.
        </p>

        <Label text='Contact Us' />
        <p>If you have any questions about this Privacy Policy, please contact us.</p>
      </section>
    </Page>
  )
}
