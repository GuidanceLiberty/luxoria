/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SearchComponent from "../SearchComponent";

// Static asset imports (leaving these as they are not products)
import subBanner1 from "./../../assets/banner-1.webp";
import subBanner2 from "./../../assets/banner-2.webp";
import serviceImg1 from "./../../assets/service-icon-1.svg";
import serviceImg2 from "./../../assets/service-icon-2.svg";
import serviceImg3 from "./../../assets/service-icon-3.svg";
import serviceImg4 from "./../../assets/service-icon-4.svg";
import brand1 from "./../../assets/brand-1.png";
import brand2 from "./../../assets/brand-2.png";
import brand3 from "./../../assets/brand-3.png";
import femalebanner from "./../../assets/banner-female.webp";
import discover1 from "./../../assets/discover-1.webp";
import discover2 from "./../../assets/discover-2.webp";
import socialImage1 from "./../../assets/social-image-1.jpg";
import socialImage2 from "./../../assets/social-image-2.jpg";
import socialImage3 from "./../../assets/social-image-3.jpg";
import socialImage4 from "./../../assets/social-image-4.jpg";
import socialImage5 from "./../../assets/social-image-5.jpg";

const Index = () => {
  const API_URL = import.meta.env.VITE_BASE_URL;

   const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      setResults([]); // clear results if query is empty
      return;
    }

    try {
      const res = await fetch(
        `${API_URL}/products/search?q=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      console.log("Search response:", data);

      setResults(data?.products || []);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    }
  };

  const resetSearch = async (e) => {
    if (query.length === 0) {
      handleSearch(e);
    }
  };

  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]); // New state for categories
  const [loading, setLoading] = useState(true);
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [errorCategories, setErrorCategories] = useState(null);

  const getImageUrl = (path) => {
    if (!path) return "/images/placeholder.jpg";
    if (path.startsWith("http")) {
      return path;
    }
    return `${API_URL.replace("/api", "")}${path}`;
  };

  // 🔥 Fetch only products with tag "Favorite" (case-sensitive)
  useEffect(() => {
    const fetchFavoriteProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/products/`);
        const result = await response.json();

        if (result.success) {
          // ✅ normalize casing + trim to avoid mismatch
          const favoriteOnly = result.data.filter(
            (product) =>
              product.tag && product.tag.trim().toLowerCase() === "favorite"
          );

          console.log("🎯 Filtered Favorite products:", favoriteOnly);

          setFavoriteProducts(favoriteOnly);
          setError(null);
        } else {
          setError(result.message);
        }
      } catch (err) {
        console.error("Failed to fetch favorite products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteProducts();
  }, [API_URL]);

  // 🔥 Fetch only Featured products
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/products/`);
        const result = await response.json();

        if (result.success) {
          // ✅ Filter products where tag === "Featured"
          const featuredOnly = result.data.filter(
            (product) => product.tag && product.tag.toLowerCase() === "featured"
          );

          setFeaturedProducts(featuredOnly);
          setError(null);
        } else {
          setError(result.message);
        }
      } catch (err) {
        console.error("Failed to fetch featured products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, [API_URL]);

  // New effect hook to fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await fetch(`${API_URL}/categories/`);
        const result = await response.json();

        if (result.success) {
          setCategories(result.data);
        } else {
          setErrorCategories(result.message);
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setErrorCategories(
          "Failed to load categories. Please try again later."
        );
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [API_URL]);

  const addToWishlist = (product) => {
    const existing = JSON.parse(localStorage.getItem("wishlist")) || [];
    // The backend uses _id, not id
    if (!existing.some((p) => p._id === product._id)) {
      const updated = [...existing, product];
      localStorage.setItem("wishlist", JSON.stringify(updated));
      window.dispatchEvent(new Event("wishlistUpdated"));
      toast.success(`${product.name} added to Your wishlist`);
    } else {
      toast.info(`${product.name} is already in your wishlist`);
    }
  };

  const addToCart = (product) => {
    const existing = JSON.parse(localStorage.getItem("cart")) || [];
    // The backend uses _id, not id
    const alreadyInCart = existing.find((p) => p._id === product._id);

    if (!alreadyInCart) {
      const updatedProduct = { ...product, quantity: 1 };
      const updatedCart = [...existing, updatedProduct];
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      window.dispatchEvent(new Event("cartUpdated"));
      toast.success(`${product.name} added to Your cart`);
    } else {
      toast.info(`${product.name} is already in your cart!`);
    }
  };

  // Handle loading and error states for the UI
  if (loading && loadingCategories) {
    return <div className="text-center py-5">Loading page content...</div>;
  }

  if (error || errorCategories) {
    return (
      <div className="text-center py-5 text-danger">
        {error || errorCategories}
      </div>
    );
  }

  // Filter products for the first and second sections based on the fetched data
  const swiperProducts = featuredProducts.slice(0, 6);

  return (
    <>
      {/* Hero and other static sections remain unchanged */}
      <div className="hero">
        <Swiper
          slidesPerView={1}
          spaceBetween={0}
          modules={[Autoplay, EffectFade]}
          effect="fade"
          loop={true}
          autoplay={{
            delay: 3000,
          }}
        >
          <SwiperSlide>
            <div className="hero-wrap hero-wrap1">
              <div className="hero-content">
                <h5>- ESSENTIAL ITEMS -</h5>
                <h1>
                  Beauty Inspired <br /> by Real Life
                </h1>
                <p className="my-3">
                  Made using clean, non-toxic ingredients, our products are
                  designed for everyone.
                </p>
                <a href="#" className="btn hero-btn mt-3">
                  Shop Now
                </a>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="hero-wrap hero-wrap2">
              <div className="hero-content">
                <h5>- NEW COLLECTION -</h5>
                <h1>Get The Perfect Hydrated Skin</h1>
                <p className="my-3">
                  Made using clean, non-toxic ingredients, our products are
                  designed for everyone.
                </p>
                <a href="#" className="btn hero-btn mt-3">
                  Shop Now
                </a>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="hero-wrap hero-wrap3">
              <div className="hero-content">
                <h5>- GET THE GLOW -</h5>
                <h1>
                  Be Your Kind <br /> Of Beauty
                </h1>
                <p className="my-3">
                  Made using clean, non-toxic ingredients, our products are
                  designed for everyone.
                </p>
                <a href="#" className="btn hero-btn mt-3">
                  Shop Now
                </a>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>

  {/* 
  Search Component Section 
*/}
<div className="container-fluid px-0 py-3">
  <SearchComponent
    headerText="Search Products"
    query={query}
    setQuery={setQuery}
    handleSearch={handleSearch}
  />
</div>


{results.length > 0 ? (
  <div className="row g-4 mt-4">
    {results.map((product) => (
      <div
        key={product._id}
        className="col-6 col-sm-6 col-md-4 col-lg-3 mb-4"
      >
        <div className="product-item text-center position-relative">
          <div className="product-image w-100 position-relative overflow-hidden">
            {/* Primary image */}
            <img
              src={getImageUrl(product.image)}
              alt={product.name}
              className="img-fluid primary-img w-100"
              style={{
                width: "100%",
                height: "250px",
                objectFit: "cover",
              }}
            />

            {/* Secondary hover image */}
            {product.secondImage && (
              <img
                src={getImageUrl(product.secondImage)}
                alt={product.name}
                className="img-fluid secondary-img position-absolute top-0 start-0 w-100 h-100"
                style={{
                  objectFit: "cover",
                }}
              />
            )}

            {/* Icons */}
            <div className="product-icons gap-3 d-flex justify-content-center mt-2">
              <Link
                to={`/product/${product._id}`}
                className="product-icon d-flex"
                title="View Product"
              >
                <i className="bi bi-eye fs-5"></i>
              </Link>
              <div
                className="product-icon d-flex"
                title="Add to Wishlist"
                onClick={() => addToWishlist(product)}
                style={{ cursor: "pointer" }}
              >
                <i className="bi bi-heart fs-5"></i>
              </div>
              <div
                className="product-icon d-flex"
                title="Add to Cart"
                onClick={() => addToCart(product)}
                style={{ cursor: "pointer" }}
              >
                <i className="bi bi-cart3 fs-5"></i>
              </div>
            </div>

            {/* Tag badge */}
            {product.tag && (
              <span
                className={`tag badge text-white ${
                  product.tag === "New"
                    ? "bg-danger"
                    : product.tag === "Featured"
                    ? "bg-warning text-dark"
                    : "bg-success"
                }`}
              >
                {product.tag}
              </span>
            )}
          </div>

          {/* Product content */}
          <Link
            to={`/product/${product._id}`}
            className="text-decoration-none text-black"
          >
            <div className="product-content pt-3">
              {product.oldprice ? (
                <div className="price">
                  <span className="text-muted text-decoration-line-through me-2">
                    ₦{product.oldprice}
                  </span>
                  <span className="fw-bold text-muted">
                    ₦{product.price}
                  </span>
                </div>
              ) : (
                <span className="price fw-bold">₦{product.price}</span>
              )}
              <h3 className="title pt-1">{product.name}</h3>
            </div>
          </Link>
        </div>
      </div>
    ))}
  </div>
) : (
  query && (
    <p className="text-center text-muted mt-3">
      No products found for "{query}"
    </p>
  )
)}


      {/* Shop by Category Section */}
      <div className="container-fluid py-5 my-5">
        <h2 className="fw-semibold fs-1 text-center mb-5">Shop by Category</h2>

        {loadingCategories && (
          <div className="text-center">Loading categories...</div>
        )}
        {errorCategories && (
          <div className="text-center text-danger">{errorCategories}</div>
        )}

        {!loadingCategories && !errorCategories && categories.length > 0 && (
          <div className="row g-4">
            {categories.map((category) => (
              <div
                className="col-6 col-sm-6 col-md-4 col-lg-3 mb-4"
                key={category._id}
              >
                <Link
                  to={`/category/${category.name}`}
                  className="text-decoration-none d-block rounded-3 position-relative"
                >
                  <div className="category-image-wrapper rounded-3 overflow-hidden position-relative">
                    <img
                      src={getImageUrl(category.photo)}
                      alt={category.name}
                      className="category-image img-fluid"
                      style={{
                        width: "100%",
                        height: "250px",
                        objectFit: "cover",
                      }}
                    />
                    {/* Overlay the category name over the image */}
                    <h5
                      className="text-white fw-bold position-absolute start-50 bottom-0 translate-middle-x mb-2"
                      style={{
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        padding: "5px 10px",
                        borderRadius: "5px",
                        fontSize: "1rem",
                      }}
                    >
                      {category.name}
                    </h5>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}

        {!loadingCategories && !errorCategories && categories.length === 0 && (
          <div className="text-center">No categories found.</div>
        )}
      </div>

      {/* Feature Product section */}
      <div className="container-fluid py-5 my-5">
        <div className="section-title mb-5 text-center">
          <h2 className="fw-semibold fs-1">Our Featured Products</h2>
          <p className="text-muted">Get the skin you want to feel</p>
        </div>

        <div className="row g-4">
          {swiperProducts
            .filter(
              (product) =>
                product.tag && product.tag.toLowerCase() === "featured"
            )
            .map((product) => (
              <div
                key={product._id}
                className="col-6 col-sm-6 col-md-4 col-lg-3 mb-4"
              >
                <div className="product-item text-center position-relative">
                  <div className="product-image w-100 position-relative overflow-hidden">
                    <img
                      src={getImageUrl(product.image)}
                      alt={product.name}
                      className="img-fluid"
                      style={{
                        width: "100%",
                        height: "250px",
                        objectFit: "cover",
                      }}
                    />
                    {product.secondImage && (
                      <img
                        src={getImageUrl(product.secondImage)}
                        alt={product.name}
                        className="img-fluid"
                      />
                    )}

                    <div className="product-icons gap-3 d-flex">
                      <Link
                        to={`/product/${product._id}`}
                        className="product-icon d-flex"
                        title="View Product"
                      >
                        <i className="bi bi-eye fs-5"></i>
                      </Link>
                      <div
                        className="product-icon d-flex"
                        title="Add to Wishlist"
                        onClick={() => addToWishlist(product)}
                        style={{ cursor: "pointer" }}
                      >
                        <i className="bi bi-heart fs-5"></i>
                      </div>
                      <div
                        className="product-icon d-flex"
                        title="Add to Cart"
                        onClick={() => addToCart(product)}
                        style={{ cursor: "pointer" }}
                      >
                        <i className="bi bi-cart3 fs-5"></i>
                      </div>
                    </div>

                    <span
                      className={`tag badge text-white ${
                        product.tag === "New"
                          ? "bg-danger"
                          : product.tag === "Featured"
                          ? "bg-warning text-dark"
                          : "bg-success"
                      }`}
                    >
                      {product.tag}
                    </span>
                  </div>

                  <Link
                    to={`/product/${product._id}`}
                    className="text-decoration-none text-black"
                  >
                    <div className="product-content pt-3">
                      {product.oldprice ? (
                        <div className="price">
                          <span className="text-muted text-decoration-line-through me-2">
                            ₦{product.oldprice}
                          </span>
                          <span className="fw-bold text-muted">
                            ₦{product.price}
                          </span>
                        </div>
                      ) : (
                        <span className="price fw-bold">₦{product.price}</span>
                      )}
                      <h3 className="title pt-1">{product.name}</h3>
                    </div>
                  </Link>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* The rest of your component with static assets remains the same */}
      <div className="banners py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 banner-card overflow-hidden position-relative">
              <img
                src={subBanner1}
                alt=""
                className="img-fluid rounded banner-img"
              />
              <div className="banner-content position-absolute">
                <h3>NEW COLLECTION</h3>
                <h1>
                  Intensive Glow C+ <br /> Serum <br />
                </h1>
                <button className="btn banner-btn mt-2">EXPLORE MORE</button>
              </div>
            </div>
            <div className="col-lg-6 banner-card overflow-hidden position-relative banner-mt">
              <img
                src={subBanner2}
                alt=""
                className="img-fluid rounded banner-img"
              />
              <div className="banner-content banner-content2 position-absolute">
                <h1>25% off Everything</h1>
                <p>
                  Makeup with extended range in <br /> colors for every human.
                </p>
                <button className="btn banner-btn mt-2">SHOP NOW</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Service section */}
      <div className="container py-5 my-5">
        <div className="row text-center">
          <div className="col-lg-3 col-sm-6 mb-4">
            <img src={serviceImg1} alt="" className="img-fluid" />
            <h4 className="mt-3 mb-1">Free Shipping</h4>
            <p className="text-muted fs-6 fw-semibold">
              Free Shipping for orders over ₦130
            </p>
          </div>
          <div className="col-lg-3 col-sm-6 mb-4">
            <img src={serviceImg2} alt="" className="img-fluid" />
            <h4 className="mt-3 mb-1">Returns</h4>
            <p className="text-muted fs-6 fw-semibold">
              Within 30 days for an exchange.
            </p>
          </div>
          <div className="col-lg-3 col-sm-6 mb-4">
            <img src={serviceImg3} alt="" className="img-fluid" />
            <h4 className="mt-3 mb-1">Online Support</h4>
            <p className="text-muted fs-6 fw-semibold">
              24 hours a day, 7 days a week
            </p>
          </div>
          <div className="col-lg-3 col-sm-6 mb-4">
            <img src={serviceImg4} alt="" className="img-fluid" />
            <h4 className="mt-3 mb-1">Flexible Payment</h4>
            <p className="text-muted fs-6 fw-semibold">
              Pay with Multiple Credit Cards
            </p>
          </div>
        </div>
      </div>

      {/* Seen in section */}
      <div className="text-center my-5 seen-in">
        <div className="container">
          <h1 className="mb-5 fw-semibold">As seen in</h1>
          <div className="row pt-3 justify-content-center">
            <div className="col-md-4 mb-4 seen-card">
              <img src={brand1} alt="" className="img-fluid" />
              <p className="text-dark fs-5 mt-2 fw-semibold">
                "Also the customer service is phenomenal. I would purchase
                again."
              </p>
            </div>
            <div className="col-md-4 mb-4 seen-card">
              <img src={brand2} alt="" className="img-fluid" />
              <p className="text-dark fs-5 mt-2 fw-semibold">
                "Great product line. Very attentive staff to deal with."
              </p>
            </div>
            <div className="col-md-4 mb-4 seen-card">
              <img src={brand3} alt="" className="img-fluid" />
              <p className="text-dark fs-5 mt-2 fw-semibold">
                "Are you looking to your beauty at an affordable price? Look no
                further."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Favorite beauty section */}
      <div className="favourite-beauty py-5 my-5">
        <div className="container-fluid px-0">
          <div className="row">
            <div className="section-title mb-5 favorite-beauty-title text-center">
              <h2 className="fw-semibold fs-1">
                Customer Favorite Beauty Essentials
              </h2>
              <p>
                Made using clean, non-toxic ingredients, our products are
                designed for everyone.
              </p>
            </div>
          </div>

          <div className="row g-4">
            {/* Left banner */}
            <div className="col-lg-5">
              <div className="favourite-beauty-banner mb-lg-0 mb-5 position-relative">
                <img src={femalebanner} alt="" className="img-fluid w-100" />
                <div className="favourite-beauty-banner-title">
                  <h3 className="fs-2">Empower Yourself</h3>
                  <p className="fs-6">Get the skin you want to feel</p>
                  <button className="btn btn-default">Explore More</button>
                </div>
              </div>
            </div>

            {/* Products grid */}
            <div className="col-lg-7">
              <div className="row g-4">
                {favoriteProducts.length > 0 ? (
                  favoriteProducts.map((product) => (
                    <div
                      key={product._id}
                      className="col-6 col-sm-6 col-md-4 col-lg-3 mb-4"
                    >
                      <div className="product-item text-center position-relative">
                        <div className="product-image w-100 position-relative overflow-hidden">
                          <img
                            src={getImageUrl(product.image)}
                            alt={product.name}
                            className="img-fluid w-100"
                          />
                          {product.secondImage && (
                            <img
                              src={getImageUrl(product.secondImage)}
                              alt={product.name}
                              className="img-fluid w-100"
                            />
                          )}
                          <div className="product-icons gap-3 d-flex">
                            <Link
                              to={`/product/${product._id}`}
                              className="product-icon d-flex"
                              title="View Product"
                            >
                              <i className="bi bi-eye fs-5"></i>
                            </Link>
                            <div
                              className="product-icon d-flex"
                              title="Add to Wishlist"
                              onClick={() => addToWishlist(product)}
                              style={{ cursor: "pointer" }}
                            >
                              <i className="bi bi-heart fs-5"></i>
                            </div>
                            <div
                              className="product-icon d-flex"
                              title="Add to Cart"
                              onClick={() => addToCart(product)}
                              style={{ cursor: "pointer" }}
                            >
                              <i className="bi bi-cart3 fs-5"></i>
                            </div>
                          </div>
                          <span
                            className={`tag badge text-white ${
                              product.tag === "New" ? "bg-danger" : "bg-success"
                            }`}
                          >
                            {product.tag}
                          </span>
                        </div>
                        <Link
                          to={`/product/${product._id}`}
                          className="text-decoration-none text-black"
                        >
                          <div className="product-content pt-3">
                            {product.oldprice ? (
                              <div className="price">
                                <span className="text-muted text-decoration-line-through me-2">
                                  ₦{product.oldprice}
                                </span>
                                <span className="fw-bold text-muted">
                                  ₦{product.price}
                                </span>
                              </div>
                            ) : (
                              <span className="price fw-bold">
                                ₦{product.price}
                              </span>
                            )}
                            <h3 className="title pt-1">{product.name}</h3>
                          </div>
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted">
                    No Favorite beauty products available.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Discover section */}
      <div className="discover container py-5">
        <div className="section-title mb-5 favorite-beauty-title text-center">
          <h2 className="fw-semibold fs-1">More to Discover</h2>
          <p className="text-center">
            Our bundles were designed to conveniently package <br /> your
            tanning essentials while saving you money
          </p>
        </div>
        <div className="row g-5">
          <div className="col-md-6 discover-card text-center">
            <div className="discover-img section-image rounded">
              <img
                src={discover1}
                alt="Summer Collection"
                className="img-fluid rounded"
              />
            </div>
            <div className="discover-info mt-3">
              <div>Summer Collection</div>
              <button className="btn mt-2">
                Shop Now <i className="bi bi-arrow-right ms-2"></i>
              </button>
            </div>
          </div>
          <div className="col-md-6 discover-card text-center">
            <div className="discover-img section-image rounded">
              <img
                src={discover2}
                alt="Summer Collection"
                className="img-fluid rounded"
              />
            </div>
            <div className="discover-info mt-3">
              <div>Summer Collection</div>
              <button className="btn mt-2">
                Read More <i className="bi bi-arrow-right ms-2"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Social section */}
      <div className="social-image-container py-5 px-5 mx-auto">
        <div className="row g-4">
          <div className="col-lg-2 col-md-4">
            <div className="social-wrapper position-relative overflow-hidden">
              <img src={socialImage1} alt="" className="img-fluid" />
              <i className="bi bi-instagram"></i>
            </div>
          </div>
          <div className="col-lg-2 col-md-4">
            <div className="social-wrapper position-relative overflow-hidden">
              <img src={socialImage2} alt="" className="img-fluid" />
              <i className="bi bi-instagram"></i>
            </div>
          </div>
          <div className="col-lg-2 col-md-4">
            <div className="social-wrapper position-relative overflow-hidden">
              <img src={socialImage3} alt="" className="img-fluid" />
              <i className="bi bi-instagram"></i>
            </div>
          </div>
          <div className="col-lg-2 col-md-4">
            <div className="social-wrapper position-relative overflow-hidden">
              <img src={socialImage4} alt="" className="img-fluid" />
              <i className="bi bi-instagram"></i>
            </div>
          </div>
          <div className="col-lg-2 col-md-4">
            <div className="social-wrapper position-relative overflow-hidden">
              <img src={socialImage5} alt="" className="img-fluid" />
              <i className="bi bi-instagram"></i>
            </div>
          </div>
          <div className="col-lg-2 col-md-4">
            <div className="social-wrapper position-relative overflow-hidden">
              <img src={socialImage1} alt="" className="img-fluid" />
              <i className="bi bi-instagram"></i>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

export default Index;
