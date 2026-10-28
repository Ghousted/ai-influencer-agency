import type { Metadata } from 'next';
import Link from 'next/link';
import { CONTACT, LegalPage } from '../LegalPage';

export const metadata: Metadata = { title: 'Terms of Service · AI Influencer Agency' };

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service">
      <p>
        These terms apply when you use AI Influencer Agency (&quot;the app&quot;), run by Apex Human. When you use the app,
        you agree to them.
      </p>

      <h2>What the app does</h2>
      <p>
        The app helps you run the AI talents you made. It shows numbers from the social accounts you connect and writes
        ideas for growth, brands and pitches. The app never posts, sends pitches or contacts brands. You decide what to
        copy and send.
      </p>

      <h2>Your account</h2>
      <ul>
        <li>Keep your password safe. You are responsible for what happens in your account.</li>
        <li>Only connect social accounts that you own or are allowed to manage.</li>
        <li>You must be 13 or older to use the app.</li>
      </ul>

      <h2>Your content</h2>
      <p>
        Your talents, pictures and ideas stay yours. You give us permission to store and show them to you so the app can
        work. When you use connected accounts, you must also follow the rules of each platform (TikTok, Instagram,
        Facebook, YouTube).
      </p>

      <h2>AI ideas</h2>
      <p>
        The ideas come from an AI model and can be wrong. Check them before you use them. You are responsible for what you
        post and send, including telling your audience that your talent is AI-made where the platform or the law says so.
      </p>

      <h2>Fair use</h2>
      <p>
        Do not use the app to break the law, to harm others, or to break or overload the app. We can close accounts that do
        this.
      </p>

      <h2>No guarantee</h2>
      <p>
        The app is given &quot;as is&quot;. Numbers come from the platforms and can be late or missing. We do not promise
        any growth, deals or income, and we are not responsible for losses from using the app.
      </p>

      <h2>Ending</h2>
      <p>
        You can stop at any time and delete your account in Account → Delete account. See the{' '}
        <Link href="/privacy">Privacy Policy</Link> for how we handle your data.
      </p>

      <h2>Changes</h2>
      <p>If we change these terms, we will update the date at the top of this page.</p>

      <h2>Contact</h2>
      <p>
        <a href={`mailto:${CONTACT}`}>{CONTACT}</a>
      </p>
    </LegalPage>
  );
}
