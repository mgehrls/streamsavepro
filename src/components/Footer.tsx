import React from 'react'
import styles from "./Footer.module.css"

const Footer = () => {

  return (
    <div className={styles.footerContainer}>
        <a className={styles.tmdbLink} href='https://www.themoviedb.org/'>
            Images and data thankfully received from themoviedb.org
        </a>
    </div>
  )
}

export default Footer
