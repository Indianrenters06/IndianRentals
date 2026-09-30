import { useId } from 'react';
import Image from 'next/image';
import { CheckCircle } from '@phosphor-icons/react';
import styles from './page.module.css';

const choices = [
  { question: 'How you pay', buy: 'Full purchase price upfront', rent: 'Monthly rent + refundable deposit' },
  { question: 'Repairs & maintenance', buy: 'You arrange and pay for repairs', rent: 'Included in your rental plan' },
  { question: 'When you’re done', buy: 'Keep, sell, or dispose of the device', rent: 'Return it or discuss an extension' },
];

export default function SimpleRentComparison({ onChooseTerm }) {
  const headingId = useId();
  return (
    <section className={styles.simpleCompare} aria-labelledby={headingId}>
      <div className={styles.simpleCompareInner}>
        <div className={styles.compareMain}>
          <div className={styles.compareIntroBlock}>
            <h2 id={headingId}>Why rent with <span>IndianRenters?</span></h2>
            <p className={styles.simpleCompareIntro}>A monthly plan, care included, and a clear next step when you’re done.</p>
          </div>
          <table className={styles.compareTable}>
            <caption className="sr-only">Buying compared with renting from IndianRenters</caption>
            <colgroup><col className={styles.compareLabelCol} /><col /><col className={styles.compareRentCol} /></colgroup>
            <thead><tr><td /><th scope="col">Buying outright</th><th scope="col" className={styles.compareRentHeading}>Renting with us</th></tr></thead>
            <tbody>
              {choices.map(choice => <tr key={choice.question}>
                <th scope="row">{choice.question}</th>
                <td>{choice.buy}</td>
                <td className={styles.compareRentCell}><div><CheckCircle size={20} weight="regular" aria-hidden="true" /><span>{choice.rent}</span></div></td>
              </tr>)}
            </tbody>
          </table>
          <p className={styles.compareNote}>Rental terms and the refundable deposit apply to your selected plan.</p>
        </div>
        <aside className={styles.compareStory}>
          <div className={styles.compareStoryImage}>
            <Image src="/images/rental-comparison/rental-cycle-v1.webp" alt="3D illustration of a laptop and camera in a reusable delivery case, surrounded by blue return arrows" fill sizes="(min-width: 1024px) 360px, (min-width: 600px) 45vw, 100vw" style={{ objectFit: 'contain' }} />
          </div>
          <div className={styles.compareStoryBody}>
            <h3>For the time you need it.</h3>
            <p>Choose your term. Use your equipment. Return it or discuss an extension.</p>
            {onChooseTerm && <button type="button" onClick={onChooseTerm}>Choose your rental term</button>}
          </div>
        </aside>
      </div>
    </section>
  );
}
