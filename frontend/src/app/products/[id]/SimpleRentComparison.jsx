import styles from './page.module.css';

const choices = [
  { question: 'What do you pay?', buy: 'The full purchase price upfront.', rent: 'Monthly rent and a refundable deposit.' },
  { question: 'Who handles repairs?', buy: 'You arrange and pay for repairs.', rent: 'Repairs and maintenance are included in the rental plan.' },
  { question: 'When your plans change?', buy: 'Keep, sell, or dispose of the device.', rent: 'Return it or discuss a longer rental.' },
];

export default function SimpleRentComparison() {
  return (
    <section className={styles.simpleCompare} aria-labelledby="simple-rent-comparison-heading">
      <div className={styles.simpleCompareInner}>
        <div className={styles.compareIntroBlock}>
          <h2 id="simple-rent-comparison-heading">Buy or rent? See what changes.</h2>
          <p className={styles.simpleCompareIntro}>Compare the costs, care, and next step before choosing what fits your plans.</p>
        </div>
        <div className={styles.compareBento}>
          {choices.map((choice, index) => (
            <article className={`${styles.compareTile} ${index === 0 ? styles.compareTileFeature : ''}`} key={choice.question}>
              <h3>{choice.question}</h3>
              <div className={styles.compareChoices}>
                <div className={styles.compareChoiceBuy}><span>Buy</span><p>{choice.buy}</p></div>
                <div className={styles.compareChoiceRent}><span>Rent</span><p>{choice.rent}</p></div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
