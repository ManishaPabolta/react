import React, { useState, useEffect, useRef } from "react";
import "./Home.css";

import img1 from "./assets/ChatGPT Image May 27, 2026, 12_04_41 PM.png";
import img2 from "./assets/ChatGPT Image May 27, 2026, 12_09_08 PM.png";
import img3 from "./assets/ChatGPT Image May 27, 2026, 12_10_49 PM.png";
import img4 from "./assets/ChatGPT Image May 27, 2026, 12_12_54 PM.png";
import img5 from "./assets/ChatGPT Image May 27, 2026, 12_13_00 PM.png";

function HomePage() {

  const images = [img1, img2, img3, img4, img5];
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showProducts, setShowProducts] = useState(false);
  const productsRef = useRef(null);


  const movingImages = [img1, img2, img3, img4, img5, img1, img2, img3, img4, img5];

  const products = [
    { id: 1, image: "https://placehold.co/462x710/eeeeee/999999?text=Product+1", name: "Brand Name", category: "Heading", price: "$80.95", oldPrice: "$85.85" },
    { id: 2, image: "https://placehold.co/462x710/eeeeee/999999?text=Product+2", name: "Brand Name", category: "Heading", price: "$80.95", oldPrice: "$85.85" },
    { id: 3, image: "https://placehold.co/462x710/eeeeee/999999?text=Product+3", name: "Brand Name", category: "Heading", price: "$80.95", oldPrice: "$85.85" },
    { id: 4, image: "https://placehold.co/462x710/eeeeee/999999?text=Product+4", name: "Brand Name", category: "Heading", price: "$80.95", oldPrice: "$85.85" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleShopNow = () => {
    setShowProducts(true);
    setTimeout(() => {
      productsRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="homepage">

      <section className="hero-section">
        <img src={images[currentSlide]} alt="banner" className="hero-image" />
        <button onClick={prevSlide} className="slider-btn left-btn">❮</button>
        <button onClick={nextSlide} className="slider-btn right-btn">❯</button>
      </section>


      <div className="info-bar">

   
        <div className="info-left">
          <p className="eyebrow-text">Eyebrow</p>
          <h2 className="hero-heading">Welcome Developer!</h2>
          <p className="hero-desc">
            Your goal is to translate the provided Figma designs into a living,
            functional interface. We value pixel-perfection — your output should
            match the design specifications exactly in terms of colour, spacing,
            typography, and visual fidelity.
          </p>
          <div className="button-group">
            <button className="shop-btn" onClick={handleShopNow}>Shop Now</button>
            <button className="discover-btn">Discover All</button>
          </div>
        </div>

     
        <div className="marquee-wrapper">
          <div className="marquee-track">
            {movingImages.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`slide-${index}`}
                className="marquee-img"
              />
            ))}
          </div>
        </div>

      </div>


      <div className="dots-bar">
        <div className="dots-container">
          {images.map((_, index) => (
            <div
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={currentSlide === index ? "dot active-dot" : "dot"}
            />
          ))}
        </div>
      </div>

  
      {showProducts && (
        <section className="products-section" ref={productsRef}>
          <h2 className="products-heading">Heading</h2>
          <div className="products-grid">
            {products.map((item) => (
              <div className="product-card" key={item.id}>
                <img src={item.image} alt={item.name} className="product-image" />
                <div className="product-content">
                  <div className="product-left">
                    <p className="brand-name">{item.name}</p>
                    <p className="category-name">{item.category}</p>
                  </div>
                  <div className="price-box">
                    <span className="price">{item.price}</span>
                    <span className="old-price">{item.oldPrice}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}

export default HomePage;