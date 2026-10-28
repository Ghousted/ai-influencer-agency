import type { Metadata } from 'next';
import { CONTACT, LegalPage } from '../LegalPage';

export const metadata: Metadata = { title: 'Privacy Policy · AI Influencer Agency' };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p>
        AI Influencer Agency (&quot;the app&quot;) is run by Apex Human. It helps students run the AI talents they made: it
        shows numbers from each talent&apos;s social accounts and gives growth, brand and pitch ideas. This policy tells you
        what data the app collects, why, and how you can delete it.
      </p>

      <h2>Data you give us</h2>
      <ul>
        <li>Your email address and password, to sign you in.</li>
        <li>Your agency and AI talents: names, pictures, niche, story, ideas, pitches and planned posts.</li>
      </ul>

      <h2>Data from the accounts you connect</h2>
      <p>
        You can connect Instagram, Facebook Pages, TikTok and YouTube accounts. The app only reads data, and only after you
        log in to the platform and agree. It reads:
      </p>
      <ul>
        <li>
          <strong>Profile:</strong> name, username, profile picture, bio and profile link.
        </li>
        <li>
          <strong>Numbers:</strong> follower, following, like and post or video counts.
        </li>
        <li>
          <strong>Posts and videos:</strong> your recent posts with their caption, date, link, views, likes, comments and
          shares.
        </li>
      </ul>
      <p>For YouTube, the app reads only public channel data by handle. It does not ask you to log in.</p>
      <p>
        The app never posts, sends messages or contacts anyone for you. It does not read your private messages, and it
        does not sell or share your data for advertising.
      </p>

      <h2>How we use the data</h2>
      <ul>
        <li>To show you your accounts&apos; numbers, top posts and charts.</li>
        <li>
          To write ideas for you. When you ask the agents for ideas, the app sends your talent&apos;s details and recent
          post captions to an AI model provider (OpenRouter) to make the text. Only you see the result.
        </li>
      </ul>

      <h2>Where the data is kept</h2>
      <ul>
        <li>Your agency, talents and pictures are kept in our database and storage (Supabase).</li>
        <li>
          Login tokens from the platforms are encrypted before we store them. Only our server can read them, and only to
          get your numbers.
        </li>
        <li>The app is hosted on Vercel.</li>
      </ul>

      <h2>How to delete your data</h2>
      <ul>
        <li>
          <strong>Disconnect an account:</strong> on the talent&apos;s Accounts tab, select Disconnect. The app deletes the
          token for that account once no other talent of yours uses it. You can also remove the app from the platform&apos;s settings (for example TikTok:
          Settings and privacy → Security → Apps and services permissions).
        </li>
        <li>
          <strong>Delete everything:</strong> in Account, select Delete account. The app deletes your sign-in, agency,
          talents, pictures, tokens and all saved data at once.
        </li>
        <li>
          Or email <a href={`mailto:${CONTACT}`}>{CONTACT}</a> and we will delete your data within 30 days.
        </li>
      </ul>

      <h2>Children</h2>
      <p>The app is not for people under 13.</p>

      <h2>Changes</h2>
      <p>If we change this policy, we will update the date at the top of this page.</p>

      <h2>Contact</h2>
      <p>
        Questions about your data: <a href={`mailto:${CONTACT}`}>{CONTACT}</a>
      </p>
    </LegalPage>
  );
}
