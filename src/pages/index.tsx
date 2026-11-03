import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import styles from './index.module.css';

function HomepageHeader() {
  return (
    <header className={styles.hero}>
      <div className={styles.gridBg} />
      <div className={clsx('container', styles.heroInner)}>
        <div className={styles.heroText}>
          <Heading as="h1" className={styles.heroTitle}>
            Get started with <span>JNbot.</span>
          </Heading>

          <p className={styles.heroSubtitle}>
            Set up a server, add your accounts, and record a task you can replay.
            No code needed.
          </p>

          <div className={styles.heroButtons}>
            <Link className="button button--primary button--lg" to="/docs/intro">
              Get started
            </Link>
            <Link className="button button--secondary button--lg" to="/docs/plugins">
              Developer guides
            </Link>
          </div>
        </div>

        <div className={styles.heroVisual}>
          <div className={styles.window}>
            <div className={styles.windowBar}>
              <span className={styles.dots}><i /><i /><i /></span>
              <span className={styles.windowTitle}>Your first session</span>
            </div>
            <div className={styles.guideSteps}>
              <Link className={styles.guideStep} to="/docs/profiles/overview">
                <span className={styles.guideNumber}>1</span>
                <span>Choose a server profile</span>
              </Link>
              <Link className={styles.guideStep} to="/docs/getting-started/alts">
                <span className={styles.guideNumber}>2</span>
                <span>Add a Minecraft account</span>
              </Link>
              <Link className={styles.guideStep} to="/docs/plugins/recordings">
                <span className={styles.guideNumber}>3</span>
                <span>Record and replay a task</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title} Docs`}
      description="JNbot documentation — manage Minecraft bots, write plugins, and use the proxy and client APIs.">
      <HomepageHeader />
      <main>
        <HomepageFeatures />

        <section className={styles.cta}>
          <div className="container">
            <div className={styles.ctaCard}>
              <div className={styles.ctaContent}>
                <Heading as="h2" className={styles.ctaTitle}>
                  Start with your first account.
                </Heading>
                <p className={styles.ctaText}>
                  Follow the short guide to pick a server, add an account, and
                  find your way around the app.
                </p>
                <div className={styles.heroButtons}>
                  <Link
                    className="button button--primary button--lg"
                    to="https://jnbot.netlify.app/download">
                    Download JNbot
                  </Link>
                  <Link
                    className="button button--secondary button--lg"
                    to="/docs/getting-started/first-steps">
                    Read first steps
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
