import Image from 'next/image';
import styles from './PageBanner.module.css';

/** Shared Contact-style image header. Each page supplies its own CMS settings. */
export default function PageBanner({ image, alt, title, showText = true, background, titleAs: Title = 'h1', imagePosition = 'center', className = '' }) {
    const backgroundColor = /^#[\da-f]{6}$/i.test(background || '') ? background : undefined;
    return (
        <section className={`${styles.section} ${className}`} style={{ backgroundColor }} aria-label={`${title} banner`}>
            <div className={styles.container}>
                <div className={styles.frame}>
                    <Image src={image} alt={alt || title} fill priority unoptimized={image.startsWith('http')}
                        sizes="(max-width: 599px) calc(100vw - 40px), (max-width: 1260px) calc(100vw - 60px), 1200px"
                        style={{ objectPosition: imagePosition }} />
                    {showText ? <Title className={styles.title}>{title}</Title> : Title === 'h1' ? <h1 className="sr-only">{title}</h1> : null}
                </div>
            </div>
        </section>
    );
}
