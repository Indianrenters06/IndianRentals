import styles from './page.module.css';

const rows = [
  { question: 'How do you pay?', buy: 'Pay the purchase price upfront.', rent: 'Pay a monthly rental fee.' },
  { question: 'Who handles repairs?', buy: 'Arrange and pay for repairs.', rent: 'Repairs and maintenance are included in the rental plan.' },
  { question: 'What happens later?', buy: 'Keep, sell, or dispose of the device.', rent: 'Return it or discuss a longer rental.' },
];

export default function SimpleRentComparison() {
  return (
    <section className={styles.simpleCompare} aria-labelledby="simple-rent-comparison-heading">
      <div className={styles.simpleCompareInner}>
        <h2 id="simple-rent-comparison-heading">A simpler way to compare.</h2>
        <p className={styles.simpleCompareIntro}>Three practical questions to help you decide whether buying or renting fits your plans.</p>
        <div className={styles.compareHead} aria-hidden="true"><span /> <span>Buy</span><span>Rent</span></div>
        <div className={styles.compareRows}>
          {rows.map((row) => (
            <div className={styles.compareRow} key={row.question}>
              <strong>{row.question}</strong>
              <span data-label="Buy">{row.buy}</span>
              <span data-label="Rent">{row.rent}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
