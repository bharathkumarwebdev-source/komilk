
import React, { useState, useEffect } from 'react';
import { PRODUCTS } from './constants';
import { Product, CartItem, ViewState } from './types';
import AIAssistant from './components/AIAssistant';

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [loginState, setLoginState] = useState<'guest' | 'loggedIn'>('guest');
  const [view, setView] = useState<ViewState>('HOME');
  
  // Product Details State
  const [selectedProduct, setSelectedProduct] = useState<Product>(PRODUCTS[0]);
  const [detailQty, setDetailQty] = useState(1);
  const [detailTab, setDetailTab] = useState<'description' | 'nutrition' | 'storage'>('description');

  // Load from local storage
  useEffect(() => {
    const savedCart = localStorage.getItem("cartData");
    if (savedCart) setCart(JSON.parse(savedCart));

    const savedLogin = localStorage.getItem("loginState");
    if (savedLogin === "loggedIn") setLoginState("loggedIn");
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem("cartData", JSON.stringify(cart));
  }, [cart]);

  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    
    const toast = document.createElement('div');
    toast.className = 'position-fixed top-0 end-0 p-3';
    toast.style.zIndex = '1100';
    toast.innerHTML = `
      <div class="toast show bg-white shadow">
        <div class="toast-header text-white bg-success">
          <strong class="me-auto">Added to Cart</strong>
          <button type="button" class="btn-close btn-close-white" onclick="this.parentElement.parentElement.parentElement.remove()"></button>
        </div>
        <div class="toast-body">${product.name} added.</div>
      </div>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  const updateQuantity = (index: number, delta: number) => {
    setCart(prev => {
      const newCart = [...prev];
      const item = newCart[index];
      const newQuantity = item.quantity + delta;
      
      if (newQuantity <= 0) {
        newCart.splice(index, 1);
      } else {
        item.quantity = newQuantity;
      }
      return newCart;
    });
  };

  const removeItem = (index: number) => {
    setCart(prev => {
      const newCart = [...prev];
      newCart.splice(index, 1);
      return newCart;
    });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("loginState", "loggedIn");
    setLoginState("loggedIn");
    setIsLoginModalOpen(false);
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const renderHomeView = () => (
    <>
      {/* Hero Section */}
      <section className="hero-section" id="home">
        <div className="container">
          <h1 className="hero-title">Fresh Milk Delivered to Your Doorstep</h1>
          <p className="hero-subtitle">Pure, unprocessed milk directly from our farms</p>
        </div>
      </section>

      {/* Floating Image Section */}
      <section className="floating-image-section">
        <img src="/images/packed1.jpg" className="floating-image" alt="Packed Milk" />
        <div className="floating-image-content">
          <h2>Fresh From Our Farms</h2>
          <p>Pure, Natural, and Unprocessed Milk</p>
          <button className="btn" onClick={() => setView('MILK')}>Learn More</button>
        </div>
      </section>

      <section className="her">
        <div className="container">
          <div className="d-flex justify-content-around flex-wrap">
            <div style={{color: 'white', fontSize: '1.2rem'}}>🧴 Zero Processing</div>
            <div style={{color: 'white', fontSize: '1.2rem'}}>🥛 Packed Milk</div>
            <div style={{color: 'white', fontSize: '1.2rem'}}>✅ Ensured Quality</div>
            <div style={{color: 'white', fontSize: '1.2rem'}}>🚚 Door Step Delivery</div>
          </div>
        </div>
      </section>
      
      {/* Company History */}
      <section className="history-section" id="about">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center">
              <h2 className="history-title">Our Story</h2>
              <p className="history-date">Launched in January 2019</p>
              <p>KO-MILK started with a simple mission: to provide fresh, unprocessed milk directly from local farms to consumers. We believe in the purity of natural milk and are committed to delivering it to your doorstep without any additives or preservatives.</p>
              <p>Our journey began in 2019 with a small group of dedicated farmers who shared our vision. Today, we serve hundreds of satisfied customers who trust us for their daily milk needs.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );

  const renderMilkView = () => (
    <>
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">Our Milk Products</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item" onClick={() => setView('HOME')}>Home</li>
              <li className="breadcrumb-item active" aria-current="page">Milk Products</li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Filter Section */}
      <section className="filter-section">
        <div className="container">
          <div className="text-center">
            <button className="filter-btn active">All Products</button>
            <button className="filter-btn">Cow Milk</button>
            <button className="filter-btn">Buffalo Milk</button>
            <button className="filter-btn">Native Cow Milk</button>
            <button className="filter-btn">Special Offers</button>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="products-section">
        <div className="container">
          <div className="row">
            {PRODUCTS.map(product => (
              <div className="col-lg-4 col-md-6" key={product.id}>
                <div className="product-card">
                  <div className="product-img-container">
                    <img src={product.image} className="product-img" alt={product.name} />
                    <span className={`product-badge ${product.id === '3' ? 'new' : ''}`}>
                      {product.id === '3' ? 'New' : 'On Sale'}
                    </span>
                    <div className="product-overlay">
                      <button 
                        className="quick-view-btn"
                        onClick={() => {
                          setSelectedProduct(product);
                          document.getElementById('product-details')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                      >
                        Quick View
                      </button>
                    </div>
                  </div>
                  <div className="product-body">
                    <div className="product-category">{product.category}</div>
                    <h3 className="product-title">{product.name}</h3>
                    <p className="product-description">{product.description}</p>
                    <div className="product-price">
                      ₹{product.price}/litre 
                      {product.id !== '3' && <span className="old-price">₹{product.price + 5}/litre</span>}
                    </div>
                    <div className="product-actions">
                      <button 
                        className="add-to-cart-btn"
                        onClick={() => handleAddToCart(product)}
                      >
                        Add to Cart
                      </button>
                      <button className="wishlist-btn">
                        <i className="bi bi-heart"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Details Section */}
      <section className="product-details-section" id="product-details">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="product-details-img">
                <img src={selectedProduct.image} alt={selectedProduct.name} />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="product-details-content">
                <h2>{selectedProduct.name}</h2>
                <div className="price">₹{selectedProduct.price}/litre</div>
                <p className="description">
                  {selectedProduct.description} Our {selectedProduct.name.toLowerCase()} is sourced directly from local farms and delivered to your doorstep without any processing or additives. It's rich in calcium, protein, and essential nutrients.
                </p>
                <div className="product-meta">
                  <div className="meta-item">
                    <i className="bi bi-check-circle-fill"></i>
                    <span>100% Pure and Natural</span>
                  </div>
                  <div className="meta-item">
                    <i className="bi bi-check-circle-fill"></i>
                    <span>No Preservatives</span>
                  </div>
                  <div className="meta-item">
                    <i className="bi bi-check-circle-fill"></i>
                    <span>Farm Fresh Daily</span>
                  </div>
                  <div className="meta-item">
                    <i className="bi bi-check-circle-fill"></i>
                    <span>Rich in {selectedProduct.nutritionHighlights[0]}</span>
                  </div>
                </div>
                <div className="quantity-selector">
                  <button 
                    className="quantity-btn" 
                    onClick={() => setDetailQty(Math.max(1, detailQty - 1))}
                  >-</button>
                  <input type="text" className="quantity-input" value={detailQty} readOnly />
                  <button 
                    className="quantity-btn"
                    onClick={() => setDetailQty(detailQty + 1)}
                  >+</button>
                </div>
                <div className="product-actions-large">
                  <button 
                    className="add-to-cart-btn-large"
                    onClick={() => {
                      handleAddToCart(selectedProduct, detailQty);
                      setDetailQty(1);
                    }}
                  >
                    Add to Cart
                  </button>
                  <button className="wishlist-btn-large">
                    <i className="bi bi-heart"></i>
                  </button>
                </div>
                
                <ul className="nav nav-tabs product-tabs">
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${detailTab === 'description' ? 'active' : ''}`}
                      onClick={() => setDetailTab('description')}
                    >
                      Description
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${detailTab === 'nutrition' ? 'active' : ''}`}
                      onClick={() => setDetailTab('nutrition')}
                    >
                      Nutrition
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${detailTab === 'storage' ? 'active' : ''}`}
                      onClick={() => setDetailTab('storage')}
                    >
                      Storage
                    </button>
                  </li>
                </ul>
                <div className="tab-content">
                  {detailTab === 'description' && (
                    <div>
                      <p>Our fresh {selectedProduct.name.toLowerCase()} is collected daily from healthy cows raised on local farms. We ensure that the milk is handled with utmost care to maintain its freshness and nutritional value. The milk is not processed or homogenized, preserving its natural goodness.</p>
                      <p>Each batch of milk is tested for quality and purity before delivery.</p>
                    </div>
                  )}
                  {detailTab === 'nutrition' && (
                    <div>
                      <p>Packed with essential nutrients:</p>
                      <ul>
                        <li>Fat Content: {selectedProduct.fatContent}</li>
                        <li>Calcium: Essential for strong bones and teeth</li>
                        <li>Protein: Important for muscle growth</li>
                        <li>Vitamin D: Helps in calcium absorption</li>
                      </ul>
                    </div>
                  )}
                  {detailTab === 'storage' && (
                    <div>
                      <p>To maintain freshness:</p>
                      <ul>
                        <li>Store at 4°C or below</li>
                        <li>Consume within 2 days</li>
                        <li>Boil before consumption if preferred</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );

  const renderAboutView = () => (
    <>
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">About Us</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item" onClick={() => setView('HOME')}>Home</li>
              <li className="breadcrumb-item active" aria-current="page">About Us</li>
            </ol>
          </nav>
        </div>
      </section>

      {/* About Hero */}
      <section className="about-hero-section">
        <div className="container">
          <div className="about-hero-content">
            <h2>Welcome to KO-MILK</h2>
            <p>We are committed to delivering fresh, pure, and unprocessed milk directly from local farms to your doorstep. Our mission is to reconnect consumers with the source of their food while supporting local farmers and sustainable practices.</p>
          </div>
          <div className="about-hero-image">
            <img src="/images/KOMILK Banner Footer-01.avif" alt="KO-MILK Farm" />
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="story-section">
        <div className="container">
          <div className="section-title">
            <h2>Our Story</h2>
            <p>From a simple idea to a growing business, here's the story of KO-MILK</p>
          </div>
          
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <div className="story-content">
                <p>KO-MILK was founded in January 2019 with a simple yet powerful vision: to provide fresh, unprocessed milk directly from local farms to consumers. Our founder, Subhash Thangavel, grew up in a farming family and witnessed firsthand the challenges faced by small-scale dairy farmers in getting fair prices for their produce.</p>
                
                <p>After years of working in the corporate sector, Subhash returned to his roots with a mission to create a sustainable business model that would benefit both farmers and consumers. He believed that everyone deserves access to pure, fresh milk without any additives or processing, and that farmers should receive fair compensation for their hard work.</p>
                
                <p>Starting with just 10 cows and a handful of customers in Namakkal, KO-MILK has grown to serve hundreds of satisfied customers daily. Despite our growth, we remain committed to our core values of purity, transparency, and sustainability.</p>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="story-image">
                <img src="/images/6860c8_1c7d64ba93f242d69874f76bbdf883ac~mv2.avif" alt="Our Story" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <div className="section-title">
            <h2>Our Core Values</h2>
            <p>The principles that guide everything we do at KO-MILK</p>
          </div>
          
          <div className="row g-4">
            <div className="col-md-4">
              <div className="value-card">
                <div className="value-icon">
                  <i className="bi bi-droplet-fill"></i>
                </div>
                <h3>Purity & Freshness</h3>
                <p>We deliver milk that is completely fresh and pure, straight from the farm to your table without any processing or additives. We believe in preserving the natural goodness of milk.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="value-card">
                <div className="value-icon">
                  <i className="bi bi-people-fill"></i>
                </div>
                <h3>Fair Trade</h3>
                <p>We ensure our farmers receive fair compensation for their produce, creating a sustainable ecosystem that benefits both producers and consumers.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="value-card">
                <div className="value-icon">
                  <i className="bi bi-leaf-fill"></i>
                </div>
                <h3>Sustainability</h3>
                <p>We promote sustainable farming practices that are good for the environment, animals, and people. Our goal is to create a positive impact on our community.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="timeline-section">
        <div className="container">
          <div className="section-title">
            <h2>Our Journey</h2>
            <p>From a small idea to a growing business, here's a look at our milestones</p>
          </div>
          
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-date">Jan 2019</div>
              <div className="timeline-content">
                <h3>Company Founded</h3>
                <p>KO-MILK was founded with a vision to provide fresh, unprocessed milk directly from farms to consumers.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-date">Jun 2019</div>
              <div className="timeline-content">
                <h3>First Delivery</h3>
                <p>We made our first delivery to 10 households in Namakkal, marking the beginning of our journey.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-date">Mar 2020</div>
              <div className="timeline-content">
                <h3>Expanded Operations</h3>
                <p>Despite the challenges, we expanded our operations to cover more areas and increased our customer base.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-date">Jan 2021</div>
              <div className="timeline-content">
                <h3>Launched Online Platform</h3>
                <p>We launched our online platform to make ordering easier and more convenient for our customers.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-date">Aug 2022</div>
              <div className="timeline-content">
                <h3>Reached 1000+ Customers</h3>
                <p>We reached a milestone of serving over 1000 happy customers daily.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-date">Present</div>
              <div className="timeline-content">
                <h3>Continuing to Grow</h3>
                <p>Today, we continue to grow and improve our services, staying true to our mission of providing pure, fresh milk.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );

  const renderCareersView = () => (
    <>
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">Careers</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item" onClick={() => setView('HOME')}>Home</li>
              <li className="breadcrumb-item active" aria-current="page">Careers</li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Careers Section */}
      <section className="careers-section">
        <div className="container">
          <div className="section-title">
            <h2>Explore Careers in KO-MILK</h2>
            <p>Join our team and be a part of our mission to deliver fresh, pure milk to every household</p>
          </div>
          
          <div className="career-grid">
            <div className="career-card">
              <div className="career-icon">
                <i className="fa-solid fa-clipboard-list"></i>
              </div>
              <h3>Business Administration</h3>
              <ul>
                <li>Finance Manager (Full Time)</li>
                <li>Human Resources Manager (Full Time)</li>
              </ul>
              <button className="explore-btn" onClick={() => setView('CAREER_BUSINESS_ADMIN')}>Explore</button>
            </div>

            <div className="career-card">
              <div className="career-icon">
                <i className="fa-solid fa-globe"></i>
              </div>
              <h3>Web and Application Management</h3>
              <ul>
                <li>Web and App Management (Full Time)</li>
                <li>SEO/SMM/Digital Marketing Executive (Full Time)</li>
              </ul>
              <button className="explore-btn" onClick={() => setView('CAREER_WEB_APP_MGMT')}>Explore</button>
            </div>

            <div className="career-card">
              <div className="career-icon">
                <i className="fa-solid fa-bullhorn"></i>
              </div>
              <h3>Marketing</h3>
              <ul>
                <li>Marketing Head (Office/Full Time)</li>
                <li>Field Executive (Office/Full Time)</li>
              </ul>
              <button className="explore-btn" onClick={() => setView('CAREER_MARKETING')}>Explore</button>
            </div>

            <div className="career-card">
              <div className="career-icon">
                <i className="fa-solid fa-handshake"></i>
              </div>
              <h3>Vendors Development</h3>
              <ul>
                <li>Vendor Head (Full Time)</li>
                <li>Area Manager (Freelance)</li>
              </ul>
              <button className="explore-btn" onClick={() => setView('CAREER_VENDORS_DEV')}>Explore</button>
            </div>

            <div className="career-card">
              <div className="career-icon">
                <i className="fa-solid fa-truck"></i>
              </div>
              <h3>Logistics</h3>
              <ul>
                <li>Logistic Manager (Full Time)</li>
                <li>Distribution Executives (Part-time)</li>
              </ul>
              <button className="explore-btn" onClick={() => setView('CAREER_LOGISTICS')}>Explore</button>
            </div>

            <div className="career-card">
              <div className="career-icon">
                <i className="fa-solid fa-people-carry-box"></i>
              </div>
              <h3>Distribution and Delivery</h3>
              <ul>
                <li>Distribution & Delivery Manager (Full Time)</li>
                <li>Delivery Executives (Part-time)</li>
              </ul>
              <button className="explore-btn" onClick={() => setView('CAREER_DIST_DELIVERY')}>Explore</button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="container">
          <div className="section-title">
            <h2>Why Work With Us</h2>
            <p>Discover the benefits of being part of the KO-MILK family</p>
          </div>
          
          <div className="row g-4">
            <div className="col-md-4">
              <div className="benefit-card">
                <div className="benefit-icon">
                  <i className="bi bi-graph-up-arrow"></i>
                </div>
                <h3>Career Growth</h3>
                <p>We provide opportunities for professional development and career advancement within the company.</p>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="benefit-card">
                <div className="benefit-icon">
                  <i className="bi bi-people-fill"></i>
                </div>
                <h3>Inclusive Culture</h3>
                <p>We foster a diverse and inclusive work environment where everyone feels valued and respected.</p>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="benefit-card">
                <div className="benefit-icon">
                  <i className="bi bi-balance-scale"></i>
                </div>
                <h3>Work-Life Balance</h3>
                <p>We believe in maintaining a healthy balance between work and personal life for all our employees.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="process-section">
        <div className="container">
          <div className="section-title">
            <h2>Our Hiring Process</h2>
            <p>Simple and transparent steps to join our team</p>
          </div>
          
          <div className="process-steps">
            <div className="process-step">
              <div className="step-number">1</div>
              <div className="step-title">Apply</div>
              <div className="step-description">Submit your application through our careers portal</div>
            </div>
            
            <div className="process-step">
              <div className="step-number">2</div>
              <div className="step-title">Screening</div>
              <div className="step-description">Our HR team reviews your application</div>
            </div>
            
            <div className="process-step">
              <div className="step-number">3</div>
              <div className="step-title">Interview</div>
              <div className="step-description">Attend interviews with the team</div>
            </div>
            
            <div className="process-step">
              <div className="step-number">4</div>
              <div className="step-title">Offer</div>
              <div className="step-description">Receive and accept our job offer</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );

  const renderCareerBusinessAdminView = () => (
    <>
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">Business Administration Careers</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item" onClick={() => setView('HOME')}>Home</li>
              <li className="breadcrumb-item" onClick={() => setView('CAREERS')}>Careers</li>
              <li className="breadcrumb-item active" aria-current="page">Business Administration</li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Finance Manager Job Details Section */}
      <section className="job-details-section">
        <div className="container">
          <div className="job-header">
            <h1>Business Administration</h1>
            <h2>Finance Manager</h2>
            
            <div className="job-meta">
              <div className="meta-item">
                <i className="bi bi-hash"></i>
                <span>Job No: 6001</span>
              </div>
              <div className="meta-item">
                <i className="bi bi-info-circle"></i>
                <span>Status: Into Effect Soon</span>
              </div>
              <div className="meta-item">
                <i className="bi bi-airplane"></i>
                <span>Travel: 10-20%</span>
              </div>
              <div className="meta-item">
                <i className="bi bi-briefcase"></i>
                <span>Full Time</span>
              </div>
            </div>
          </div>
          
          <div className="job-content">
            <div className="content-section">
              <h3 className="job-section-title">Roles</h3>
              <p>
                Financial managers need to perform data analysis and advise managers on profit-maximizing ideas. 
                They are responsible for the financial health of an organization. They produce financial reports 
                and develop long-term financial strategies for the company.
              </p>
              <p>
                He/she is also responsible for implementing technological advances to reduce the time required 
                to produce financial reports.
              </p>
            </div>
            
            <div className="content-section">
              <h3 className="job-section-title">Responsibilities</h3>
              <ul>
                <li>Prepare financial statements and business activity reports.</li>
                <li>Ensure that legal requirements are met in the accounts department.</li>
                <li>Yearly budgeting and fixing the financial target of the company.</li>
                <li>Analyze market and find opportunities for business expansion.</li>
                <li>Help management make financial decisions.</li>
              </ul>
            </div>
            
            <div className="content-section">
              <h3 className="job-section-title">Qualification</h3>
              <ul>
                <li>MBA degree is mandatory.</li>
                <li>Technical knowledge in GST, Tally, ERP.</li>
                <li>Minimum one year experience in relevant sectors.</li>
                <li>Male/Female.</li>
              </ul>
            </div>
            
            <div className="apply-section">
              <button className="apply-btn" onClick={() => alert('Application submitted for Finance Manager!')}>Apply Now</button>
            </div>
          </div>
        </div>
      </section>

      {/* Job Section Separator */}
      <div className="container">
        <div className="job-separator"></div>
      </div>

      {/* Human Resource Manager Job Details Section */}
      <section className="job-details-section">
        <div className="container">
          <div className="job-header">
            <h1>Business Administration</h1>
            <h2>Human Resource Manager</h2>
            
            <div className="job-meta">
              <div className="meta-item">
                <i className="bi bi-hash"></i>
                <span>Job No: 6002</span>
              </div>
              <div className="meta-item">
                <i className="bi bi-info-circle"></i>
                <span>Status: Into Effect Soon</span>
              </div>
              <div className="meta-item">
                <i className="bi bi-airplane"></i>
                <span>Travel: 20-30%</span>
              </div>
              <div className="meta-item">
                <i className="bi bi-briefcase"></i>
                <span>Full Time</span>
              </div>
            </div>
          </div>
          
          <div className="job-content">
            <div className="content-section">
              <h3 className="job-section-title">Roles</h3>
              <p>
                Ko-Milk is on a journey to reinvent the quality of the milk industry. This is your opportunity 
                to empower people to achieve it. He should be passionate about the power of talent in people 
                and technology. Ko-Milk is looking for an HR Manager to drive our people strategy in milk 
                supplying services. He mainly needs to deal with the responsibilities of employees and training 
                for them.
              </p>
            </div>
            
            <div className="content-section">
              <h3 className="job-section-title">Responsibilities</h3>
              <ul>
                <li>Handling recruitment process</li>
                <li>Building the organizational structure of the company.</li>
                <li>HR Policies and terms.</li>
                <li>Rewards and Recognition for employee's performances.</li>
                <li>Training and development progress.</li>
                <li>Salaries and settlements by legal or financial.</li>
              </ul>
            </div>
            
            <div className="content-section">
              <h3 className="job-section-title">Qualification</h3>
              <ul>
                <li>Must hold a BBA degree.</li>
                <li>Organizational skill in training.</li>
                <li>Minimum one-year leadership experience in relative sectors.</li>
                <li>Male/Female</li>
              </ul>
            </div>
            
            <div className="apply-section">
              <button className="apply-btn" onClick={() => alert('Application submitted for Human Resource Manager!')}>Apply Now</button>
            </div>
          </div>
        </div>
      </section>
    </>
  );

  const renderCareerWebAppMgmtView = () => (
    <>
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">Web and App Management Careers</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item" onClick={() => setView('HOME')}>Home</li>
              <li className="breadcrumb-item" onClick={() => setView('CAREERS')}>Careers</li>
              <li className="breadcrumb-item active" aria-current="page">Web and App Management</li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Web and Application Developer */}
      <section className="job-details-section">
        <div className="container">
          <div className="job-header">
            <h1>Web and Application Management</h1>
            <h2>Web and Application Developer</h2>
            
            <div className="job-meta">
              <div className="meta-item">
                <i className="bi bi-hash"></i>
                <span>Job No: 4001</span>
              </div>
              <div className="meta-item">
                <i className="bi bi-info-circle"></i>
                <span>Status: Into Effect Soon</span>
              </div>
              <div className="meta-item">
                <i className="bi bi-airplane"></i>
                <span>Travel: 1-10%</span>
              </div>
              <div className="meta-item">
                <i className="bi bi-briefcase"></i>
                <span>Full Time</span>
              </div>
            </div>
          </div>
          
          <div className="job-content">
            <div className="content-section">
              <h3 className="job-section-title">Roles</h3>
              <p>
                Ko-Milk is a complete e-commerce platform handling the milk industry from procurement to delivery 
                in a complete digital platform. Web and application management at Ko-Milk refers to all of the 
                activities included in the process of developing, maintaining, and upgrading our website and 
                application. This is an opportunity to use your skills while learning more and gaining more 
                experience as you work directly on our company web and application management. The position 
                combines in-depth technical expertise.
              </p>
            </div>
            
            <div className="content-section">
              <h3 className="job-section-title">Responsibilities</h3>
              <ul>
                <li>Management of company website and application</li>
                <li>Editing and adding website content at the code level (in HTML and CSS)</li>
                <li>Management of website meta details and website SEO with effective keyword phrases</li>
                <li>Management of Google Analytics, Search Console, and Google Business</li>
                <li>Responsible for staffing, staff management, performance management, and service improvement</li>
                <li>Managing company system hardware and software implementation</li>
              </ul>
            </div>
            
            <div className="content-section">
              <h3 className="job-section-title">Qualification</h3>
              <ul>
                <li>Any degree</li>
                <li>Age: 22 to 30</li>
                <li>Minimum 1 year experience in a relevant field</li>
                <li>Male/Female candidates can apply</li>
              </ul>
            </div>
            
            <div className="content-section">
              <h3 className="job-section-title">Skill Requirements</h3>
              <ul>
                <li>Knowledge of system design, development, implementation, and user support principles</li>
                <li>Experience with database management</li>
                <li>Familiarity with project management principles</li>
                <li>Experience with information system troubleshooting</li>
                <li>Skill in developing automated business systems</li>
                <li>Ability to communicate technical info to non-technical audiences</li>
              </ul>
            </div>
            
            <div className="apply-section">
              <button className="apply-btn" onClick={() => alert('Application submitted for Web and Application Developer!')}>Apply Now</button>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="job-separator"></div>
      </div>

      {/* SEO / SMM / Digital Marketing Executives */}
      <section className="job-details-section">
        <div className="container">
          <div className="job-header">
            <h1>Web and App Management</h1>
            <h2>SEO / SMM / Digital Marketing Executives</h2>
            
            <div className="job-meta">
              <div className="meta-item">
                <i className="bi bi-hash"></i>
                <span>Job No: 4002</span>
              </div>
              <div className="meta-item">
                <i className="bi bi-info-circle"></i>
                <span>Status: Into Effect Soon</span>
              </div>
              <div className="meta-item">
                <i className="bi bi-airplane"></i>
                <span>Travel: 1-10%</span>
              </div>
              <div className="meta-item">
                <i className="bi bi-briefcase"></i>
                <span>Full Time</span>
              </div>
            </div>
          </div>
          
          <div className="job-content">
            <div className="content-section">
              <h3 className="job-section-title">Roles</h3>
              <p>
                In a digital marketing strategy, search engine optimization and social media optimization is an integral 
                part to drive customers to our business and increase volume of sales with our digital sale platforms. 
                Digital marketing executives at Ko-Milk need to plan and execute online marketing campaigns and design, 
                maintain and supply content for the organization's website and application.
              </p>
            </div>
            
            <div className="content-section">
              <h3 className="job-section-title">Responsibilities</h3>
              <ul>
                <li>Formulation of strategies to build an effective digital connection with users</li>
                <li>Regular monitoring of the company social media pages like Twitter, Facebook etc.</li>
                <li>Online promotion on Google Adwords, Facebook to increase company and brand awareness among society</li>
                <li>Active involvement in SEO efforts like keyword, image optimization etc.</li>
                <li>Preparing posters and offers and organizing their distribution through various channels</li>
                <li>Regular blog updating with effective content</li>
                <li>Collaborate with app developers to improve user experience</li>
                <li>Analyzing performance of digital marketing efforts using various Web analytics tools (Google Analytics, WebTrends etc.)</li>
                <li>Acquire insight into online marketing trends and keep strategies up-to-date</li>
                <li>Maintain partnerships with media agencies and vendors</li>
                <li>Generating and submitting monthly reports on work and insights</li>
              </ul>
            </div>
            
            <div className="content-section">
              <h3 className="job-section-title">Qualification</h3>
              <ul>
                <li>Any degree</li>
                <li>Age: 23 to 25</li>
                <li>Male/Female candidates</li>
                <li>Proven experience as Digital Marketing Executive or similar role</li>
              </ul>
            </div>
            
            <div className="content-section">
              <h3 className="job-section-title">Skills required</h3>
              <ul>
                <li>Excellent understanding of digital marketing concepts and best practices</li>
                <li>Experience with B2C social media, Google Adwords, email campaigns and SEO/SEM</li>
                <li>Knowledge of ad serving tools (e.g., DART, Atlas)</li>
                <li>Perfect knowledge of web analytics tools (Google Analytics, Net Insight, WebTrends etc.)</li>
                <li>Experience in creative content writing</li>
                <li>Analytical mindset and critical thinking</li>
                <li>Excellent communication and interpersonal skills</li>
              </ul>
            </div>
            
            <div className="apply-section">
              <button className="apply-btn" onClick={() => alert('Application submitted for Digital Marketing Executive!')}>Apply Now</button>
            </div>
          </div>
        </div>
      </section>
    </>
  );

  const renderCareerMarketingView = () => (
    <>
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">Marketing Careers</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item" onClick={() => setView('HOME')}>Home</li>
              <li className="breadcrumb-item" onClick={() => setView('CAREERS')}>Careers</li>
              <li className="breadcrumb-item active" aria-current="page">Marketing</li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Marketing Head */}
      <section className="job-details-section">
        <div className="container">
          <div className="job-header">
            <h1>Marketing</h1>
            <h2>Marketing Head</h2>
            
            <div className="job-meta">
              <div className="meta-item">
                <i className="bi bi-hash"></i>
                <span>Job No: 5001</span>
              </div>
              <div className="meta-item">
                <i className="bi bi-info-circle"></i>
                <span>Status: Into Effect Soon</span>
              </div>
              <div className="meta-item">
                <i className="bi bi-airplane"></i>
                <span>Travel: 60-80%</span>
              </div>
              <div className="meta-item">
                <i className="bi bi-briefcase"></i>
                <span>Full Time</span>
              </div>
            </div>
          </div>
          
          <div className="job-content">
            <div className="content-section">
              <h3 className="job-section-title">Roles</h3>
              <p>
                Marketing plays a special role at Ko-Milk. Marketing team develops pricing strategies with respect 
                to maximize the profit of the business. At the same time they have an eye on customer satisfaction. 
                Ko-Milk never markets an adulterated milk to its users. Always swear to supply purest milk than its 
                competitors. Marketing team needs to find demand for our product and the service offered by Ko-Milk. 
                They represent the company and carry forward the company's specialties to customers.
              </p>
            </div>
            
            <div className="content-section">
              <h3 className="job-section-title">Responsibilities</h3>
              <ul>
                <li>Developing pricing, balancing company management and customer satisfaction.</li>
                <li>Observing demand of the product in the market and way of service.</li>
                <li>Promotion and advertising which leads to subscription of customers.</li>
                <li>Evaluating expenses by each and every department.</li>
                <li>Training for field executives.</li>
                <li>Planning direct promotion at the supply point.</li>
                <li>Negotiating with customers to get milk as per customer addition.</li>
                <li>Performing awareness programs and branding activities.</li>
                <li>Advising management about factors affecting income of the business.</li>
                <li>Conducting surveys and collecting customer feedback regularly.</li>
                <li>Report generation regarding customer behavior.</li>
                <li>Proper coordination with other departments to achieve core job done.</li>
              </ul>
            </div>
            
            <div className="content-section">
              <h3 className="job-section-title">Qualification</h3>
              <ul>
                <li>MBA Graduated</li>
                <li>Age: 24 to 30</li>
                <li>Minimum 1 year experience in relevant field</li>
                <li>Male/Female candidates can apply</li>
              </ul>
            </div>
            
            <div className="apply-section">
              <button className="apply-btn" onClick={() => alert('Application submitted for Marketing Head!')}>Apply Now</button>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="job-separator"></div>
      </div>

      {/* Field Executives */}
      <section className="job-details-section">
        <div className="container">
          <div className="job-header">
            <h1>Marketing</h1>
            <h2>Field Executives</h2>
            
            <div className="job-meta">
              <div className="meta-item">
                <i className="bi bi-hash"></i>
                <span>Job No: 5002</span>
              </div>
              <div className="meta-item">
                <i className="bi bi-info-circle"></i>
                <span>Status: Into Effect Soon</span>
              </div>
              <div className="meta-item">
                <i className="bi bi-airplane"></i>
                <span>Travel: 60-80%</span>
              </div>
              <div className="meta-item">
                <i className="bi bi-briefcase"></i>
                <span>Full Time</span>
              </div>
            </div>
          </div>
          
          <div className="job-content">
            <div className="content-section">
              <h3 className="job-section-title">Roles</h3>
              <p>
                Field executives are clear with our product and services. They have clear understandings about product 
                and services to the customers. Analyzing marketing and giving suggestions to expanding customer base. 
                They are on fields to negotiate with association of housing boards for promotions or starting supply. 
                They also work closely with other departments to drive cost efficiency.
              </p>
            </div>
            
            <div className="content-section">
              <h3 className="job-section-title">Responsibilities</h3>
              <ul>
                <li>Field executive will approach customers directly for promotion of brand.</li>
                <li>They will negotiate costs with customers in case of bulk orders.</li>
                <li>They will be driven by marketing head. Reports need to submit as per their instructions.</li>
                <li>Performing exhibition stalls.</li>
                <li>Report generation as per management needs.</li>
                <li>Field work as commented by marketing head.</li>
              </ul>
            </div>
            
            <div className="content-section">
              <h3 className="job-section-title">Qualification</h3>
              <ul>
                <li>BBA Graduated</li>
                <li>Age: 23 to 25</li>
                <li>Male candidates, Fresher's with marketing passionate.</li>
              </ul>
            </div>
            
            <div className="apply-section">
              <button className="apply-btn" onClick={() => alert('Application submitted for Field Executives!')}>Apply Now</button>
            </div>
          </div>
        </div>
      </section>
    </>
  );

  const renderCareerVendorsDevView = () => (
    <>
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">Vendor Development and Management</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item" onClick={() => setView('HOME')}>Home</li>
              <li className="breadcrumb-item" onClick={() => setView('CAREERS')}>Careers</li>
              <li className="breadcrumb-item active" aria-current="page">Vendor Development</li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Collection Incharge */}
      <section className="job-details-section">
        <div className="container">
          <div className="job-header">
            <h1>Vendor Development and Management</h1>
            <h2>Collection Incharge</h2>
            
            <div className="job-meta">
              <div className="meta-item">
                <i className="bi bi-hash"></i>
                <span>Job No: 1001</span>
              </div>
              <div className="meta-item">
                <i className="bi bi-info-circle"></i>
                <span>Status: Hiring</span>
              </div>
              <div className="meta-item">
                <i className="bi bi-airplane"></i>
                <span>Travel: 90-95%</span>
              </div>
              <div className="meta-item">
                <i className="bi bi-briefcase"></i>
                <span>Part Time</span>
              </div>
            </div>
          </div>
          
          <div className="job-content">
            <div className="content-section">
              <h3 className="job-section-title">Roles</h3>
              <p>
                Collection Incharge is Our First Employee of the Company. The Designation involves a Punctuality, Discipline
                and Good Communication Between Vendors and Area Manager. Ko Milk Will Allot Two Persons in One Area,
                So that You Can able to Coordinate with Each Other and Can Work as a Team. Holidays and Rest Required is
                Concluded by Two of You.
              </p>
            </div>
            
            <div className="content-section">
              <h3 className="job-section-title">Responsibilities</h3>
              <ul>
                <li>He is Reporting person to Area Manager</li>
                <li>He should be Communicating Vendors thoughts to Area Manager</li>
                <li>He is Part Time Worker. He should be present at the site for 2 hours each at morning and evening.</li>
                <li>He should be very careful while handling milk. If any Wastage of Milk Occurs He Should Take Full Responsibility and the amount is debited from their incentive amount after enquiry. Ko-Milk Will Not Pay any Amount respect to the milk wastage. Coordination and Team Work between two persons is allowed.</li>
                <li>They are sole responsible for Milk to reach the Van.</li>
                <li>He should regularly update the data sheet and handover to the Area Manager.</li>
                <li>He is Responsible for Cleanliness of Cans and Quality of Milk.</li>
                <li>He Should Collect Milk after Certain Testing Methods allotted by company.</li>
                <li>He should act as a company representative to the Vendors.</li>
                <li>He should be Informed the handling quantity to the Manager.</li>
              </ul>
            </div>
            
            <div className="content-section">
              <h3 className="job-section-title">Qualification</h3>
              <ul>
                <li>No educational qualifications</li>
                <li>Fresher/Experienced</li>
                <li>Male candidates only</li>
              </ul>
            </div>
            
            <div className="apply-section">
              <button className="apply-btn" onClick={() => alert('Application submitted for Collection Incharge!')}>Apply Now</button>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="job-separator"></div>
      </div>

      {/* Vendor Area Manager */}
      <section className="job-details-section">
        <div className="container">
          <div className="job-header">
            <h1>Vendor Development and Management</h1>
            <h2>Vendor Area Manager</h2>
            
            <div className="job-meta">
              <div className="meta-item">
                <i className="bi bi-hash"></i>
                <span>Job No: 1002</span>
              </div>
              <div className="meta-item">
                <i className="bi bi-info-circle"></i>
                <span>Status: Hiring</span>
              </div>
              <div className="meta-item">
                <i className="bi bi-airplane"></i>
                <span>Travel: 60-80%</span>
              </div>
              <div className="meta-item">
                <i className="bi bi-briefcase"></i>
                <span>Freelance</span>
              </div>
            </div>
          </div>
          
          <div className="job-content">
            <div className="content-section">
              <h3 className="job-section-title">Roles</h3>
              <p>
                Vendors Development and Management is heart of our business. You are playing an important role for the 
                Business. So, Ko-Milk Gives Extra Ordinary Benefits for this Designation with Full of Freedom. Ko-Milk 
                Needs a dedicated, Work Believer to handle vendors and to be a Vendor Area Manager. He should be Social 
                Minded and he is open power to solve vendor's issues in local area.
              </p>
            </div>
            
            <div className="content-section">
              <h3 className="job-section-title">Responsibilities</h3>
              <ul>
                <li>Company Representative for Farmers.</li>
                <li>He/She Should be Handling Company management work at his/her area.</li>
                <li>He/She is the Head of Co Workers in the Collection Department.</li>
                <li>He/She is the Incharge for Collection and Loading of Milk in to the Logistics.</li>
                <li>He/She Can Work as Per their Wish, As a Freelancer.</li>
                <li>Regular follow up of their team is a must.</li>
                <li>Regular Report to be submitted at the Head Office on Time.</li>
                <li>He/She is the Reportable Person to the Vendor Head at the Head Office.</li>
                <li>He/She Should able to discuss any kind of matters that involves from Vendor Side.</li>
                <li>He/She should resolve any kind of issues arise from vendors side.</li>
                <li>He/She should update milk vending date of vendors regularly.</li>
                <li>They Would able to Add Supply to Vendor as per requirement.</li>
              </ul>
            </div>
            
            <div className="content-section">
              <h3 className="job-section-title">Qualification</h3>
              <ul>
                <li>High school graduated.</li>
                <li>Organizational skills and leadership.</li>
                <li>Fresher.</li>
                <li>Male/Female</li>
              </ul>
            </div>
            
            <div className="apply-section">
              <button className="apply-btn" onClick={() => alert('Application submitted for Vendor Area Manager!')}>Apply Now</button>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="job-separator"></div>
      </div>

      {/* Vendor Head */}
      <section className="job-details-section">
        <div className="container">
          <div className="job-header">
            <h1>Vendor Development and Management</h1>
            <h2>Vendor Head</h2>
            
            <div className="job-meta">
              <div className="meta-item">
                <i className="bi bi-hash"></i>
                <span>Job No: 1003</span>
              </div>
              <div className="meta-item">
                <i className="bi bi-info-circle"></i>
                <span>Status: Into Effect Soon</span>
              </div>
              <div className="meta-item">
                <i className="bi bi-airplane"></i>
                <span>Travel: 50-80%</span>
              </div>
              <div className="meta-item">
                <i className="bi bi-briefcase"></i>
                <span>Full Time</span>
              </div>
            </div>
          </div>
          
          <div className="job-content">
            <div className="content-section">
              <h3 className="job-section-title">Roles</h3>
              <p>
                Vendor development and management is a crucial department at Ko-Milk. This department is responsible 
                for identifying, developing, and managing relationships with milk suppliers and vendors. The Vendor 
                Head plays a key role in ensuring a consistent and high-quality milk supply chain, maintaining strong 
                relationships with farmers and suppliers, and implementing strategies to improve vendor performance and 
                compliance with quality standards.
              </p>
            </div>
            
            <div className="content-section">
              <h3 className="job-section-title">Responsibilities</h3>
              <ul>
                <li>Identifying and onboarding new milk suppliers and vendors</li>
                <li>Developing and maintaining strong relationships with existing vendors</li>
                <li>Ensuring vendors comply with quality standards and regulations</li>
                <li>Negotiating contracts and pricing with suppliers</li>
                <li>Monitoring vendor performance and implementing improvement plans</li>
                <li>Resolving any issues or conflicts with vendors in a timely manner</li>
                <li>Conducting regular vendor audits and assessments</li>
                <li>Implementing strategies to optimize the supply chain</li>
                <li>Collaborating with other departments to ensure smooth operations</li>
                <li>Preparing reports on vendor performance and supply chain metrics</li>
              </ul>
            </div>
            
            <div className="content-section">
              <h3 className="job-section-title">Qualification</h3>
              <ul>
                <li>Bachelor's degree in Agriculture, Business Administration, or related field</li>
                <li>Age: 28 to 40</li>
                <li>Minimum 3 years experience in vendor management or supply chain</li>
                <li>Strong negotiation and communication skills</li>
                <li>Male/Female candidates can apply</li>
              </ul>
            </div>
            
            <div className="apply-section">
              <button className="apply-btn" onClick={() => alert('Application submitted for Vendor Head!')}>Apply Now</button>
            </div>
          </div>
        </div>
      </section>
    </>
  );

  const renderCareerLogisticsView = () => (
    <>
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">Logistics Careers</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item" onClick={() => setView('HOME')}>Home</li>
              <li className="breadcrumb-item" onClick={() => setView('CAREERS')}>Careers</li>
              <li className="breadcrumb-item active" aria-current="page">Logistics</li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Transportation and Logistics */}
      <section className="job-details-section">
        <div className="container">
          <div className="job-header">
            <h1>Logistics</h1>
            <h2>Transportation and Logistics Manager</h2>
            
            <div className="job-meta">
              <div className="meta-item">
                <i className="bi bi-hash"></i>
                <span>Job No: 3001</span>
              </div>
              <div className="meta-item">
                <i className="bi bi-info-circle"></i>
                <span>Status: Into Effect Soon</span>
              </div>
              <div className="meta-item">
                <i className="bi bi-airplane"></i>
                <span>Travel: 60-80%</span>
              </div>
              <div className="meta-item">
                <i className="bi bi-briefcase"></i>
                <span>Full Time</span>
              </div>
            </div>
          </div>
          
          <div className="job-content">
            <div className="content-section">
              <h3 className="job-section-title">Roles</h3>
              <p>
                Logistics is an Incredible Operation in Milk Supplying Chain. Logistics can be performed with one and half hours after receiving milk from collection counter and hand over to the Distribution Center. As a Startup Logistic is performing by vendors. Vendors will be selected after proper agreement, and they will be regulating transformation of milk until the contract ends.
              </p>
              <p>
                Logistics at Ko-Milk is all about controlling vendors who all are performing transportation of milk.
              </p>
            </div>
            
            <div className="content-section">
              <h3 className="job-section-title">Responsibilities</h3>
              <ul>
                <li>The Needs to Recommend Efficient Transformation Modes, Methods, Equipment’s to Transfer the Milk.</li>
                <li>Vendors can be developed at any part of the state according to the logistic plan.</li>
                <li>Creating Policies and Procedures for Logistics Activities.</li>
                <li>Cost Negotiation with vendors and agreement signing authority.</li>
                <li>Monitoring Each Transport and Reporting to Manager.</li>
                <li>Planning of Flow Management.</li>
                <li>Handling Legal Requirement and Disputes.</li>
                <li>Ensuring Companies Policies and Procedures on Product Delivery.</li>
              </ul>
            </div>
            
            <div className="content-section">
              <h3 className="job-section-title">Qualification</h3>
              <ul>
                <li>Any degree</li>
                <li>Management skills</li>
                <li>Minimum one year experienced in relative field.</li>
                <li>Male candidates only.</li>
              </ul>
            </div>
            
            <div className="apply-section">
              <button className="apply-btn" onClick={() => alert('Application submitted for Transportation and Logistics Manager!')}>Apply Now</button>
            </div>
          </div>
        </div>
      </section>
    </>
  );

  const renderCareerDistDeliveryView = () => (
    <>
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">Delivery Careers</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item" onClick={() => setView('HOME')}>Home</li>
              <li className="breadcrumb-item" onClick={() => setView('CAREERS')}>Careers</li>
              <li className="breadcrumb-item active" aria-current="page">Distribution and Delivery</li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Distribution and Delivery Manager */}
      <section className="job-details-section">
        <div className="container">
          <div className="job-header">
            <h1>Distribution and Delivery Manager</h1>
            
            <div className="job-meta">
              <div className="meta-item">
                <i className="bi bi-hash"></i>
                <span>Job No: 2002</span>
              </div>
              <div className="meta-item">
                <i className="bi bi-info-circle"></i>
                <span>Status: Into Effect Soon</span>
              </div>
              <div className="meta-item">
                <i className="bi bi-airplane"></i>
                <span>Travel: 60-80%</span>
              </div>
              <div className="meta-item">
                <i className="bi bi-briefcase"></i>
                <span>Full Time</span>
              </div>
            </div>
          </div>
          
          <div className="job-content">
            <div className="content-section">
              <h3 className="job-section-title">Roles</h3>
              <p>
                Distribution in Ko-Milk refers to exchanging milk to other suitable equipment according to customer locations. 
                It is all about pouring required quantity of milk at supplying points. This process controls milk quantity as per 
                customer addition in particular locations. If one customer adds today in one supplying point, the next day the 
                order quantity must be supplied to the exact location.
              </p>
            </div>
            
            <div className="content-section">
              <h3 className="job-section-title">Responsibilities</h3>
              <ul>
                <li>Regular monitor of customer inflow and regulate milk supply to them.</li>
                <li>Ensuring milk delivery as per customer requirement.</li>
                <li>Co-ordination with other departments to execute operations efficiently.</li>
                <li>Monitoring milk reached at supplying point regularly and preparing reports.</li>
                <li>Planning Milk Supply Equipment for easy assessment at customer location.</li>
                <li>Ensuring cleanliness of supplying equipment.</li>
                <li>Informing time management of Supplying Point Delivery Department.</li>
                <li>Planning efficient supply chain with Logistic Plan.</li>
                <li>Handling executives to carry out progress with location.</li>
              </ul>
            </div>
            
            <div className="content-section">
              <h3 className="job-section-title">Qualification</h3>
              <ul>
                <li>Must hold a degree.</li>
                <li>Knowledge in logistics.</li>
                <li>Minimum one year experience in related sectors.</li>
                <li>Male / Female</li>
              </ul>
            </div>
            
            <div className="apply-section">
              <button className="apply-btn" onClick={() => alert('Application submitted for Distribution Manager!')}>Apply Now</button>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="job-separator"></div>
      </div>

      {/* Distribution Executives */}
      <section className="job-details-section">
        <div className="container">
          <div className="job-header">
            <h1>Distribution Executives</h1>
            
            <div className="job-meta">
              <div className="meta-item">
                <i className="bi bi-hash"></i>
                <span>Job No: 2002</span>
              </div>
              <div className="meta-item">
                <i className="bi bi-info-circle"></i>
                <span>Status: Into Effect Soon</span>
              </div>
              <div className="meta-item">
                <i className="bi bi-airplane"></i>
                <span>Travel: 60-80%</span>
              </div>
              <div className="meta-item">
                <i className="bi bi-briefcase"></i>
                <span>Full Time</span>
              </div>
            </div>
          </div>
          
          <div className="job-content">
            <div className="content-section">
              <h3 className="job-section-title">Roles</h3>
              <p>
                Executives are clearing requirements of supply points and handling logistics to drive them to
                particular locations. They are designated to increase the efficiency of supply chain management.
                He is capable to distribute 2500 liters in a shift.
              </p>
            </div>
            
            <div className="content-section">
              <h3 className="job-section-title">Responsibilities</h3>
              <ul>
                <li>Responsible for proper milk supply to supply point.</li>
                <li>Ensuring cleanliness of cans and handling equipment.</li>
                <li>Handowering milk cans to delivery executives at supply point.</li>
                <li>Collection of cans and equipment to distribution center.</li>
                <li>Ensuring quality of milk from vendors side.</li>
              </ul>
            </div>
            
            <div className="content-section">
              <h3 className="job-section-title">Qualification</h3>
              <ul>
                <li>Minimum 10th completed</li>
                <li>Age: 18 to 26</li>
                <li>Fresher</li>
              </ul>
            </div>
            
            <div className="apply-section">
              <button className="apply-btn" onClick={() => alert('Application submitted for Distribution Executives!')}>Apply Now</button>
            </div>
          </div>
        </div>
      </section>
    </>
  );

  const renderContactView = () => (
    <>
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">Contact Us</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item" onClick={() => setView('HOME')}>Home</li>
              <li className="breadcrumb-item active" aria-current="page">Contact Us</li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-page-section">
        <div className="container">
          <div className="section-title">
            <h2>Get In Touch</h2>
            <p>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
          </div>
          
          <div className="row">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <div className="contact-page-form">
                <form onSubmit={(e) => { e.preventDefault(); alert('Message Sent!'); }}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">First Name</label>
                      <input type="text" className="form-control" required />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Last Name</label>
                      <input type="text" className="form-control" required />
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Email Address</label>
                    <input type="email" className="form-control" required />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Phone Number</label>
                    <input type="tel" className="form-control" required />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Subject</label>
                    <select className="form-select" required>
                      <option value="" disabled selected>Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="order">Order Related</option>
                      <option value="delivery">Delivery Issue</option>
                      <option value="feedback">Feedback</option>
                      <option value="partnership">Partnership</option>
                    </select>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Message</label>
                    <textarea className="form-control" rows={5} required></textarea>
                  </div>
                  
                  <div className="d-grid">
                    <button type="submit" className="btn-submit">Send Message</button>
                  </div>
                </form>
              </div>
            </div>
            
            <div className="col-lg-6">
              <div className="contact-page-info">
                <div className="info-item">
                  <div className="info-icon">
                    <i className="bi bi-geo-alt-fill"></i>
                  </div>
                  <div className="info-content">
                    <h4>Our Location</h4>
                    <p>2/182, Ko-Milk Collection Center, Sengodampalayam, Uduppam(po), Namakkal - 637019</p>
                  </div>
                </div>
                
                <div className="info-item">
                  <div className="info-icon">
                    <i className="bi bi-telephone-fill"></i>
                  </div>
                  <div className="info-content">
                    <h4>Call/WhatsApp</h4>
                    <p>+91 87606 29867</p>
                  </div>
                </div>
                
                <div className="info-item">
                  <div className="info-icon">
                    <i className="bi bi-envelope-fill"></i>
                  </div>
                  <div className="info-content">
                    <h4>Email Us</h4>
                    <p>admin@komilk.in</p>
                  </div>
                </div>
                
                <div className="info-item">
                  <div className="info-icon">
                    <i className="bi bi-clock-fill"></i>
                  </div>
                  <div className="info-content">
                    <h4>Business Hours</h4>
                    <p>Monday - Saturday: 6:00 AM - 8:00 PM<br/>Sunday: 7:00 AM - 2:00 PM</p>
                  </div>
                </div>
                
                <div className="map-container">
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3912.2059372185086!2d78.12802857481329!3d11.319653088864074!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3babc5c15b47bdf1%3A0x94fb1739de4fc1df!2sKo-Milk%20Collection%20Center!5e0!3m2!1sen!2sus!4v1762845232198!5m2!1sen!2sus" 
                      width="100%" 
                      height="100%" 
                      style={{border:0}} 
                      allowFullScreen={true} 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );

  const renderWriteUsView = () => (
    <>
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">Write to Us</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item" onClick={() => setView('HOME')}>Home</li>
              <li className="breadcrumb-item active" aria-current="page">Write to Us</li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Write to Us Section */}
      <section className="write-section">
        <div className="container">
          <div className="section-title">
            <h2>Get In Touch</h2>
            <p>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
          </div>
          
          <div className="row">
            <div className="col-lg-8 mb-4 mb-lg-0">
              <div className="write-form">
                <form onSubmit={(e) => { e.preventDefault(); alert('Message Sent!'); }}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">First Name</label>
                      <input type="text" className="form-control" required />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Last Name</label>
                      <input type="text" className="form-control" required />
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Email Address</label>
                    <input type="email" className="form-control" required />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Phone Number</label>
                    <input type="tel" className="form-control" required />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Subject</label>
                    <select className="form-select" required>
                      <option value="" disabled selected>Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="order">Order Related</option>
                      <option value="delivery">Delivery Issue</option>
                      <option value="feedback">Feedback</option>
                      <option value="partnership">Partnership</option>
                      <option value="careers">Careers</option>
                    </select>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Message</label>
                    <textarea className="form-control" rows={6} required></textarea>
                  </div>
                  
                  <div className="mb-3 form-check">
                    <input type="checkbox" className="form-check-input" id="newsletter" />
                    <label className="form-check-label" htmlFor="newsletter">
                      Subscribe to our newsletter for updates and offers
                    </label>
                  </div>
                  
                  <div className="d-grid">
                    <button type="submit" className="btn-submit">Send Message</button>
                  </div>
                </form>
              </div>
            </div>
            
            <div className="col-lg-4">
              <div className="contact-info">
                <div className="info-item">
                  <div className="info-icon">
                    <i className="bi bi-geo-alt-fill"></i>
                  </div>
                  <div className="info-content">
                    <h4>Our Location</h4>
                    <p>2/182, Ko-Milk Collection Center, Sengodampalayam, Uduppam(po), Namakkal - 637019</p>
                  </div>
                </div>
                
                <div className="info-item">
                  <div className="info-icon">
                    <i className="bi bi-telephone-fill"></i>
                  </div>
                  <div className="info-content">
                    <h4>Call/WhatsApp</h4>
                    <p>+91 87606 29867</p>
                  </div>
                </div>
                
                <div className="info-item">
                  <div className="info-icon">
                    <i className="bi bi-envelope-fill"></i>
                  </div>
                  <div className="info-content">
                    <h4>Email Us</h4>
                    <p>admin@komilk.in</p>
                  </div>
                </div>
                
                <div className="info-item">
                  <div className="info-icon">
                    <i className="bi bi-clock-fill"></i>
                  </div>
                  <div className="info-content">
                    <h4>Business Hours</h4>
                    <p>Monday - Saturday: 6:00 AM - 8:00 PM<br/>Sunday: 7:00 AM - 2:00 PM</p>
                  </div>
                </div>
                
                <div className="social-links">
                  <h4>Follow Us</h4>
                  <div className="social-icons">
                    <a href="#"><i className="bi bi-facebook"></i></a>
                    <a href="#"><i className="bi bi-whatsapp"></i></a>
                    <a href="#"><i className="bi bi-instagram"></i></a>
                    <a href="#"><i className="bi bi-linkedin"></i></a>
                    <a href="#"><i className="bi bi-youtube"></i></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );

  const renderTermsView = () => (
    <>
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">Terms and Conditions</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item" onClick={() => setView('HOME')}>Home</li>
              <li className="breadcrumb-item active" aria-current="page">Terms & Conditions</li>
            </ol>
          </nav>
        </div>
      </section>

      <section className="terms-section">
        <div className="container">
          <div className="terms-container">
            <h2 className="terms-main-title text-center">TERMS AND CONDITIONS</h2>
            <h4 className="terms-sub-title text-center">Terms between Ko-Milk and Customers</h4>

            <div className="terms-content">
              <ul>
                <li>Ko-Milk delivers milk on two scheduled slots (morning/evening). The availability of slots to be confirmed by Ko-Milk itself.</li>
                <li>Time Management is a very essential task for our delivery executives. We cannot spend more than two minutes at customers doorsteps.</li>
                <li>Subscription and payments need to be done by digital format only. Ko-Milk not allows any cash payments direct to our delivery executives.</li>
                <li>Ko-Milk serves based on financial commitments. So subscription charge is essential to get a regular supply. And it will kept on your account wallet.</li>
                <li>Customers can test the milk among our delivery executives. We will examine infront of you and show the results if you requested so.</li>
                <li>In case of apartments without elevators, Ko-Milk recommends to keep our own designed pots infront of doorsteps. We collect, fill and place it again.</li>
                <li>Customer have right to terminate any time. They can unsubscribe by informing us in any of our platforms (Website, mail, app, whatsapp, Call, delivery executives). The balance wallet amount will be refunded to your account within three working days.</li>
                <li>Customers need to pay monthly bill in two days at month starting. If failed supply will be stopped without notice.</li>
                <li>Ko-Milk gives details of milk supply on before last date of month to customers. Customers need to verify. After verification bills will be generated for payments.</li>
                <li>Customers cannot use our delivery executives to their personal work at their duty time.</li>
                <li>Ko-Milk will not supply any other products. Customers should not request to our delivery executives.</li>
                <li>Ko-Milk employees not allowed to enter inside the house of customers. Customers need to support us to do our work as committed.</li>
                <li>Customers can rise an issue regarding any matters in our operations. If proper reply not given by Ko-Milk, customers have full right to complain or sue Ko-Milk.</li>
                <li>We supply pure milk as milked. Customers recommended to mix adequate water when feeding to babies.</li>
                <li>The fat values of our milk is given in product page. Please be aware when you feeding for your baby.</li>
                <li>Test reports of milk we supplied will be shown in our website/app. Customers can check anytime.</li>
                <li>Ko-Milk intends to build plastic less society. So pouring milk in any metal vessels only.</li>
                <li>Milk is delivered within four hours after milked. It is stable for six hours only. Customers need to boil it within one hour after we supply.</li>
                <li>If milk is used by customers after one hour of supply, Ko-Milk is not responsible in the matters of quality. At least customers need to place it in fridge or else need to boil it.</li>
                <li>Our delivery executives are not responsible for cleanliness of pots. It should be maintained by customers itself. We just pouring milk on it.</li>
                <li>Customers need to inform if they want to hold the supply by any of our platforms. If not informed to hold bill will not be considered.</li>
                <li>Ko-Milk will not supply more than two liters to individual customers. If order need in bulk in case of special occasions, customer need to request any of our platforms.</li>
                <li>Customers have full right to sue any of operations after improper information passed to Ko-Milk management. Ko-Milk allows limited customers on a day.</li>
              </ul>
            </div>
          </div>

          <div className="terms-container">
            <h3 className="terms-main-title text-center">Terms between Ko-Milk and Vendors</h3>
            
            <div className="terms-content">
              <ol className="terms-list">
                <li>Vendors should not adulterate any kind of substances in milk. Milk should be handed over to Ko-Milk as milked.</li>
                <li>Cleanliness of milk handling vessels should be ensured by vendors itself.</li>
                <li>Vendors should not deliver milk which is milked before more than one hour.</li>
                <li>Milk should be handed to Ko-Milk on or before committed time without any delay.</li>
                <li>Vendors agreement will be assigned when signing up with an advance payment for 15 days to 30 days as per negotiation.</li>
                <li>Vendors will be paid for their supply monthly once, on the date of 5th.</li>
                <li>Termination between any parties should be informed before one month.</li>
                <li>Milk will be tested before acceptance by Ko-Milk.</li>
                <li>
                  Cow Milk cost will be depends on lacto meter reading. As follows:
                  <ul className="price-list">
                    <li>24 points : 23 Rs.</li>
                    <li>23 points : 23 Rs.</li>
                    <li>22 points : 22 Rs.</li>
                    <li>21 points : 22 Rs.</li>
                    <li>20 & 19 points : 20 Rs.</li>
                    <li>18 points : 20 Rs. (Not Accepted)</li>
                  </ul>
                </li>
                <li>
                  Buffalo Milk cost will be depends on lacto meter reading. As follows:
                  <ul className="price-list">
                    <li>32 points : 45 Rs.</li>
                    <li>31 points : 45 Rs.</li>
                    <li>30 points : 42 Rs.</li>
                    <li>28 points : 41 Rs.</li>
                    <li>28 to 26 points : 38 Rs.</li>
                    <li>26 points : 35 Rs. (Not Accepted)</li>
                  </ul>
                </li>
                <li>Ko-Milk will regularly test the milk in lab. If any illegal adulteration found in milk, it has right to terminate and sue immediately.</li>
                <li>Once the supply is regulated up to six months, the company benefits will be provided to the Vendors.</li>
                <li>
                  Benefits from Ko-Milk:
                  <ul className="benefit-list">
                    <li>Loans and financial support.</li>
                    <li>Insurance on cattle.</li>
                    <li>Fodder at low cost.</li>
                    <li>Medical assistance on cattle.</li>
                  </ul>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </section>
    </>
  );

  return (
    <>
      {/* Top Header */}
      <header className="top-header">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-4">
              <div className="brand-logo">KO-MILK</div>
            </div>
            <div className="col-md-4 text-center">
              <div className="slogan">Milk as Milked, Delivered as Milked</div>
            </div>
            <div className="col-md-4 text-end">
              <button className="order-btn" onClick={() => setView('MILK')}>Order Supply Now</button>
              <button className="login-btn" onClick={() => setIsLoginModalOpen(true)}>
                {loginState === 'loggedIn' ? <><i className="bi bi-person-circle"></i> My Account</> : 'Login'}
              </button>
              <button className="cart-btn position-relative" onClick={() => setIsCartOpen(true)}>
                <i className="bi bi-cart"></i>
                <span className="cart-badge">{cart.reduce((acc, i) => acc + i.quantity, 0)}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Header */}
      <nav className="navbar navbar-expand-lg nav-header">
        <div className="container">
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item">
                <span className={`nav-link ${view === 'HOME' ? 'active' : ''}`} onClick={() => setView('HOME')}>Home</span>
              </li>
              <li className="nav-item">
                <span className={`nav-link ${view === 'MILK' ? 'active' : ''}`} onClick={() => setView('MILK')}>Milk</span>
              </li>
              <li className="nav-item">
                <span className={`nav-link ${view === 'ABOUT' ? 'active' : ''}`} onClick={() => setView('ABOUT')}>About Us</span>
              </li>
              <li className="nav-item">
                <span className={`nav-link ${view === 'CONTACT' ? 'active' : ''}`} onClick={() => setView('CONTACT')}>Contact Us</span>
              </li>
              <li className="nav-item">
                <span className={`nav-link ${view === 'CAREERS' || view === 'CAREER_BUSINESS_ADMIN' || view === 'CAREER_WEB_APP_MGMT' || view === 'CAREER_MARKETING' || view === 'CAREER_VENDORS_DEV' || view === 'CAREER_LOGISTICS' || view === 'CAREER_DIST_DELIVERY' ? 'active' : ''}`} onClick={() => setView('CAREERS')}>Careers</span>
              </li>
              <li className="nav-item">
                <span className={`nav-link ${view === 'WRITE_US' ? 'active' : ''}`} onClick={() => setView('WRITE_US')}>Write to Us</span>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {view === 'HOME' && renderHomeView()}
      {view === 'MILK' && renderMilkView()}
      {view === 'ABOUT' && renderAboutView()}
      {view === 'CONTACT' && renderContactView()}
      {view === 'CAREERS' && renderCareersView()}
      {view === 'CAREER_BUSINESS_ADMIN' && renderCareerBusinessAdminView()}
      {view === 'CAREER_WEB_APP_MGMT' && renderCareerWebAppMgmtView()}
      {view === 'CAREER_MARKETING' && renderCareerMarketingView()}
      {view === 'CAREER_VENDORS_DEV' && renderCareerVendorsDevView()}
      {view === 'CAREER_LOGISTICS' && renderCareerLogisticsView()}
      {view === 'CAREER_DIST_DELIVERY' && renderCareerDistDeliveryView()}
      {view === 'WRITE_US' && renderWriteUsView()}
      {view === 'TERMS' && renderTermsView()}

      {/* Contact Section (Shared) - Render only if NOT on Contact/Careers/WriteUs/Terms Page */}
      {view !== 'CONTACT' && view !== 'CAREERS' && view !== 'CAREER_BUSINESS_ADMIN' && view !== 'CAREER_WEB_APP_MGMT' && view !== 'CAREER_MARKETING' && view !== 'CAREER_VENDORS_DEV' && view !== 'CAREER_LOGISTICS' && view !== 'CAREER_DIST_DELIVERY' && view !== 'WRITE_US' && view !== 'TERMS' && (
        <section className="contact-section" id="contact">
          <div className="container">
            <h2 className="contact-title text-center mb-5">Get In Touch</h2>
            <div className="row g-4">
              {/* Contact Info */}
              <div className="col-lg-5">
                <div className="contact-info">
                  <h3 className="mb-4">Contact Information</h3>
                  <div className="contact-item">
                    <i className="bi bi-geo-alt-fill"></i>
                    <span>2/182, Ko-Milk Collection Center, Sengodampalayam, Uduppam(po), Namakkal - 637019</span>
                  </div>
                  <div className="contact-item">
                    <i className="bi bi-telephone-fill"></i>
                    <span>+91 8760629867</span>
                  </div>
                  <div className="contact-item">
                    <i className="bi bi-envelope-fill"></i>
                    <span>subhash@komilk.in</span>
                  </div>
                  <div className="contact-item">
                    <i className="bi bi-globe"></i>
                    <span>www.komilk.in</span>
                  </div>
                  
                  <div className="mt-4">
                    <h4>Follow Us</h4>
                    <div className="social-icons mt-3">
                      <a href="#"><i className="bi bi-facebook"></i></a>
                      <a href="#"><i className="bi bi-whatsapp"></i></a>
                      <a href="#"><i className="bi bi-instagram"></i></a>
                      <a href="#"><i className="bi bi-youtube"></i></a>
                    </div>
                  </div>

                  <div className="map-container mt-4">
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3912.2059372185086!2d78.12802857481329!3d11.319653088864074!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3babc5c15b47bdf1%3A0x94fb1739de4fc1df!2sKo-Milk%20Collection%20Center!5e0!3m2!1sen!2sus!4v1762845232198!5m2!1sen!2sus" 
                      width="100%" 
                      height="100%" 
                      style={{border:0}} 
                      allowFullScreen={true} 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                </div>
              </div>
              
              {/* Contact Form */}
              <div className="col-lg-7" id="write">
                <div className="contact-form">
                  <h3 className="mb-4">Write to Us</h3>
                  <form onSubmit={(e) => { e.preventDefault(); alert('Message Sent!'); }}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">Your Name</label>
                        <input type="text" className="form-control" required />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Email Address</label>
                        <input type="email" className="form-control" required />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Phone Number</label>
                        <input type="tel" className="form-control" required />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Subject</label>
                        <select className="form-select" required>
                          <option value="" disabled selected>Select a subject</option>
                          <option value="order">Place an Order</option>
                          <option value="query">General Query</option>
                          <option value="feedback">Feedback</option>
                          <option value="complaint">Complaint</option>
                        </select>
                      </div>
                      <div className="col-12">
                        <label className="form-label">Your Message</label>
                        <textarea className="form-control" rows={4} required></textarea>
                      </div>
                      <div className="col-12">
                        <button type="submit" className="submit-btn">Send Message</button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer>
        <div className="container">
          <p>&copy; 2025 KO-MILK. All Rights Reserved.</p>
          <p>
            <span 
              onClick={() => setView('TERMS')} 
              style={{color: '#ced4da', textDecoration: 'none', cursor: 'pointer'}}
            >
              Terms and Conditions
            </span>
          </p>
        </div>
      </footer>

      {/* Cart Sidebar */}
      <div className={`cart-sidebar ${isCartOpen ? 'active' : ''}`}>
        <div className="cart-header">
          <h4 className="mb-0">Your Cart</h4>
          <button type="button" className="btn-close btn-close-white" onClick={() => setIsCartOpen(false)}></button>
        </div>
        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <i className="bi bi-cart-x" style={{fontSize: '3rem'}}></i>
              <p>Your cart is empty</p>
            </div>
          ) : (
            cart.map((item, index) => (
              <div key={index} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div className="cart-item-details">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-price">₹{item.price}/litre</div>
                </div>
                <div className="cart-item-quantity">
                  <button className="quantity-btn" onClick={() => updateQuantity(index, -1)}>-</button>
                  <span className="quantity-value">{item.quantity}</span>
                  <button className="quantity-btn" onClick={() => updateQuantity(index, 1)}>+</button>
                </div>
                <div className="fw-bold ms-3">₹{item.price * item.quantity}</div>
                <button className="btn btn-sm text-danger ms-2" onClick={() => removeItem(index)}>
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            ))
          )}
        </div>
        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total:</span>
              <span>₹{cartTotal}</span>
            </div>
            <button className="checkout-btn" onClick={() => alert('Redirecting to checkout...')}>Checkout</button>
          </div>
        )}
      </div>

      {/* Login Modal */}
      {isLoginModalOpen && (
        <>
          <div className="modal-backdrop fade show" onClick={() => setIsLoginModalOpen(false)}></div>
          <div className="modal fade show d-block" tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Welcome to KO-MILK</h5>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setIsLoginModalOpen(false)}></button>
                </div>
                <div className="modal-body">
                  <ul className="nav nav-tabs mb-3">
                    <li className="nav-item">
                      <button 
                        className={`nav-link ${activeTab === 'login' ? 'active' : ''}`}
                        onClick={() => setActiveTab('login')}
                      >
                        Login
                      </button>
                    </li>
                    <li className="nav-item">
                      <button 
                        className={`nav-link ${activeTab === 'signup' ? 'active' : ''}`}
                        onClick={() => setActiveTab('signup')}
                      >
                        Sign Up
                      </button>
                    </li>
                  </ul>
                  
                  {activeTab === 'login' ? (
                    <form onSubmit={handleLogin}>
                      <div className="mb-3">
                        <label className="form-label">Email address</label>
                        <input type="email" className="form-control" required />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input type="password" className="form-control" required />
                      </div>
                      <div className="mb-3 form-check">
                        <input type="checkbox" className="form-check-input" id="rememberMe" />
                        <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
                      </div>
                      <div className="d-grid">
                        <button type="submit" className="btn btn-primary">Login</button>
                      </div>
                    </form>
                  ) : (
                    <form onSubmit={(e) => { e.preventDefault(); alert('Account created! Please login.'); setActiveTab('login'); }}>
                      <div className="mb-3">
                        <label className="form-label">Full Name</label>
                        <input type="text" className="form-control" required />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Email address</label>
                        <input type="email" className="form-control" required />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input type="password" className="form-control" required />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Confirm Password</label>
                        <input type="password" className="form-control" required />
                      </div>
                      <div className="mb-3 form-check">
                        <input type="checkbox" className="form-check-input" required />
                        <label className="form-check-label">I agree to the terms and conditions</label>
                      </div>
                      <div className="d-grid">
                        <button type="submit" className="btn btn-primary">Sign Up</button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      
      <AIAssistant />
    </>
  );
};

export default App;
