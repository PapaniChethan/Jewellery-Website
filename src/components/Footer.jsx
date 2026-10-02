import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__top">
          <div className="footer__brand">
            <span className="nav__logo gold-text">Sri Ranganatha Jewellers</span>
            <p>
              Fine jewellery handcrafted in small ateliers, using recycled gold and
              ethically sourced stones. Est. 2016.
            </p>
          </div>

          <div>
            <h4>Shop</h4>
            <ul>
              <li><Link to="/shop">Rings</Link></li>
              <li><Link to="/shop">Necklaces</Link></li>
              <li><Link to="/shop">Earrings</Link></li>
              <li><Link to="/shop">Bracelets</Link></li>
            </ul>
          </div>

          <div>
            <h4>House</h4>
            <ul>
              <li><Link to="/about">Our Story</Link></li>
              <li><Link to="/about">Craftsmanship</Link></li>
              <li><Link to="/contact">Boutiques</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4>Care</h4>
            <ul>
              <li><a href="#">Shipping &amp; Returns</a></li>
              <li><a href="#">Ring Sizing Guide</a></li>
              <li><a href="#">Jewellery Care</a></li>
              <li><a href="#">Warranty</a></li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} Sri Ranganatha Jewellers. All rights reserved.</span>
          <span>Placeholder legal text — replace with real policies before launch.</span>
        </div>
      </div>
    </footer>
  );
}
