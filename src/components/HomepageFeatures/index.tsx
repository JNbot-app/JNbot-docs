import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  icon: string; // Font Awesome class
  to: string;
  description: string;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'First steps',
    icon: 'fa-solid fa-compass',
    to: '/docs/getting-started/first-steps',
    description:
      'Choose a server, add your first account, and find the main parts of the app.',
  },
  {
    title: 'Accounts',
    icon: 'fa-solid fa-users',
    to: '/docs/getting-started/alts',
    description:
      'Add Minecraft accounts, save server details, and group accounts with tags.',
  },
  {
    title: 'Record a task',
    icon: 'fa-solid fa-play',
    to: '/docs/plugins/recordings',
    description:
      'Capture actions in Minecraft and replay them later without writing code.',
  },
  {
    title: 'Server profiles',
    icon: 'fa-solid fa-server',
    to: '/docs/profiles/overview',
    description:
      'Use a ready-made server setup or create your own with the profile wizard.',
  },
];

function Feature({title, icon, to, description}: FeatureItem) {
  return (
    <Link to={to} className={styles.card}>
      <div className={styles.iconBox}>
        <i className={icon} />
      </div>
      <Heading as="h3" className={styles.cardTitle}>
        {title}
      </Heading>
      <p className={styles.cardDesc}>{description}</p>
      <span className={styles.cardArrow}>
        Explore <i className="fa-solid fa-arrow-right" />
      </span>
    </Link>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className={styles.header}>
          <Heading as="h2" className={styles.headerTitle}>
            What do you want to do?
          </Heading>
          <p className={styles.headerText}>
            Pick a guide and follow the steps in JNbot.
          </p>
        </div>

        <div className={styles.grid}>
          {FeatureList.map((props) => (
            <Feature key={props.title} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
